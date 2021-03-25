import { BigNumber } from "@ethersproject/bignumber";
import { Avatar, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SimpleLoader } from "components/Loader";
import { PoolCloseTimeTag, PoolRaisedTag, PrivateTag } from "components/Tag";
import { PublicTag } from "components/Tag/PublicTag";
import { useConnectedWeb3Context } from "contexts";
import { usePoolDetails } from "hooks";
import { transparentize } from "polished";
import React from "react";
import { NavLink } from "react-router-dom";
import { IPool } from "types";
import { ZERO_NUMBER } from "utils/number";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    textDecoration: "none",
    backgroundColor: theme.colors.default,
    padding: 24,
    border: `2px solid ${theme.colors.transparent}`,
    borderRadius: 24,
    transition: "all 0.5s",
    boxShadow: theme.colors.boxShadow1,
    cursor: "pointer",
    "&:hover": {
      opacity: 0.7,
    },
    "&.active": {
      borderColor: theme.colors.primary,
    },
  },
  content: {},
  section: {
    paddingBottom: 16,
    borderBottom: `1px solid ${transparentize(0.9, theme.colors.secondary)}`,
    "& + &": {
      paddingTop: 16,
      paddingBottom: 0,
      borderBottom: "none",
    },
  },
  topWrapper: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
  },
  title: {
    flex: 1,
    margin: "0 24px",
    color: theme.colors.secondary,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& + &": {
      marginTop: 16,
    },
  },
  allocationLabel: {
    fontSize: 12,
    color: theme.colors.third,
  },
  allocationAmount: {
    fontSize: 12,
    color: theme.colors.secondary,
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

export const UpcomingPoolItem = (props: IProps) => {
  const classes = useStyles();
  const { poolId } = props;
  const { library: provider, networkId } = useConnectedWeb3Context();

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
        <div className={clsx(classes.section, classes.topWrapper)}>
          <Avatar className={classes.avatar} src={pool.img} />
          <Typography className={classes.title}>{pool.tokenName}</Typography>
          <PoolRaisedTag pool={pool} />
        </div>
        <div className={classes.section}>
          <div className={classes.row}>
            {isPrivate ? <PrivateTag /> : <PublicTag />}
            {!isClosed && (
              <PoolCloseTimeTag
                diff={finishTime - nowTime}
                timestamp={finishTime}
              />
            )}
          </div>
          <div className={classes.row}>
            <Typography className={classes.allocationLabel}>
              Min. allocation
            </Typography>
            <Typography className={classes.allocationLabel}>
              Max. allocation
            </Typography>
          </div>
          <div className={classes.row}>
            <Typography className={classes.allocationAmount}>
              {pool.tokenSymbol}
            </Typography>
            <Typography className={classes.allocationAmount}>
              {pool.tokenSymbol}
            </Typography>
          </div>
        </div>
      </>
    );
  };

  return (
    <NavLink
      className={clsx(classes.root, props.className, isClosed ? "" : "active")}
      to={`/pool/${poolId.toHexString()}`}
    >
      <div className={classes.content}>
        {poolLoading ? (
          <SimpleLoader className={classes.spinner} />
        ) : (
          renderContent()
        )}
      </div>
    </NavLink>
  );
};
