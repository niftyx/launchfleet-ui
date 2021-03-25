import { BigNumber } from "@ethersproject/bignumber";
import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolItemDetails, PoolLiveFilledTag, TokenInput } from "components";
import { transparentize } from "polished";
import React, { useEffect, useState } from "react";
import { IPool } from "types";
import { ZERO_NUMBER } from "utils/number";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 12,
    backgroundColor: transparentize(0.75, theme.colors.sixth),
    padding: 32,
    display: "flex",
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      padding: "16px 24px",
      display: "block",
      "& > * + *": {
        marginTop: 16,
      },
    },
  },
  left: { flex: 1 },
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
    color: theme.colors.third,
    marginTop: 24,
    fontSize: 12,
    lineHeight: "16px",
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

interface IState {
  amount: BigNumber;
  balance: BigNumber;
}

export const HeroSection = (props: IProps) => {
  const classes = useStyles();
  const { pool } = props;
  const finishTime = pool.finishTime.toNumber();
  const startTime = pool.startTime.toNumber();
  const nowTime = Math.floor(Date.now() / 1000);
  const isLive = startTime <= nowTime && nowTime < finishTime;

  const [state, setState] = useState<IState>({
    amount: ZERO_NUMBER,
    balance: ZERO_NUMBER,
  });

  useEffect(() => {}, []);

  const onMax = () => {};

  const onChangeAmount = (amount: BigNumber) => {
    setState((prev) => ({ ...prev, amount: prev.balance }));
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.left}>
        <PoolItemDetails pool={pool} />
      </div>
      <div className={classes.right}>
        {isLive && (
          <div className={classes.rightContent}>
            <div className={classes.inputCommentWrapper}>
              <Typography className={classes.inputComment}>
                Your Bid Amount
              </Typography>
              <PoolLiveFilledTag />
            </div>
            <TokenInput
              amount={state.amount}
              className={classes.input}
              maxVisible
              onChangeValue={onChangeAmount}
              onMax={onMax}
            />
            <Button color="primary" fullWidth variant="contained">
              Join the pool
            </Button>
            <Typography align="center" className={classes.time}>
              1d : 16h : 47m : 51s
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
