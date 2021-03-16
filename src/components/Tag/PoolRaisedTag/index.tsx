import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  raised: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: 500,
    "&.filled": {
      color: theme.colors.tenth,
    },
    "&.upcoming": { fontWeight: 300 },
  },
  raisedComment: {
    color: theme.colors.seventh,
    fontSize: 11,
  },
}));

interface IProps {
  className?: string;
  isFilled?: boolean;
  isUpcoming?: boolean;
}

export const PoolRaisedTag = (props: IProps) => {
  const classes = useStyles();
  const { isFilled = false, isUpcoming = false } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography
        className={clsx(
          classes.raised,
          isFilled ? "filled" : "",
          isUpcoming ? "upcoming" : ""
        )}
      >
        $350K
      </Typography>
      <Typography className={classes.raisedComment}>
        {isUpcoming ? "to be raised" : "raised"}
      </Typography>
    </div>
  );
};
