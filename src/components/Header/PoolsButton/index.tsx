import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 24,
    padding: "12px 16px",
    height: "100%",
    textDecoration: "none",
    color: theme.colors.third,
    border: `1px solid ${theme.colors.secondary}`,
    backgroundColor: theme.colors.default,
    transition: "all 0.3s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      borderColor: theme.colors.opposite,
      color: theme.colors.default,
      backgroundColor: theme.colors.opposite,
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
      Pools
    </NavLink>
  );
};
