import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 68,
    height: 28,
    borderRadius: 4,
    padding: 2,
    position: "relative",
    backgroundColor: theme.colors.sixth,
    transition: "all 0.4s",
    "&.active": {
      backgroundColor: theme.colors.fourth,
    },
  },
  button: {
    width: 32,
    height: 24,
    position: "absolute",
    left: 2,
    top: 2,
    backgroundColor: theme.colors.default,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.secondary,
    fontSize: 12,
    borderRadius: 4,
    boxShadow: `0 2px 4px ${transparentize(0.81, theme.colors.opposite)}`,
    cursor: "pointer",
    transition: "all 0.4s",
    userSelect: "none",
    "&:hover": { opacity: 0.7 },
    "&.active": {
      left: 34,
    },
  },
}));

interface IProps {
  className?: string;
  checked: boolean;
  onToggle: () => void;
}

export const YesNoSwitch = (props: IProps) => {
  const classes = useStyles();
  const { checked, onToggle } = props;
  return (
    <div
      className={clsx(classes.root, props.className, checked ? "active" : "")}
    >
      <div
        className={clsx(classes.button, checked ? "active" : "")}
        onClick={onToggle}
      >
        {checked ? "Yes" : "No"}
      </div>
    </div>
  );
};
