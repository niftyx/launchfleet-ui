import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.sixth,
    color: theme.colors.primary,
    borderRadius: 8,
    fontWeight: 500,
    padding: "6px 12px",
    display: "inline-block",
  },
}));

interface IProps {
  className?: string;
}

export const PrivateTag = (props: IProps) => {
  const classes = useStyles();
  return <div className={clsx(classes.root, props.className)}>Private</div>;
};
