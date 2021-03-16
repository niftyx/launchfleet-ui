import {
  Avatar,
  Button,
  Hidden,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import {
  PoolLiveFilledTag,
  PoolPriceTag,
  PoolRaisedTag,
  PrivateTag,
} from "components/Tag";
import { PoolJoinedStatusTag } from "components/Tag/PoolJoinedStatusTag";
import { PublicTag } from "components/Tag/PublicTag";
import React from "react";
import { IPool } from "types";
import { ZERO_NUMBER } from "utils/number";

const useStyles = makeStyles((theme) => ({
  root: {
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
    "&.buttons": {
      minWidth: 80,
      textAlign: "right",
    },
    "&.raised": {
      minWidth: 80,
      textAlign: "right",
    },
    "&.status": {
      minWidth: 170,
    },
    "&.price": {
      minWidth: 120,
    },
    "&.tag": {
      minWidth: 80,
    },
    "&.live": {
      flex: 1,
    },
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

export const PoolItem = (props: IProps) => {
  const classes = useStyles();
  const { pool } = props;
  const finishTime = pool.finishTime.toNumber();
  const diff = finishTime - Math.floor(Date.now() / 1000);
  const isClosed = diff < 0;
  const isPrivate = pool.openForAll.eq(ZERO_NUMBER);

  return (
    <div
      className={clsx(classes.root, props.className, isClosed ? "" : "active")}
    >
      <Hidden mdUp>
        <div className={classes.row}>
          <Avatar className={classes.avatar} src={pool.img} />
          <Typography className={classes.title}>{pool.tokenName}</Typography>
          <PoolRaisedTag />
        </div>
        <div className={classes.row}>
          {isPrivate ? <PrivateTag /> : <PublicTag />}
          <PoolLiveFilledTag isLive />
        </div>
        <div className={classes.row}>
          <PoolPriceTag pool={pool} />
          <PoolJoinedStatusTag pool={pool} />
        </div>
      </Hidden>
      <Hidden smDown>
        <Avatar className={classes.avatar} src={pool.img} />
        <Typography className={classes.title}>{pool.tokenName}</Typography>
        <div className={clsx(classes.itemWrapper, "live")}>
          <PoolLiveFilledTag isLive />
        </div>
        <div className={clsx(classes.itemWrapper, "tag")}>
          {isPrivate ? <PrivateTag /> : <PublicTag />}
        </div>
        <div className={clsx(classes.itemWrapper, "price")}>
          <PoolPriceTag pool={pool} />
        </div>
        <div className={clsx(classes.itemWrapper, "status")}>
          <PoolJoinedStatusTag pool={pool} />
        </div>

        <div className={clsx(classes.itemWrapper, "raised")}>
          <PoolRaisedTag />
        </div>
        <div className={clsx(classes.itemWrapper, "buttons")}>
          {/* <Button
            className={classes.joinButton}
            color="primary"
            variant="contained"
          >
            Join
          </Button> */}
          <Button
            className={classes.filledButton}
            color="primary"
            variant="contained"
          >
            Filled
          </Button>
        </div>
      </Hidden>
    </div>
  );
};
