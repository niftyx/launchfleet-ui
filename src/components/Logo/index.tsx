import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 40,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    textDecoration: "none",
  },
  img: {
    height: "100%",
  },
}));

interface IProps {
  className?: string;
}

export const Logo = (props: IProps) => {
  const classes = useStyles();
  return (
    <NavLink className={clsx(classes.root, props.className)} to="/">
      <img alt="logo" className={classes.img} src="/imgs/logo.png" />
    </NavLink>
  );
};
