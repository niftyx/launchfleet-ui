import { Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as DiscordIcon } from "assets/svgs/discord.svg";
import { ReactComponent as MediumIcon } from "assets/svgs/medium.svg";
import { ReactComponent as TelegramIcon } from "assets/svgs/telegram.svg";
import { ReactComponent as TwitterIcon } from "assets/svgs/twitter.svg";
import clsx from "clsx";
import { Logo } from "components";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: { padding: "16px 24px" },
  content: { maxWidth: theme.custom.appContentMaxWidth, margin: "auto" },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& + &": { marginTop: 16 },
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      flexDirection: "column",
      "&:last-child": {
        flexDirection: "column-reverse",
      },
      "& + &": { marginTop: 0 },
      marginTop: 24,
      "& > *": {
        marginTop: 24,
      },
    },
  },
  logo: {
    height: 26,
  },
  subRow: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 40,
    },
  },
  item: {
    textDecoration: "none",
    fontSize: 13,
    color: theme.colors.third,
    userSelect: "none",
  },
  copyRight: {
    fontSize: 11,
    color: theme.colors.third,
  },
  iconA: {
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
}

export const Footer = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <div className={classes.row}>
          <Logo className={classes.logo} />
          <div className={classes.subRow}>
            {[
              { label: "Support", href: "/support" },
              { label: "Docs", href: "/docs" },
              { label: "Terms & Privacy", href: "/terms-privacy" },
            ].map((item) => (
              <NavLink className={classes.item} key={item.label} to={item.href}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className={classes.row}>
          <Typography className={classes.copyRight}>
            © Avalaunch 2021. Join the auction at your own risk.
          </Typography>
          <div className={classes.subRow}>
            {[
              { href: "/discord", icon: DiscordIcon },
              { href: "/medium", icon: MediumIcon },
              { href: "/telegram", icon: TelegramIcon },
              { href: "/twitter", icon: TwitterIcon },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  className={classes.iconA}
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
      </div>
    </div>
  );
};
