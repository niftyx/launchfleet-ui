import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_DECIMALS } from "config/constants";
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
  const {
    pool: { rate, tokenSymbol },
  } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.tag}>Price: $23.50</div>
      <div className={classes.label}>
        1 AVAX = {formatToShortNumber(formatBigNumber(rate, DEFAULT_DECIMALS))}{" "}
        {tokenSymbol}
      </div>
    </div>
  );
};
