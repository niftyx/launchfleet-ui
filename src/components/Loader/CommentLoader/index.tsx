import { CircularProgress, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  loadTitle: {
    fontSize: theme.spacing(3),
    color: theme.colors.default,
    textAlign: "center",
  },
  loadDescription: {
    fontSize: theme.spacing(2.5),
    color: transparentize(0.3, theme.colors.default),
    textAlign: "center",
  },
}));

interface IProps {
  className?: string;
  title?: string;
  comment?: string;
}

export const CommentLoader = (props: IProps) => {
  const classes = useStyles();

  const {
    comment = "Your NFT is being deploying...",
    title = "Loading...",
  } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <CircularProgress />
      <Typography className={classes.loadTitle}>{title}</Typography>
      <Typography className={classes.loadDescription}>{comment}</Typography>
    </div>
  );
};
