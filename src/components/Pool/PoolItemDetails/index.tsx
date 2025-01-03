import { BigNumber } from "@ethersproject/bignumber";
import { Avatar, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as UsersIcon } from "assets/svgs/users.svg";
import clsx from "clsx";
import { PoolTypeTag } from "components/Tag";
import { DEFAULT_DECIMALS, DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import React from "react";
import { IPool } from "types";
import { formatBigNumber, formatToShortNumber, shortenAddress } from "utils";
import { ETH_NUMBER } from "utils/number";
import { getLeftTokens } from "utils/pool";

const useStyles = makeStyles((theme) => ({
  root: {},
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& + &": {
      marginTop: 12,
    },
  },
  avatar: {
    width: 40,
    height: 40,
    border: `2px solid ${theme.colors.third}`,
  },
  title: {
    margin: "0 24px",
    color: theme.colors.secondary,
    flex: 1,
  },
  address: {
    color: theme.colors.primary,
    fontSize: 13,
  },
  comment: {
    color: theme.colors.third,
    fontSize: 12,
  },
  value: {
    color: theme.colors.secondary,
    fontSize: 18,
    lineHeight: 1.5,
    marginTop: 4,
  },
  count: {
    color: theme.colors.third,
    fontSize: 11,
  },
  progressbar: {
    margin: "12px 0",
    height: 7,
    borderRadius: 3,
    backgroundColor: theme.colors.sixth,
    position: "relative",
  },
  progress: {
    height: 7,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBg: {
    background: theme.colors.gradient1,
    height: 7,
    "&.filled": {
      background: "none",
      backgroundColor: theme.colors.tenth,
    },
  },
  progressComment: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 600,
  },
  subRow: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 16,
    },
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

export const PoolItemDetails = (props: IProps) => {
  const classes = useStyles();
  const { pool } = props;
  const {
    data: { price },
  } = useGlobal();
  const { networkId } = useConnectedWeb3Context();
  const startTime = pool.startTime.toNumber();
  const nowTime = Math.floor(Date.now() / 1000);
  const mainToken = getTokenFromAddress(
    networkId || DEFAULT_NETWORK_ID,
    pool.weiToken
  );
  const isUpcoming = startTime > nowTime;

  const leftTokens = getLeftTokens(pool);

  const percentNumber = pool.tokenTarget
    .sub(leftTokens)
    .mul(BigNumber.from(100))
    .div(pool.tokenTarget);
  const percent = percentNumber.toNumber();

  const tokenPrice = (price as any)[mainToken.symbol.toLowerCase()].price;
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
      <div className={classes.row}>
        <Avatar className={classes.avatar} src={pool.logo} />
        <Typography className={classes.title}>{pool.name}</Typography>
        <Typography className={classes.address}>
          {shortenAddress(pool.token)}
        </Typography>
      </div>
      <div className={classes.row}>
        <div>
          <Typography className={classes.comment}>Swap ratio</Typography>
          <Typography className={classes.value}>
            1{mainToken.symbol.toUpperCase()} =&nbsp;
            {formatToShortNumber(formatBigNumber(pool.multiplier, 0))}&nbsp;
            {pool.tokenSymbol}
          </Typography>
        </div>
        <div>
          <Typography className={classes.comment}>
            {isUpcoming ? "To raise" : "Raised"}
          </Typography>
          <Typography className={classes.value}>${totalRaisedStr}</Typography>
        </div>
      </div>
      <div className={classes.progressbar}>
        <div
          className={clsx(classes.progress)}
          style={{ width: `${percent}%` }}
        >
          <div
            className={clsx(
              classes.progressBg,
              percent === 100 ? "filled" : ""
            )}
          ></div>
        </div>
      </div>
      <div className={classes.row}>
        <Typography className={classes.progressComment}>
          Progress {percent}%
        </Typography>
        <div className={classes.subRow}>
          <span className={clsx(classes.count)}>
            {pool.totalMembers.toNumber()}
          </span>
          <UsersIcon />
          <PoolTypeTag poolType={pool.poolType} />
        </div>
      </div>
    </div>
  );
};
