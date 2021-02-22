import { Button, ButtonProps, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 24,
    color: theme.colors.primary,
    borderColor: theme.colors.primary,
    textTransform: "none",
    paddingTop: 0,
    paddingBottom: 0,
    height: "100%",
  },
}));

interface IProps {
  className?: string;
  onClick: () => void;
}

export const ConnectWalletButton = (props: IProps & ButtonProps) => {
  const classes = useStyles();
  const { className, onClick, ...restProps } = props;
  return (
    <Button
      className={clsx(classes.root, props.className)}
      color="secondary"
      onClick={props.onClick}
      variant="contained"
      {...restProps}
    >
      Connect Wallet
    </Button>
  );
};
