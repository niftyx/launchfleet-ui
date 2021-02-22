import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.colors.primary,
    height: "100%",
    fontSize: 24,
    display: "flex",
    alignItems: "center",
  },
}));

interface IProps {
  className?: string;
}

export const Logo = (props: IProps) => {
  const classes = useStyles();
  return <div className={clsx(classes.root, props.className)}>Snowstorm</div>;
};
