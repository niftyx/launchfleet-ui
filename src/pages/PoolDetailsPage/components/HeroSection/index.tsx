import { BigNumber } from "@ethersproject/bignumber";
import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolItemDetails, PoolStatusTag, Timer, TokenInput } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getContractAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useSnackbar } from "notistack";
import { transparentize } from "polished";
import React, { useEffect, useState } from "react";
import { ERC20Service } from "services/erc20";
import { PoolFactoryService } from "services/poolFactory";
import { IPool } from "types";
import { ZERO_NUMBER } from "utils/number";
import { getMinMaxAllocationPerWallet } from "utils/pool";
import { NULL_ADDRESS } from "utils/token";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 12,
    backgroundColor: transparentize(0.75, theme.colors.sixth),
    padding: 32,
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      padding: "16px 24px",
      display: "block",
      "& > * + *": {
        marginTop: 16,
      },
    },
  },
  left: {
    flex: 1,
    maxWidth: "50%",
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      maxWidth: "unset",
    },
  },
  right: {
    flex: 1,
    padding: "0 10%",
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      padding: 0,
    },
  },
  rightContent: {
    maxWidth: 270,
    margin: "auto",
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      maxWidth: "none",
    },
  },
  inputCommentWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputComment: {
    color: theme.colors.fourteen,
    fontSize: 12,
    lineHeight: "16px",
  },
  input: {
    marginBottom: 32,
  },
  time: {
    marginTop: 24,
  },
  joinDisabled: {
    backgroundColor: `${theme.colors.seventh} !important`,
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
  poolId: BigNumber;
  reloadPoolInfo: () => Promise<void>;
}

interface IState {
  amount: BigNumber;
  balance: BigNumber;
}

export const HeroSection = (props: IProps) => {
  const classes = useStyles();
  const { pool, poolId, reloadPoolInfo } = props;
  const { setTxModalData } = useGlobal();
  const {
    account,
    library: provider,
    networkId,
    onConnect,
  } = useConnectedWeb3Context();
  const { enqueueSnackbar } = useSnackbar();

  const endTime = pool.endTime.toNumber();
  const startTime = pool.startTime.toNumber();
  const nowTime = Math.floor(Date.now() / 1000);
  // const isLive = startTime <= nowTime && nowTime < endTime;
  const isMainCoinAvax = pool.weiToken === NULL_ADDRESS;
  // const isPrivate = !pool.whiteListId.eq(ZERO_NUMBER);

  const MaxAllocationPerWallet = ZERO_NUMBER,
    MinAllocationPerWallet = ZERO_NUMBER;

  const [state, setState] = useState<IState>({
    amount: ZERO_NUMBER,
    balance: ZERO_NUMBER,
  });

  const onFinished = () => {
    setState((prev) => ({ ...prev, amount: ZERO_NUMBER }));
  };

  useEffect(() => {
    let isMounted = true;
    const loadBalance = async () => {
      if (!provider) return;
      try {
        if (isMainCoinAvax) {
          const balance = await provider.getBalance(account || "");
          if (isMounted) setState((prev) => ({ ...prev, balance }));
        } else {
          const erc20Service = new ERC20Service(
            provider,
            account,
            pool.weiToken
          );
          const balance = await erc20Service.getBalanceOf(account || "");
          if (isMounted) setState((prev) => ({ ...prev, balance }));
        }
      } catch (error) {
        if (isMounted) setState((prev) => ({ ...prev, balance: ZERO_NUMBER }));
      }
    };
    loadBalance();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, networkId, provider]);

  const onMax = () => {
    const maxValue = isMainCoinAvax
      ? MaxAllocationPerWallet.gt(state.balance)
        ? state.balance
        : MaxAllocationPerWallet
      : state.balance;
    setState((prev) => ({ ...prev, amount: maxValue }));
  };

  const onChangeAmount = (amount: BigNumber) => {
    setState((prev) => ({ ...prev, amount }));
  };

  const onJoin = async () => {
    if (!provider) return;
    const factoryAddress = getContractAddress(
      networkId || DEFAULT_NETWORK_ID,
      "factory"
    );
    const factoryService = new PoolFactoryService(provider, "", factoryAddress);
    // try {
    //   if (isMainCoinAvax) {
    //     setTxModalData(true, "Investing ...", "Follow wallet instructions");
    //     const txHash = await poolzService.investETH(
    //       poolId,
    //       state.amount,
    //       account || ""
    //     );
    //     setTxModalData(
    //       true,
    //       "Investing ...",
    //       "Please wait until the transaction is confirmed!",
    //       txHash
    //     );
    //     await provider.waitForTransaction(txHash);
    //     setTxModalData(true, "Reloading ...");
    //     await reloadPoolInfo();
    //     setTxModalData(false);
    //   } else {
    //     const erc20Service = new ERC20Service(provider, account, pool.weiToken);
    //     setTxModalData(true, "Loading ...");

    //     const hasEnoughAllowance = await erc20Service.hasEnoughAllowance(
    //       account || "",
    //       poolContractAddress,
    //       state.amount
    //     );

    //     if (!hasEnoughAllowance) {
    //       setTxModalData(
    //         true,
    //         "Approving tokens ...",
    //         "Follow wallet instructions"
    //       );
    //       const txHash = await erc20Service.approveUnlimited(
    //         poolContractAddress
    //       );
    //       setTxModalData(
    //         true,
    //         "Approving tokens ...",
    //         "Please wait until the transaction is confirmed!",
    //         txHash
    //       );
    //       await provider.waitForTransaction(txHash);
    //     }
    //     setTxModalData(true, "Investing ...", "Follow wallet instructions");
    //     const txHash = await poolzService.investERC20(poolId, state.amount);
    //     setTxModalData(
    //       true,
    //       "Investing ...",
    //       "Please wait until the transaction is confirmed!",
    //       txHash
    //     );
    //     await provider.waitForTransaction(txHash);
    //     setTxModalData(true, "Reloading ...");
    //     await reloadPoolInfo();
    //     setTxModalData(false);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   enqueueSnackbar((error || { message: "Something went wrong" }).message, {
    //     variant: "error",
    //   });
    //   setTxModalData(false);
    // }
  };

  const isLive = true;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.left}>
        <PoolItemDetails pool={pool} />
      </div>

      {isLive && (
        <div className={classes.right}>
          <div className={classes.rightContent}>
            <div className={classes.inputCommentWrapper}>
              <Typography className={classes.inputComment}>
                Your Bid Amount
              </Typography>
              <PoolStatusTag pool={pool} />
            </div>
            <TokenInput
              amount={state.amount}
              className={classes.input}
              maxVisible
              onChangeValue={onChangeAmount}
              onMax={onMax}
            />
            <Button
              classes={{
                disabled: classes.joinDisabled,
              }}
              color="primary"
              disabled={
                state.amount.eq(ZERO_NUMBER) ||
                state.amount.gt(state.balance) ||
                state.amount.gt(MaxAllocationPerWallet) ||
                state.amount.lt(MinAllocationPerWallet)
              }
              fullWidth
              onClick={account ? onJoin : onConnect}
              variant="contained"
            >
              {account ? "Join the pool" : "Connect wallet and join"}
            </Button>
            <Timer
              className={classes.time}
              onFinished={onFinished}
              toTimestamp={endTime}
            />
          </div>
        </div>
      )}
    </div>
  );
};
