import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import moment from "moment";
import React from "react";

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

    backgroundColor: theme.colors.fourth,
  },
}));

interface IProps {
  className?: string;
  isLive?: boolean; // true: live, false: filled
}

export const PoolLiveFilledTag = (props: IProps) => {
  const classes = useStyles();
  const { isLive = false } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <span className={clsx(classes.tag)}></span>
      <span className={classes.label}>{isLive ? "Live" : "Filled"}</span>
    </div>
  );
};
