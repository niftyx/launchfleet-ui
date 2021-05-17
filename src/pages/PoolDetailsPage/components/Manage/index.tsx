import { BigNumber } from "@ethersproject/bignumber";
import { Button, Tooltip, Typography, makeStyles } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { ReactComponent as ArrowRightIcon } from "assets/svgs/arrow-right.svg";
import clsx from "clsx";
import { FormLogoUpload, FormTextField, TokenInput } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { getIPFSService } from "services/ipfs";
import { PoolService } from "services/pool";
import { IPool } from "types";
import { formatBigNumber, numberWithCommas } from "utils";
import { EPoolType } from "utils/enums";
import { ZERO_NUMBER } from "utils/number";
import { getLeftTokens } from "utils/pool";
import { NULL_ADDRESS } from "utils/token";
import { isAddress } from "utils/tools";

const useStyles = makeStyles((theme) => ({
  root: { marginTop: 24 },
  section: {
    backgroundColor: theme.colors.ninth,
    borderRadius: 24,
    padding: "24px 32px",
    "& + &": {
      marginTop: 24,
    },
    "& > * + *": {
      marginTop: 16,
    },
  },
  submit: {
    borderRadius: 12,
  },
  submitDisabled: {
    backgroundColor: `${theme.colors.seventh} !important`,
  },
  notify: {
    color: theme.colors.primary,
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
  reloadPoolInfo: () => Promise<void>;
}

interface IState {
  logoUploading: boolean;
  name: string;
  description: string;
  logo: string;
  whitelist: string;
  blacklist: string;
  tokenToWithdraw: BigNumber;
}

export const Manage = (props: IProps) => {
  const classes = useStyles();
  const { pool, reloadPoolInfo } = props;
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const { description, endTime, logo, name, poolType, weiRaised } = pool;
  const ipfsService = getIPFSService();
  const {
    data: {
      feeInfo: { feePercent },
    },
    setTxModalData,
  } = useGlobal();
  const { enqueueSnackbar } = useSnackbar();
  const currentTimeStamp = Math.ceil(Date.now() / 1000);
  const mainToken = getTokenFromAddress(
    networkId || DEFAULT_NETWORK_ID,
    pool.weiToken
  );

  const [state, setState] = useState<IState>({
    name,
    logo,
    description,
    logoUploading: false,
    whitelist: "",
    blacklist: "",
    tokenToWithdraw: ZERO_NUMBER,
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      name,
      logo,
      description,
      logoUploading: false,
      whitelist: "",
    }));
  }, [pool.address]);

  const onUpdateMeta = async () => {
    if (!provider || !account) return;
    const poolService = new PoolService(provider, account, pool.address);
    setTxModalData(true, "Uploading MetaData ...");
    try {
      const meta = await ipfsService.uploadData(
        JSON.stringify({
          name: state.name,
          description: state.description,
          logo: state.logo,
        })
      );
      setTxModalData(true, "Updating ...");
      const txHash = await poolService.setMeta(meta);
      setTxModalData(
        true,
        "Updating ...",
        "Please wait until transaction is confirmed!",
        txHash
      );
      await provider.waitForTransaction(txHash);
      setTxModalData(true, "Loading ...");
      await reloadPoolInfo();
      setTxModalData(false);
    } catch (error) {
      setTxModalData(false);
      enqueueSnackbar(error.message || "Something went wrong!", {
        variant: "error",
      });
    }
  };

  const onAddWhitelist = async () => {
    if (!provider || !account) return;
    const addresses = state.whitelist.split(" ").join("").split(",");
    const invalidAddress = addresses.find((addr) => !isAddress(addr));
    const isValid = state.whitelist !== "" && !invalidAddress;
    if (isValid) {
      const poolService = new PoolService(provider, account, pool.address);

      setTxModalData(true, "Loading ...");
      try {
        const txHash = await poolService.addMultipleWhitelistedAddresses(
          addresses
        );
        setTxModalData(
          true,
          "Waiting ...",
          "Need to wait until the transaction is confirmed",
          txHash
        );
        await provider.waitForTransaction(txHash);
        setTxModalData(true, "Loading ...");
        await reloadPoolInfo();
        setTxModalData(false);
        enqueueSnackbar("You've added addresses to whitelist successfully!");
      } catch (error) {
        setTxModalData(false);
        enqueueSnackbar(error.message || "Something went wrong!", {
          variant: "error",
        });
      }
    }
  };

  const onRemoveWhitelist = async () => {
    if (!provider || !account) return;

    const isValid = state.blacklist !== "" && isAddress(state.blacklist);
    if (isValid) {
      const poolService = new PoolService(provider, account, pool.address);

      setTxModalData(true, "Loading ...");
      try {
        const txHash = await poolService.removeWhitelistedAddress(
          state.blacklist
        );
        setTxModalData(
          true,
          "Waiting ...",
          "Need to wait until the transaction is confirmed",
          txHash
        );
        await provider.waitForTransaction(txHash);
        setTxModalData(true, "Loading ...");
        await reloadPoolInfo();
        setTxModalData(false);
        enqueueSnackbar(
          "You've removed an address from whitelist successfully!"
        );
      } catch (error) {
        setTxModalData(false);
        enqueueSnackbar(error.message || "Something went wrong!", {
          variant: "error",
        });
      }
    }
  };

  const onWithdrawToken = async () => {
    if (!provider || !account) return;
    const tokenLeft = getLeftTokens(pool);

    const isValid = !tokenLeft.isZero();
    if (isValid) {
      const poolService = new PoolService(provider, account, pool.address);

      setTxModalData(true, "Loading ...");
      try {
        const txHash = await poolService.withdrawToken();
        setTxModalData(
          true,
          "Waiting ...",
          "Need to wait until the transaction is confirmed",
          txHash
        );
        await provider.waitForTransaction(txHash);
        setTxModalData(true, "Loading ...");
        await reloadPoolInfo();
        setTxModalData(false);
        enqueueSnackbar("You've withdrawn left tokens successfully!");
      } catch (error) {
        setTxModalData(false);
        enqueueSnackbar(error.message || "Something went wrong!", {
          variant: "error",
        });
      }
    }
  };

  const onWithdrawWeiRaised = async () => {
    if (!provider || !account) return;

    const isValid = !weiRaised.isZero();
    if (isValid) {
      const poolService = new PoolService(provider, account, pool.address);

      setTxModalData(true, "Loading ...");
      try {
        if (mainToken.address === NULL_ADDRESS) {
          // matic
          const txHash = await poolService.withdrawWei(state.tokenToWithdraw);
          setTxModalData(
            true,
            "Waiting ...",
            "Need to wait until the transaction is confirmed",
            txHash
          );
          await provider.waitForTransaction(txHash);
        } else {
          // token
          const txHash = await poolService.withdrawWeiToken(
            state.tokenToWithdraw
          );
          setTxModalData(
            true,
            "Waiting ...",
            "Need to wait until the transaction is confirmed",
            txHash
          );
          await provider.waitForTransaction(txHash);
        }

        setTxModalData(true, "Loading ...");
        await reloadPoolInfo();
        setTxModalData(false);
        enqueueSnackbar("You've withdrawn left tokens successfully!");
      } catch (error) {
        setTxModalData(false);
        enqueueSnackbar(error.message || "Something went wrong!", {
          variant: "error",
        });
      }
    }
  };

  const renderMetaSection = () => {
    const isValid =
      state.name !== "" &&
      state.description !== "" &&
      (state.name !== name ||
        state.description !== description ||
        state.logo !== logo);
    return (
      <div className={classes.section}>
        <FormLogoUpload
          FormControlProps={{ fullWidth: true }}
          InputProps={{
            onChange: async (newFile: File | null) => {
              if (newFile) {
                try {
                  setState((prev) => ({
                    ...prev,
                    logoUploading: true,
                  }));
                  const logoUrl = await ipfsService.uploadData(newFile);
                  setState((prev) => ({
                    ...prev,
                    logoUploading: false,
                    logo: logoUrl,
                  }));
                } catch (error) {
                  console.error(error);
                  setState((prev) => ({
                    ...prev,
                    logoUploading: false,
                  }));
                }
              }
            },
            id: "logo",
            name: "logo",
            value: null,
            onBlur: () => {},
          }}
          imageUrl={state.logo}
          loading={state.logoUploading}
        />
        <FormTextField
          FormControlProps={{ fullWidth: true }}
          FormHelperTextProps={{
            error: state.name === "",
          }}
          InputLabelProps={{
            htmlFor: "name",
            shrink: true,
          }}
          InputProps={{
            id: "name",
            name: "name",
            onBlur: () => {},
            onChange: (event) => {
              setState((prev) => ({
                ...prev,
                logoUploading: false,
                name: event.target.value,
              }));
            },
            placeholder: "",
            value: state.name,
            required: true,
            disableUnderline: true,
          }}
          helperText={state.name === "" ? "Please fill" : ""}
          label="Pool Name"
        />

        <FormTextField
          FormControlProps={{ fullWidth: true }}
          FormHelperTextProps={{
            error: state.description === "",
          }}
          InputLabelProps={{
            htmlFor: "description",
            shrink: true,
          }}
          InputProps={{
            id: "description",
            name: "description",
            onBlur: () => {},
            onChange: (event) => {
              setState((prev) => ({
                ...prev,
                logoUploading: false,
                description: event.target.value,
              }));
            },
            placeholder: "",
            value: state.description,
            required: true,
            disableUnderline: true,
            multiline: true,
          }}
          helperText={state.description === "" ? "Please fill" : ""}
          label="Pool Description"
        />
        <Button
          className={classes.submit}
          classes={{ disabled: classes.submitDisabled }}
          color="primary"
          disabled={!isValid}
          fullWidth
          onClick={onUpdateMeta}
          variant="contained"
        >
          Update&nbsp;&nbsp;
          <ArrowRightIcon />
        </Button>
      </div>
    );
  };

  const renderWhiteListSection = () => {
    const addresses = state.whitelist.split(" ").join("").split(",");
    const invalidAddress = addresses.find((addr) => !isAddress(addr));
    const isValid = state.whitelist !== "" && !invalidAddress;

    return (
      <div className={classes.section}>
        <FormTextField
          FormControlProps={{ fullWidth: true }}
          FormHelperTextProps={{
            error: state.whitelist !== "" && !isValid,
          }}
          InputLabelProps={{
            htmlFor: "whitelist",
            shrink: true,
          }}
          InputProps={{
            id: "whitelist",
            name: "whitelist",
            onBlur: () => {},
            onChange: (event) => {
              setState((prev) => ({
                ...prev,
                logoUploading: false,
                whitelist: event.target.value,
              }));
            },
            placeholder: "0x..., 0x...",
            value: state.whitelist,
            required: true,
            disableUnderline: true,
            multiline: true,
          }}
          helperText={
            state.whitelist !== "" && !isValid
              ? "Please input valid addresses!"
              : "Input comma separated wallet addresses"
          }
          label="Pool Whitelist"
        />
        <Button
          className={classes.submit}
          classes={{ disabled: classes.submitDisabled }}
          color="primary"
          disabled={!isValid}
          fullWidth
          onClick={onAddWhitelist}
          variant="contained"
        >
          Add&nbsp;&nbsp;
          <ArrowRightIcon />
        </Button>
      </div>
    );
  };

  const renderBlackListSection = () => {
    const isValid = state.blacklist !== "" && isAddress(state.blacklist);

    return (
      <div className={classes.section}>
        <FormTextField
          FormControlProps={{ fullWidth: true }}
          FormHelperTextProps={{
            error: state.blacklist !== "" && !isValid,
          }}
          InputLabelProps={{
            htmlFor: "blacklist",
            shrink: true,
          }}
          InputProps={{
            id: "blacklist",
            name: "blacklist",
            onBlur: () => {},
            onChange: (event) => {
              setState((prev) => ({
                ...prev,
                logoUploading: false,
                blacklist: event.target.value,
              }));
            },
            placeholder: "0x...",
            value: state.blacklist,
            required: true,
            disableUnderline: true,
            multiline: true,
          }}
          helperText={
            state.blacklist !== "" && !isValid
              ? "Please input a valid address!"
              : "Input a wallet address to remove from whitelist"
          }
          label="Remove from whitelist"
        />
        <Button
          className={classes.submit}
          classes={{ disabled: classes.submitDisabled }}
          color="primary"
          disabled={!isValid}
          fullWidth
          onClick={onRemoveWhitelist}
          variant="contained"
        >
          Remove&nbsp;&nbsp;
          <ArrowRightIcon />
        </Button>
      </div>
    );
  };

  const renderManageSection = () => {
    const tokenLeft = getLeftTokens(pool);
    return (
      <div className={classes.section}>
        <Typography align="center" className={classes.notify}>
          Left Token:&nbsp;
          {numberWithCommas(formatBigNumber(tokenLeft, pool.tokenDecimals))}
          &nbsp;{pool.tokenSymbol}
        </Typography>
        <Button
          className={classes.submit}
          classes={{ disabled: classes.submitDisabled }}
          color="primary"
          disabled={tokenLeft.isZero()}
          fullWidth
          onClick={onWithdrawToken}
          variant="contained"
        >
          Withdraw Left Token&nbsp;&nbsp;
          <ArrowRightIcon />
        </Button>
        <br />
        <br />
        <Typography align="center" className={classes.notify}>
          Token Raised:&nbsp;
          {numberWithCommas(formatBigNumber(weiRaised, mainToken.decimals))}
          &nbsp;{mainToken.symbol}
        </Typography>
        <TokenInput
          amount={state.tokenToWithdraw}
          maxVisible
          onChangeValue={(wei) => {
            setState((prev) => ({ ...prev, tokenToWithdraw: wei }));
          }}
          onMax={() => {
            setState((prev) => ({ ...prev, tokenToWithdraw: weiRaised }));
          }}
        />
        <Button
          className={classes.submit}
          classes={{ disabled: classes.submitDisabled }}
          color="primary"
          disabled={weiRaised.isZero() || state.tokenToWithdraw.gt(weiRaised)}
          fullWidth
          onClick={onWithdrawWeiRaised}
          variant="contained"
        >
          Withdraw Raised Token&nbsp;&nbsp;
          <Tooltip
            title={`It will charge ${formatBigNumber(
              feePercent,
              1
            )}% fee to withdraw`}
          >
            <HelpOutlineIcon />
          </Tooltip>
        </Button>
      </div>
    );
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      {renderMetaSection()}
      {currentTimeStamp > endTime.toNumber() ? renderManageSection() : null}
      {poolType === EPoolType.Private ? renderWhiteListSection() : null}
      {poolType === EPoolType.Private ? renderBlackListSection() : null}
    </div>
  );
};
