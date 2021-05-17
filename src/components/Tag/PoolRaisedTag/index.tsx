import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_DECIMALS, DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import React from "react";
import { IPool } from "types";
import { formatBigNumber, formatToShortNumber } from "utils";
import { ETH_NUMBER, ZERO_NUMBER } from "utils/number";
import { getLeftTokens } from "utils/pool";

const useStyles = makeStyles((theme) => ({
  root: {},
  raised: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: 500,
    "&.filled": {
      color: theme.colors.tenth,
    },
    "&.upcoming": { fontWeight: 300 },
  },
  raisedComment: {
    color: theme.colors.seventh,
    fontSize: 11,
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

export const PoolRaisedTag = (props: IProps) => {
  const classes = useStyles();
  const { pool } = props;
  const {
    data: { price },
  } = useGlobal();
  const { networkId } = useConnectedWeb3Context();
  const startTime = pool.startTime.toNumber();
  const nowTime = Math.floor(Date.now() / 1000);
  const leftTokens = getLeftTokens(pool);
  const isFilled = leftTokens.eq(ZERO_NUMBER);
  const isUpcoming = startTime > nowTime;

  const token = getTokenFromAddress(
    networkId || DEFAULT_NETWORK_ID,
    pool.weiToken
  );
  const tokenPrice = (price as any)[token.symbol.toLowerCase()].price;
  const totalRaised = isUpcoming
    ? pool.tokenTarget.mul(tokenPrice).div(pool.multiplier).div(ETH_NUMBER)
    : pool.tokenTarget
        .sub(leftTokens)
        .mul(tokenPrice)
        .div(pool.multiplier)
        .div(ETH_NUMBER);

  const totalRaisedStr = formatToShortNumber(
    formatBigNumber(totalRaised, DEFAULT_DECIMALS)
  );

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography
        className={clsx(
          classes.raised,
          isFilled ? "filled" : "",
          isUpcoming ? "upcoming" : ""
        )}
      >
        ${totalRaisedStr}
      </Typography>
      <Typography className={classes.raisedComment}>
        {isUpcoming ? "to be raised" : "raised"}
      </Typography>
    </div>
  );
};
