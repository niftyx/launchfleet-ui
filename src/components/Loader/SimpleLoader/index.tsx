import { CircularProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
    minHeight: 50,
  },
}));

interface IProps {
  className?: string;
}

export const SimpleLoader = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <CircularProgress />
    </div>
  );
};
