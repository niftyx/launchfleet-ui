import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { IPool } from "types";

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
  pool: IPool;
}

export const PoolStatusTag = (props: IProps) => {
  const classes = useStyles();
  // const {
  //   pool: { poolStatus: status },
  // } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <span className={clsx(classes.tag)}></span>
      {/* <span className={classes.label}>{status}</span> */}
    </div>
  );
};
