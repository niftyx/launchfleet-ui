import { makeStyles } from "@material-ui/core";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "50%",
    color: theme.colors.primary,
    backgroundColor: theme.colors.default,
    textTransform: "none",
    width: 48,
    height: 48,
    boxShadow: theme.colors.boxShadow1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      color: transparentize(0.3, theme.colors.primary),
    },
  },
}));

interface IProps {
  className?: string;
}

export const NewPoolButton = (props: IProps) => {
  const classes = useStyles();
  return (
    <NavLink className={clsx(classes.root, props.className)} to="/new-pool">
      <AddBoxOutlinedIcon />
    </NavLink>
  );
};
