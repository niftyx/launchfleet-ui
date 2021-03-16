import { Button, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as IdoSvg } from "assets/svgs/ido.svg";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  alertWrapper: {
    marginTop: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.primary,
    padding: "37px 32px",
    borderRadius: 24,
    [theme.breakpoints.down("sm")]: {
      display: "block",
      textAlign: "center",
      "& > * + *": {
        marginTop: 40,
      },
    },
  },
  comments: {
    "& > * + *": {
      marginTop: 17,
    },
    [theme.breakpoints.down("sm")]: {
      "& > * + *": {
        marginTop: 29,
      },
    },
  },
  title: {
    color: theme.colors.default,
    fontSize: 18,
    fontWeight: 500,
  },
  comment: {
    color: theme.colors.default,
    fontSize: 14,
  },
  button: {
    backgroundColor: theme.colors.default,
    color: theme.colors.primary,
    height: 58,
    paddingLeft: 46,
    paddingRight: 46,
  },
  idoWrapper: {
    marginTop: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.secondary,
    padding: "16px 32px",
    borderRadius: 24,
    [theme.breakpoints.down("sm")]: {
      display: "block",
      textAlign: "center",
      "& > * + *": {
        marginTop: 32,
      },
    },
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > * + *": {
      marginLeft: 20,
    },
  },
}));

interface IProps {
  className?: string;
}

export const AlertSection = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.alertWrapper}>
        <div className={classes.comments}>
          <Typography className={classes.title}>
            Get Alerts For New Pools
          </Typography>
          <Typography className={classes.comment}>
            Subscribe to get notified about new pools and other relevant events.
          </Typography>
        </div>
        <Button className={classes.button} variant="contained">
          Subscribe
        </Button>
      </div>
      <div className={classes.idoWrapper}>
        <div className={classes.row}>
          <IdoSvg />
          <Typography className={classes.title}>
            Apply for Certified IDO?
          </Typography>
        </div>
        <Button className={classes.button} variant="contained">
          Apply
        </Button>
      </div>
    </div>
  );
};
