import { BigNumber } from "@ethersproject/bignumber";
import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: { textAlign: "center" },
  circle: {
    backgroundColor: theme.colors.secondary,
    width: 60,
    height: 60,
    borderRadius: "50%",
    margin: "auto",
  },
  title: {
    color: theme.colors.secondary,
    margin: "22px 0",
    fontSize: 24,
  },
  description: {
    color: theme.colors.fourteen,
    fontSize: 12,
  },
  link: {
    marginTop: 48,
    display: "flex",
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontSize: 14,
    color: theme.colors.default,
    transition: "all 0.4s",
    "&:hover": {
      opacity: 0.7,
    },
  },
}));

interface IProps {
  className?: string;
  poolId: BigNumber;
}

export const SuccessSection = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.circle}></div>
      <Typography align="center" className={classes.title}>
        Pool successfully created
      </Typography>
      <Typography align="center" className={classes.description}>
        We are going to review your pool and will list it in no time.
      </Typography>
      <NavLink
        className={classes.link}
        to={`/pool/${props.poolId.toHexString()}`}
      >
        Go to pool
      </NavLink>
    </div>
  );
};
