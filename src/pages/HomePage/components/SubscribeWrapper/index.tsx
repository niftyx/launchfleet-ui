import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
    [theme.breakpoints.down("xs")]: {
      height: 100,
    },
  },
  comment: {
    fontSize: 13,
    color: theme.colors.secondary,
    marginBottom: 18,
  },
  button: {
    fontSize: 14,
    color: theme.colors.secondary,
    height: 36,
    backgroundColor: transparentize(0.75, theme.colors.sixth),
  },
}));

interface IProps {
  className?: string;
}

export const SubscribeWrapper = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography className={classes.comment}>
        Subscribe to upcoming pools
      </Typography>
      <Button className={classes.button} variant="contained">
        Get notified
      </Button>
    </div>
  );
};
