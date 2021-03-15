import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { AccountInfoBar, ConnectWalletButton, PoolsButton } from "components";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { transparentize } from "polished";
import React from "react";
import { NavLink } from "react-router-dom";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
    boxShadow: `0 10px 20px ${transparentize(0.8, theme.colors.opposite)}`,
  },
  content: {
    zIndex: 1,
  },
  menuContent: {
    padding: "24px",
    backgroundColor: theme.colors.default,
    "& > * + *": {
      marginTop: 8,
    },
  },
  pools: {
    height: 50,
    display: "flex",
    width: "100%",
  },
  connectWallet: {
    height: 50,
    width: "100%",
  },
}));

interface IProps {
  className?: string;
  visible: boolean;
  onToggle: () => void;
}

export const Navbar = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account, onConnect, onDisconnect } = useConnectedWeb3Context();
  const {
    data: { ethBalance },
  } = useGlobal();
  const isConnected = !!account;

  const onConnectWallet = () => {
    props.onToggle();
    onConnect();
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div
        className={clsx(
          classes.content,
          commonClasses.maxHeightTransition,
          props.visible ? "visible" : ""
        )}
      >
        <div className={classes.menuContent}>
          <PoolsButton className={classes.pools} />

          {isConnected ? (
            <AccountInfoBar account={account || ""} ethBalance={ethBalance} />
          ) : (
            <ConnectWalletButton
              className={classes.connectWallet}
              onClick={onConnectWallet}
            />
          )}
          {/* <IconButton>
              <SettingsIcon />
            </IconButton> */}
        </div>
      </div>
    </div>
  );
};
