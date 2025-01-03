import { Avatar, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolRaisedTag, PoolTypeTag } from "components/Tag";
import { DEFAULT_DECIMALS, DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { transparentize } from "polished";
import React from "react";
import { NavLink } from "react-router-dom";
import { IPool } from "types";
import { formatBigNumber } from "utils";

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
  pool: IPool;
}

export const UpcomingPoolItem = (props: IProps) => {
  const classes = useStyles();
  const { pool } = props;
  const { networkId } = useConnectedWeb3Context();
  const weiInfo = getTokenFromAddress(
    networkId || DEFAULT_NETWORK_ID,
    pool.weiToken
  );

  const renderContent = () => {
    return (
      <>
        <div className={clsx(classes.section, classes.topWrapper)}>
          <Avatar className={classes.avatar} src={pool.logo} />
          <Typography className={classes.title}>{pool.name}</Typography>
          <PoolRaisedTag pool={pool} />
        </div>
        <div className={classes.section}>
          <div className={classes.row}>
            <PoolTypeTag poolType={pool.poolType} />
          </div>
          <div className={classes.row}>
            <Typography className={classes.allocationLabel}>
              Min. allocation: {formatBigNumber(pool.minWei, DEFAULT_DECIMALS)}
              &nbsp;
              {weiInfo.symbol}
            </Typography>
            <Typography className={classes.allocationLabel}>
              Max. allocation: {formatBigNumber(pool.maxWei, DEFAULT_DECIMALS)}
              &nbsp;{weiInfo.symbol}
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
      className={clsx(classes.root, props.className)}
      to={`/pool/${pool.id}`}
    >
      <div className={classes.content}>{renderContent()}</div>
    </NavLink>
  );
};
