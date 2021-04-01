import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: { marginTop: 24 },
}));

interface IProps {
  className?: string;
}

export const AboutProject = (props: IProps) => {
  const classes = useStyles();
  return <div className={clsx(classes.root, props.className)}></div>;
};
