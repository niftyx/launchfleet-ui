import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_DECIMALS, DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import moment from "moment";
import React from "react";
import { IPool } from "types";
import { formatBigNumber, formatToShortNumber } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
    flexDirection: "column",
    "& > * + *": {
      marginTop: 3,
    },
    [theme.breakpoints.up("md")]: {
      alignItems: "flex-end",
    },
  },
  label: {
    color: theme.colors.third,

    fontSize: 12,
  },
  tag: {
    color: theme.colors.secondary,

    fontSize: 13,
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

export const PoolPriceTag = (props: IProps) => {
  const classes = useStyles();
  const { networkId } = useConnectedWeb3Context();
  const {
    data: { price },
  } = useGlobal();
  const {
    pool: { multiplier, tokenSymbol, weiToken },
  } = props;

  const mainToken = getTokenFromAddress(
    networkId || DEFAULT_NETWORK_ID,
    weiToken
  );
  const mainTokenPrice = (price as any)[mainToken.symbol.toLowerCase()];
  const tokenPrice = mainTokenPrice.price.div(multiplier);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.tag}>
        Price: ${Number(formatBigNumber(tokenPrice, DEFAULT_DECIMALS, 6))}
      </div>
      <div className={classes.label}>
        1 {mainToken.symbol} =&nbsp;
        {formatToShortNumber(formatBigNumber(multiplier, 0, 0))} {tokenSymbol}
      </div>
    </div>
  );
};
