import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { IPool } from "types";
import { EPoolStatus } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 8,
    },
  },
  label: {
    color: theme.colors.third,
    borderRadius: 8,
    fontSize: 12,
  },
  tag: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    backgroundColor: theme.colors.primary,
    "&.active": {
      backgroundColor: theme.colors.fourth,
    },
    "&.finished": {
      backgroundColor: theme.colors.seventh,
    },
    "&.claimable": {
      backgroundColor: theme.colors.fifteen,
    },
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

export const PoolStatusTag = (props: IProps) => {
  const classes = useStyles();
  const {
    pool: { claimTime, endTime, startTime },
  } = props;

  const timestamp = Math.ceil(Date.now() / 1000);
  let status = EPoolStatus.Created;

  if (timestamp > claimTime.toNumber()) {
    status = EPoolStatus.Claimable;
  } else if (timestamp > endTime.toNumber()) {
    status = EPoolStatus.Finished;
  } else if (timestamp > startTime.toNumber()) {
    status = EPoolStatus.Active;
  }

  return (
    <div className={clsx(classes.root, props.className)}>
      <span className={clsx(classes.tag, status.toLowerCase())}></span>
      <span className={classes.label}>{status}</span>
    </div>
  );
};
