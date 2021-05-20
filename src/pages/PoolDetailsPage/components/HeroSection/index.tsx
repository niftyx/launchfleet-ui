import { BigNumber } from "@ethersproject/bignumber";
import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolItemDetails, PoolStatusTag, Timer, TokenInput } from "components";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useIsMountedRef } from "hooks";
import { useSnackbar } from "notistack";
import { transparentize } from "polished";
import React, { useEffect, useState } from "react";
import { ERC20Service } from "services/erc20";
import { PoolService } from "services/pool";
import { IPool } from "types";
import { formatBigNumber } from "utils";
import { ZERO_NUMBER } from "utils/number";
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
    "&.center-wrapper": {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center",
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
  reloadPoolInfo: () => Promise<void>;
}

interface IState {
  amount: BigNumber;
  balance: BigNumber;
  claimableAmount: BigNumber;
}

export const HeroSection = (props: IProps) => {
  const classes = useStyles();
  const { pool, reloadPoolInfo } = props;
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
  const claimTime = pool.claimTime.toNumber();
  const nowTime = Math.floor(Date.now() / 1000);
  const isLive = startTime <= nowTime && nowTime < endTime;
  const isFinished = nowTime >= endTime && nowTime < claimTime;
  const isClaimable = nowTime > claimTime;
  const isMainCoin = pool.weiToken === NULL_ADDRESS;
  const isMountedRef = useIsMountedRef();

  const [state, setState] = useState<IState>({
    amount: ZERO_NUMBER,
    balance: ZERO_NUMBER,
    claimableAmount: ZERO_NUMBER,
  });
  const isConnected = Boolean(account);

  const maxBuyableAmount = pool.maxWei.sub(
    state.claimableAmount.div(pool.multiplier)
  );

  const maxAmount = maxBuyableAmount.gt(state.balance)
    ? state.balance
    : maxBuyableAmount;

  const onRefresh = () => {
    window.location.reload();
  };

  const loadClaimable = async () => {
    if (!provider) return;
    try {
      const poolService = new PoolService(provider, account, pool.address);
      const claimableAmount = await poolService.getClaimableAmount(
        account || ""
      );
      if (isMountedRef.current === true)
        setState((prev) => ({ ...prev, claimableAmount }));
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadBalance = async () => {
      if (!provider) return;
      try {
        if (isMainCoin) {
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
    loadClaimable();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, networkId, provider]);

  const onMax = () => {
    setState((prev) => ({ ...prev, amount: maxAmount }));
  };

  const onChangeAmount = (amount: BigNumber) => {
    setState((prev) => ({ ...prev, amount }));
  };

  const onClaim = async () => {
    if (!provider) return;
    const poolService = new PoolService(provider, account, pool.address);
    try {
      setTxModalData(true, "Loading ...", "Follow wallet instructions");
      const txHash = await poolService.claim();
      setTxModalData(
        true,
        "Waiting ...",
        "Please wait until the transaction is confirmed!",
        txHash
      );
      await provider.waitForTransaction(txHash);
      enqueueSnackbar("You claimed your token successfully!");
      setTxModalData(true, "Reloading ...");
      await loadClaimable();
      setTxModalData(false);
    } catch (error) {
      console.warn(error);
      enqueueSnackbar((error || { message: "Something went wrong" }).message, {
        variant: "error",
      });
      setTxModalData(false);
    }
  };

  const onJoin = async () => {
    if (!provider) return;
    const poolService = new PoolService(provider, account, pool.address);

    try {
      if (isMainCoin) {
        setTxModalData(true, "Loading ...", "Follow wallet instructions");
        const txHash = await poolService.buyWithEth(state.amount);
        setTxModalData(
          true,
          "Waiting ...",
          "Please wait until the transaction is confirmed!",
          txHash
        );
        await provider.waitForTransaction(txHash);
      } else {
        const erc20Service = new ERC20Service(provider, account, pool.weiToken);
        setTxModalData(true, "Loading ...");

        const hasEnoughAllowance = await erc20Service.hasEnoughAllowance(
          account || "",
          pool.address,
          state.amount
        );

        if (!hasEnoughAllowance) {
          setTxModalData(
            true,
            "Approving tokens ...",
            "Follow wallet instructions"
          );
          const txHash = await erc20Service.approveUnlimited(pool.address);
          setTxModalData(
            true,
            "Approving tokens ...",
            "Please wait until the transaction is confirmed!",
            txHash
          );
          await provider.waitForTransaction(txHash);
        }
        setTxModalData(true, "Loading ...", "Follow wallet instructions");
        const txHash = await poolService.buy(state.amount);
        setTxModalData(
          true,
          "Waiting ...",
          "Please wait until the transaction is confirmed!",
          txHash
        );
        await provider.waitForTransaction(txHash);
      }
      setTxModalData(true, "Reloading ...");
      await loadClaimable();
      await reloadPoolInfo();
      setTxModalData(false);
    } catch (error) {
      console.warn(error);
      enqueueSnackbar((error || { message: "Something went wrong" }).message, {
        variant: "error",
      });
      setTxModalData(false);
    }
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.left}>
        <PoolItemDetails pool={pool} />
      </div>

      {isFinished && (
        <div className={classes.right}>
          <div className={clsx(classes.rightContent, "center-wrapper")}>
            <Typography className={classes.inputComment}>
              You can claim soon:
            </Typography>

            <Timer
              className={classes.time}
              onFinished={onRefresh}
              toTimestamp={claimTime}
            />
          </div>
        </div>
      )}

      {isClaimable && (
        <div className={classes.right}>
          <div className={clsx(classes.rightContent, "center-wrapper")}>
            {isConnected && (
              <>
                <Typography className={classes.inputComment}>
                  Your claimable amount:&nbsp;
                  {formatBigNumber(state.claimableAmount, pool.tokenDecimals)}
                  &nbsp;
                  {pool.tokenSymbol}
                </Typography>
                <br />
              </>
            )}
            <Button
              classes={{
                disabled: classes.joinDisabled,
              }}
              color="primary"
              disabled={isConnected && state.claimableAmount.isZero()}
              fullWidth
              onClick={account ? onClaim : onConnect}
              variant="contained"
            >
              {account ? "Claim" : "Connect wallet and claim"}
            </Button>
          </div>
        </div>
      )}

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
                isConnected &&
                (state.amount.eq(ZERO_NUMBER) || state.amount.gt(maxAmount))
              }
              fullWidth
              onClick={account ? onJoin : onConnect}
              variant="contained"
            >
              {account ? "Join the pool" : "Connect wallet and join"}
            </Button>
            <Timer
              className={classes.time}
              onFinished={onRefresh}
              toTimestamp={endTime}
            />
          </div>
        </div>
      )}
    </div>
  );
};
