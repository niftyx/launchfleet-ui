import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 76,
    height: 28,
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.colors.sixth,
    display: "flex",
    alignItems: "center",
    boxShadow: `0 2px 4px ${transparentize(0.81, theme.colors.opposite)}`,
  },
  button: {
    flex: 1,
    height: "100%",
    backgroundColor: theme.colors.default,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.secondary,
    fontSize: 12,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    border: `2px solid ${theme.colors.transparent}`,
    "& + &": {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    cursor: "pointer",
    transition: "all 0.4s",
    userSelect: "none",
    "&:hover": { opacity: 0.7 },
    "&.active": {
      borderColor: theme.colors.primary,
    },
  },
}));

interface IProps {
  className?: string;
  isDsp: boolean;
  setDsp: (_: number) => void;
}

export const DspTlpSwitch = (props: IProps) => {
  const classes = useStyles();
  const { isDsp, setDsp } = props;
  return (
    <div className={clsx(classes.root, props.className)}>
      <div
        className={clsx(classes.button, isDsp ? "active" : "")}
        onClick={() => setDsp(0)}
      >
        DSP
      </div>
      <div
        className={clsx(classes.button, !isDsp ? "active" : "")}
        onClick={() => setDsp(1)}
      >
        TLP
      </div>
    </div>
  );
};
