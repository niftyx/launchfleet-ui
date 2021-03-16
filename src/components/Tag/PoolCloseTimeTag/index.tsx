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
    "&.urgent": {
      backgroundColor: theme.colors.fifth,
    },
  },
}));

interface IProps {
  className?: string;
  diff: number;
  timestamp: number;
}

export const PoolCloseTimeTag = (props: IProps) => {
  const classes = useStyles();
  const { diff, timestamp } = props;
  const days = Math.floor(diff / 60 / 60 / 24);
  const diffStr = moment(timestamp * 1000).fromNow();

  return (
    <div className={clsx(classes.root, props.className)}>
      <span className={clsx(classes.tag, days < 3 ? "urgent" : "")}></span>
      <span className={classes.label}>{diffStr}</span>
    </div>
  );
};
