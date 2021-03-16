import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: transparentize(0.85, theme.colors.fourth),
    color: theme.colors.fourth,
    borderRadius: 8,
    fontWeight: 500,
    padding: "6px 12px",
    display: "inline-block",
  },
}));

interface IProps {
  className?: string;
}

export const PublicTag = (props: IProps) => {
  const classes = useStyles();
  return <div className={clsx(classes.root, props.className)}>Public</div>;
};
