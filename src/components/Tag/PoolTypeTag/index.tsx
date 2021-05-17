import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { EPoolType } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {},
  private: {
    backgroundColor: theme.colors.sixth,
    color: theme.colors.primary,
    borderRadius: 8,
    fontWeight: 500,
    padding: "6px 12px",
    display: "inline-block",
  },
  public: {
    backgroundColor: transparentize(0.85, theme.colors.fourth),
    color: theme.colors.fourth,
    borderRadius: 8,
    fontWeight: 500,
    padding: "6px 12px",
    display: "inline-block",
  },
  token: {
    backgroundColor: transparentize(0.85, theme.colors.fifth),
    color: theme.colors.fifth,
    borderRadius: 8,
    fontWeight: 500,
    padding: "6px 12px",
    display: "inline-block",
  },
}));

interface IProps {
  className?: string;
  poolType: EPoolType;
}

export const PoolTypeTag = (props: IProps) => {
  const classes = useStyles();
  const { poolType } = props;
  return (
    <div className={clsx(classes.root, props.className)}>
      {poolType === EPoolType.Private && (
        <div className={classes.private}>Private</div>
      )}
      {poolType === EPoolType.BaseHolder && (
        <div className={classes.token}>Token</div>
      )}
      {poolType === EPoolType.Public && (
        <div className={classes.public}>Public</div>
      )}
    </div>
  );
};
