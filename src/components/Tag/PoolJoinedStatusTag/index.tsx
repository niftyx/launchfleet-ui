import { BigNumber } from "@ethersproject/bignumber";
import { makeStyles } from "@material-ui/core";
import { ReactComponent as UsersIcon } from "assets/svgs/users.svg";
import clsx from "clsx";
import React from "react";
import { IPool } from "types";
import { getLeftTokens } from "utils/pool";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
    alignItems: "center",
  },
  count: {
    color: theme.colors.third,
    fontSize: 11,
    marginRight: 8,
  },
  progressbar: {
    marginLeft: 16,
    width: 88,
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
    width: 88,
    height: 7,
    "&.filled": {
      background: "none",
      backgroundColor: theme.colors.tenth,
    },
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

export const PoolJoinedStatusTag = (props: IProps) => {
  const classes = useStyles();
  const { pool } = props;
  const leftTokens = getLeftTokens(pool);
  const percentNumber = pool.startTime
    .sub(leftTokens)
    .mul(BigNumber.from(100))
    .div(pool.startTime);
  const percent = percentNumber.toNumber();

  return (
    <div className={clsx(classes.root, props.className)}>
      <span className={clsx(classes.count)}>
        {pool.totalMembers.toNumber()}
      </span>
      <UsersIcon />
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
    </div>
  );
};
