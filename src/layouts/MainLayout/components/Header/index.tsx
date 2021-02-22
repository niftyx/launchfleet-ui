import { Button, Hidden, IconButton, makeStyles } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import clsx from "clsx";
import {
  AccountInfoBar,
  ConnectWalletButton,
  Logo,
  PoolsButton,
} from "components";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Navbar } from "../Navbar";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: "visible",
    height: theme.custom.appHeaderDesktopHeight,
    padding: "12px 30px",
    backgroundColor: theme.colors.default,
    borderBottom: `1px solid ${theme.colors.secondary}`,
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      height: theme.custom.appHeaderMobileHeight,
    },
  },
  content: {
    margin: "auto",
    height: "100%",
    maxWidth: theme.custom.appContentMaxWidth,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentRight: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    "& > * + *": {
      marginLeft: 8,
    },
  },
  menuButton: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 32,
    cursor: "pointer",
    color: theme.colors.opposite,
  },
}));

interface IProps {
  className?: string;
}

interface IState {
  navbarOpened: boolean;
}

export const Header = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ navbarOpened: false });
  const history = useHistory();

  const setNavbarVisible = (navbarOpened: boolean) =>
    setState((prev) => ({ ...prev, navbarOpened }));

  useEffect(() => {
    setNavbarVisible(false);
  }, [history.location.pathname]);

  const { account, onConnect, onDisconnect } = useConnectedWeb3Context();
  const {
    data: { ethBalance },
  } = useGlobal();

  const isConnected = !!account;

  const onConnectWallet = () => {
    setNavbarVisible(false);
    onConnect();
  };

  const onMenu = () => {
    setState((prev) => ({ ...prev, navbarOpened: !prev.navbarOpened }));
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <Logo />
        <div className={classes.contentRight}>
          <Hidden smDown>
            <PoolsButton />

            {isConnected ? (
              <AccountInfoBar account={account || ""} ethBalance={ethBalance} />
            ) : (
              <ConnectWalletButton onClick={onConnectWallet} />
            )}
            {/* <IconButton>
              <SettingsIcon />
            </IconButton> */}
          </Hidden>
          <Hidden mdUp>
            <span className={classes.menuButton} onClick={onMenu}>
              <MenuIcon />
            </span>
          </Hidden>
        </div>
      </div>
      <Hidden mdUp>
        <Navbar onToggle={onMenu} visible={state.navbarOpened} />
      </Hidden>
    </div>
  );
};
