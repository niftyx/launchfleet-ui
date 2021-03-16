import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useConnectedWeb3Context } from "contexts";
import { transparentize } from "polished";
import React from "react";
import { matchPath, useHistory } from "react-router";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 32,
    },
  },
  item: {
    textDecoration: "none",
    color: theme.colors.third,
    fontSize: 14,
    paddingBottom: 4,
    borderBottom: `4px solid ${theme.colors.transparent}`,
    transition: "all 0.3s",
    "&:hover": {
      color: transparentize(0.3, theme.colors.primary),
    },
    "&.active": {
      color: theme.colors.primary,
      borderBottomColor: theme.colors.primary,
    },
  },
}));

interface IProps {
  className?: string;
}

export const TabBar = (props: IProps) => {
  const classes = useStyles();
  const { account } = useConnectedWeb3Context();
  const isWalletConnected = !!account;
  const history = useHistory();

  const TABS = isWalletConnected
    ? [
        { label: "All pools", href: "/pools/all" },
        { label: "Featured pools", href: "/pools/featured" },
        { label: "My pools", href: "/pools/mine" },
      ]
    : [
        { label: "All pools", href: "/pools/all" },
        { label: "Featured pools", href: "/pools/featured" },
      ];

  return (
    <div className={clsx(classes.root, props.className)}>
      {TABS.map((tab) => (
        <NavLink
          className={classes.item}
          isActive={() =>
            !!matchPath(history.location.pathname, {
              path: tab.href,
              exact: true,
            })
          }
          key={tab.href}
          to={tab.href}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};
