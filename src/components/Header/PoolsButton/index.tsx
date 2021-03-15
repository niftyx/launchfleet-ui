import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 12,
    padding: "0 16px",
    height: 36,
    width: 120,
    textDecoration: "none",
    color: theme.colors.default,
    backgroundColor: theme.colors.primary,
    userSelect: "none",
    transition: "all 0.3s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 300,
    "&:hover": {
      opacity: 0.7,
    },
  },
}));

interface IProps {
  className?: string;
}

export const PoolsButton = (props: IProps) => {
  const classes = useStyles();
  return (
    <NavLink className={clsx(classes.root, props.className)} to="/pools">
      View Pools
    </NavLink>
  );
};
