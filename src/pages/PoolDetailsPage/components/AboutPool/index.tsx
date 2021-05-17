import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { IPool } from "types";

const useStyles = makeStyles((theme) => ({
  root: { marginTop: 24 },
  section: {
    backgroundColor: theme.colors.default,
    borderRadius: 24,
    padding: "24px 32px",
  },
  description: {
    color: theme.colors.fourteen,
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

export const AboutPool = (props: IProps) => {
  const classes = useStyles();
  const { pool } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.section}>
        <Typography className={classes.description}>
          {pool.description}
        </Typography>
      </div>
    </div>
  );
};
