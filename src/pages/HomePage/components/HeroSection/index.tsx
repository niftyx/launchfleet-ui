import { Button, Typography, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import React from "react";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    background: theme.colors.gradient2,
    padding: 24,
    paddingTop: theme.custom.appHeaderDesktopHeight,
    marginTop: -Number(theme.custom.appHeaderDesktopHeight),
    paddingBottom: 85,
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      paddingTop: theme.custom.appHeaderMobileHeight,
      marginTop: -Number(theme.custom.appHeaderMobileHeight),
      paddingBottom: 24,
    },
  },
  content: {
    maxWidth: theme.custom.appContentMaxWidth,
    margin: "auto",
    marginTop: 34,
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      marginTop: 24,
    },
  },
  textContent: {
    width: "50%",
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      width: "100%",
    },
  },
  title: {
    fontSize: 48,
    lineHeight: "60px",
    color: theme.colors.secondary,
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: "24px",
    color: theme.colors.fourteen,
    marginBottom: 27,
    fontWeight: 200,
  },
  buttons: {
    display: "flex",
    marginTop: 40,
    "& > * + *": {
      marginLeft: 24,
    },
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      flexDirection: "column",
      marginTop: 0,
      "& > * + *": {
        marginLeft: 0,
        marginTop: 24,
      },
    },
  },
  button: { minWidth: 180 },
  plus: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  imgContent: {
    position: "absolute",
    right: 0,
    bottom: 0,
    top: 0,
    left: "72%",
    backgroundSize: "contain",
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundImage: "url(/imgs/hero_banner.svg)",
  },
}));

interface IProps {
  className?: string;
}

export const HeroSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <div className={classes.textContent}>
          <Typography className={classes.title}>
            Decentralized Auction Protocol
          </Typography>
          <Typography className={classes.description}>
            Join Avalaunch, a Protocol built for cross-chain token pools and
            auctions, enabling projects to raise capital on a decentralized and
            interoperable environment.
          </Typography>
          <div className={classes.buttons}>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
            >
              View all pools
            </Button>
            <Button
              className={classes.button}
              color="secondary"
              variant="contained"
            >
              <AddIcon className={classes.plus} />
              <span>View all pools</span>
            </Button>
          </div>
        </div>
        <div
          className={clsx(classes.imgContent, commonClasses.hideOnPad)}
        ></div>
      </div>
    </div>
  );
};
