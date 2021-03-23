import { Avatar, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as UsersIcon } from "assets/svgs/users.svg";
import clsx from "clsx";
import { PrivateTag } from "components/Tag";
import { PublicTag } from "components/Tag/PublicTag";
import { DEFAULT_DECIMALS } from "config/constants";
import React from "react";
import { IPool } from "types";
import { formatBigNumber, formatToShortNumber, shortenAddress } from "utils";
import { ZERO_NUMBER } from "utils/number";

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
    backgroundColor: theme.colors.ninth,
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
  const finishTime = pool.finishTime.toNumber();
  const diff = finishTime - Math.floor(Date.now() / 1000);
  const isPrivate = pool.openForAll.eq(ZERO_NUMBER);
  const percent = 60;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.row}>
        <Avatar className={classes.avatar} src={pool.img} />
        <Typography className={classes.title}>{pool.tokenName}</Typography>
        <Typography className={classes.address}>
          {shortenAddress(pool.token)}
        </Typography>
      </div>
      <div className={classes.row}>
        <div>
          <Typography className={classes.comment}>Swap ratio</Typography>
          <Typography className={classes.value}>
            1AVAX ={" "}
            {formatToShortNumber(formatBigNumber(pool.rate, DEFAULT_DECIMALS))}{" "}
            {pool.tokenSymbol}
          </Typography>
        </div>
        <div>
          <Typography className={classes.comment}>Raised</Typography>
          <Typography className={classes.value}>$240K</Typography>
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
              (percent & 2) === 1 ? "filled" : ""
            )}
          ></div>
        </div>
      </div>
      <div className={classes.row}>
        <Typography className={classes.progressComment}>
          Progress {percent}%
        </Typography>
        <div className={classes.subRow}>
          <span className={clsx(classes.count)}>141</span>
          <UsersIcon />
          {isPrivate ? <PrivateTag /> : <PublicTag />}
        </div>
      </div>
    </div>
  );
};
