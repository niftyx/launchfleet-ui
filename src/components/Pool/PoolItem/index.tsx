import { Avatar, Hidden, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  PoolPriceTag,
  PoolRaisedTag,
  PoolStatusTag,
  PoolTypeTag,
} from "components/Tag";
import { PoolJoinedStatusTag } from "components/Tag/PoolJoinedStatusTag";
import React from "react";
import { NavLink } from "react-router-dom";
import { IPool } from "types";

const useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: "none",
    borderRadius: 24,
    border: `1px solid ${theme.colors.transparent}`,
    padding: 24,
    backgroundColor: theme.colors.default,
    transition: "all 0.5s",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    [theme.breakpoints.up("md")]: {
      "&.active": {
        borderColor: theme.colors.primary,
      },
    },
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
    "& + &": {
      marginTop: 16,
    },
    "&:hover": {
      opacity: 0.7,
    },
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& + &": {
      marginTop: 12,
    },
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.primary,
    border: `1px solid ${theme.colors.sixth}`,
  },
  title: {
    margin: "0 24px",
    color: theme.colors.secondary,
    flex: 1,
  },
  joinButton: { height: 36, fontSize: 14 },
  filledButton: {
    height: 36,
    fontSize: 14,
    opacity: 0.7,
  },
  itemWrapper: {
    marginLeft: 24,
    "&.raised": {
      minWidth: 80,
      textAlign: "right",
    },
    "&.status": {
      minWidth: 170,
      textAlign: "right",
    },
    "&.price": {
      width: "17%",
      minWidth: 120,
      textAlign: "right",
    },
    "&.tag": {
      minWidth: 80,
      textAlign: "right",
    },
    "&.live": {
      flex: 1,
    },
  },
  spinner: {
    minHeight: "unset",
    width: "100%",
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

export const PoolItem = (props: IProps) => {
  const classes = useStyles();
  const { pool } = props;

  const finishTime = pool.endTime.toNumber();
  const startTime = pool.startTime.toNumber();
  const nowTime = Math.floor(Date.now() / 1000);
  const isActive = startTime <= nowTime && nowTime < finishTime;

  const renderContent = () => {
    return (
      <>
        <Hidden mdUp>
          <div className={classes.row}>
            <Avatar className={classes.avatar} src={pool.logo} />
            <Typography className={classes.title}>{pool.name}</Typography>
            <PoolRaisedTag pool={pool} />
          </div>
          <div className={classes.row}>
            <PoolTypeTag poolType={pool.poolType} />
            <PoolStatusTag pool={pool} />
          </div>
          <div className={classes.row}>
            <PoolPriceTag pool={pool} />
            <PoolJoinedStatusTag pool={pool} />
          </div>
        </Hidden>
        <Hidden smDown>
          <Avatar className={classes.avatar} src={pool.logo} />
          <Typography className={classes.title}>{pool.tokenName}</Typography>
          <div className={clsx(classes.itemWrapper, "live")}>
            <PoolStatusTag pool={pool} />
          </div>
          <div className={clsx(classes.itemWrapper, "tag")}>
            <PoolTypeTag poolType={pool.poolType} />
          </div>
          <div className={clsx(classes.itemWrapper, "price")}>
            <PoolPriceTag pool={pool} />
          </div>
          <div className={clsx(classes.itemWrapper, "status")}>
            <PoolJoinedStatusTag pool={pool} />
          </div>
          <div className={clsx(classes.itemWrapper, "raised")}>
            <PoolRaisedTag pool={pool} />
          </div>
        </Hidden>
      </>
    );
  };

  return (
    <NavLink
      className={clsx(classes.root, props.className, isActive ? "active" : "")}
      to={`/pool/${pool.id}`}
    >
      {renderContent()}
    </NavLink>
  );
};
