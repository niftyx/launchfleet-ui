import { Hidden, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  AccountInfoBar,
  ConnectWalletButton,
  Logo,
  MenuButton,
  NewPoolButton,
  PoolsButton,
  SettingsButton,
} from "components";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";

import { Navbar } from "../Navbar";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 2,
    overflowY: "visible",
    height: theme.custom.appHeaderDesktopHeight,
    backgroundColor: theme.colors.transparent,
    position: "relative",
    padding: "16px 24px",
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      height: theme.custom.appHeaderMobileHeight,
    },
  },
  content: {
    margin: "auto",
    height: "100%",
    maxWidth: theme.custom.appContentMaxWidth,
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 24,
    },
  },
  section: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsWalletWrapper: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 32,
    },
  },
  pools: {
    marginRight: 32,
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
  const commonClasses = useCommonStyles();
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

  const setMenuVisible = (navbarOpened: boolean) => {
    setState((prev) => ({ ...prev, navbarOpened }));
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <div className={classes.section}>
          <MenuButton
            className={commonClasses.hideUpPad}
            onClick={() => setMenuVisible(true)}
          />
          <Logo className={commonClasses.hideOnPad} />
          <NewPoolButton className={commonClasses.hideOnMobile} />
        </div>
        <div className={classes.section}>
          <PoolsButton
            className={clsx(classes.pools, commonClasses.hideOnPad)}
          />

          <div className={classes.settingsWalletWrapper}>
            <SettingsButton className={commonClasses.hideOnMobile} />
            {isConnected ? (
              <AccountInfoBar
                account={account || ""}
                ethBalance={ethBalance}
                onDisconnect={onDisconnect}
              />
            ) : (
              <ConnectWalletButton onClick={onConnectWallet} />
            )}
          </div>
        </div>
      </div>
      <Hidden mdUp>
        <Navbar setMenuVisible={setMenuVisible} visible={state.navbarOpened} />
      </Hidden>
    </div>
  );
};
