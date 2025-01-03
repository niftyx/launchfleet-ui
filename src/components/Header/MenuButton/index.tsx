import { makeStyles } from "@material-ui/core";
import { ReactComponent as MenuIcon } from "assets/svgs/menu.svg";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
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
  onClick: () => void;
}

export const MenuButton = (props: IProps) => {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <span className={clsx(classes.root, props.className)} onClick={onClick}>
      <MenuIcon />
    </span>
  );
};
