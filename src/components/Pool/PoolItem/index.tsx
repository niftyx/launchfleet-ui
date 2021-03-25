import { BigNumber } from "@ethersproject/bignumber";
import {
  Avatar,
  Button,
  CircularProgress,
  Hidden,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { SimpleLoader } from "components/Loader";
import {
  PoolLiveFilledTag,
  PoolPriceTag,
  PoolRaisedTag,
  PrivateTag,
} from "components/Tag";
import { PoolJoinedStatusTag } from "components/Tag/PoolJoinedStatusTag";
import { PublicTag } from "components/Tag/PublicTag";
import { useConnectedWeb3Context } from "contexts";
import { usePoolDetails } from "hooks";
import React from "react";
import { NavLink } from "react-router-dom";
import { IPool } from "types";
import { ZERO_NUMBER } from "utils/number";

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
  poolId: BigNumber;
}

export const PoolItem = (props: IProps) => {
  const classes = useStyles();
  const { library: provider, networkId } = useConnectedWeb3Context();
  const { poolId } = props;
  const { loading: poolLoading, pool } = usePoolDetails(
    poolId,
    networkId,
    provider
  );

  const finishTime = pool ? pool.finishTime.toNumber() : 0;
  const startTime = pool ? pool.startTime.toNumber() : 0;
  const nowTime = Math.floor(Date.now() / 1000);
  const isClosed = nowTime - finishTime > 0;
  const isLive = startTime <= nowTime && nowTime < finishTime;

  const isPrivate = pool ? pool.openForAll.eq(ZERO_NUMBER) : false;

  const renderContent = () => {
    if (!pool) return null;

    return (
      <>
        <Hidden mdUp>
          <div className={classes.row}>
            <Avatar className={classes.avatar} src={pool.img} />
            <Typography className={classes.title}>{pool.tokenName}</Typography>
            <PoolRaisedTag pool={pool} />
          </div>
          <div className={classes.row}>
            {isPrivate ? <PrivateTag /> : <PublicTag />}
            <PoolLiveFilledTag isLive={isLive} />
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
            <PoolLiveFilledTag isLive={isLive} />
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
            <PoolRaisedTag pool={pool} />
          </div>
          <div className={clsx(classes.itemWrapper, "buttons")}>
            {isLive && (
              <Button
                className={classes.joinButton}
                color="primary"
                variant="contained"
              >
                Join
              </Button>
            )}
            {isClosed && (
              <Button
                className={classes.filledButton}
                color="primary"
                variant="contained"
              >
                Filled
              </Button>
            )}
          </div>
        </Hidden>
      </>
    );
  };

  return (
    <NavLink
      className={clsx(classes.root, props.className, isClosed ? "" : "active")}
      to={`/pool/${poolId.toHexString()}`}
    >
      {poolLoading ? (
        <SimpleLoader className={classes.spinner} />
      ) : (
        renderContent()
      )}
    </NavLink>
  );
};
