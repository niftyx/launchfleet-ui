import { makeStyles } from "@material-ui/core";
import { ReactComponent as CloseIcon } from "assets/svgs/close-in-square.svg";
import clsx from "clsx";
import { Logo } from "components";
import { GUIDE_LINKS, SOCIAL_LINKS } from "config/constants";
import { transparentize } from "polished";
import React, { useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 99,
    position: "fixed",
    left: "-100%",
    right: "100%",
    top: 0,
    bottom: 0,
    transition: "all 0.5s",
    paddingRight: 65,
    opacity: 0,
    "&.visible": {
      left: 0,
      right: 0,
      opacity: 1,
    },
  },
  content: {
    height: "100%",
    backgroundColor: theme.colors.default,
    boxShadow: theme.colors.boxShadow1,
    position: "relative",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
  },
  menuContent: {
    flex: 1,
    padding: "16px 4px",
  },
  menuItem: {
    display: "block",
    textDecoration: "none",
    fontWeight: 500,
    padding: "16px 0",
    color: theme.colors.fifteen,
    userSelect: "none",
  },
  others: {},
  close: {
    position: "absolute",
    right: 16,
    top: 16,
    cursor: "pointer",
  },
  guideNavItem: {
    display: "block",
    textDecoration: "none",
    fontWeight: 300,
    padding: "16px 0",
    color: theme.colors.third,
    userSelect: "none",
  },
  socialWrapper: {
    display: "flex",
    alignItems: "center",
  },
  socialButton: {
    userSelect: "none",
    marginTop: 16,
    "& + &": {
      marginLeft: 24,
    },
    "& svg": {
      width: 24,
      height: 24,
    },
  },
}));

interface IProps {
  className?: string;
  visible: boolean;
  setMenuVisible: (visible: boolean) => void;
}

export const Navbar = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();

  useEffect(() => {
    props.setMenuVisible(false);
  }, [history.location.pathname]);

  return (
    <div
      className={clsx(
        classes.root,
        props.className,
        props.visible ? "visible" : ""
      )}
      onClick={() => props.setMenuVisible(false)}
    >
      <div
        className={clsx(classes.content)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Logo />
        <div className={classes.menuContent}>
          {[
            {
              label: "Create pool",
              href: "/new-pool",
            },
            {
              label: "View pools",
              href: "/pools",
            },
            {
              label: "Settings",
              href: "/settings",
            },
          ].map((item) => (
            <NavLink
              className={classes.menuItem}
              key={item.href}
              to={item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className={classes.others}>
          {GUIDE_LINKS.map((item) => (
            <NavLink
              className={classes.guideNavItem}
              key={item.href}
              to={item.href}
            >
              {item.label}
            </NavLink>
          ))}
          <div className={classes.socialWrapper}>
            {SOCIAL_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  className={classes.socialButton}
                  href={item.href}
                  key={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
        <span
          className={classes.close}
          onClick={() => props.setMenuVisible(false)}
        >
          <CloseIcon />
        </span>
      </div>
    </div>
  );
};
