import { Button, ButtonProps, makeStyles } from "@material-ui/core";
import { ReactComponent as WalletIcon } from "assets/svgs/wallet.svg";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 16,
    color: theme.colors.twelfth,
    backgroundColor: theme.colors.default,
    textTransform: "none",
    height: 65,
    width: 210,
    "& svg": {
      marginRight: 16,
    },
    "&:hover": {
      color: theme.colors.primary,
      backgroundColor: theme.colors.default,
    },
  },
}));

interface IProps {
  className?: string;
  onClick: () => void;
}

export const ConnectWalletButton = (props: IProps & ButtonProps) => {
  const classes = useStyles();
  const { onClick, ...restProps } = props;
  return (
    <Button
      {...restProps}
      className={clsx(classes.root, props.className)}
      color="primary"
      onClick={onClick}
      variant="contained"
    >
      <WalletIcon />
      <span>Connect Wallet</span>
    </Button>
  );
};
