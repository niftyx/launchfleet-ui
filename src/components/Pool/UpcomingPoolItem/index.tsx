import { Avatar, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolCloseTimeTag, PoolRaisedTag, PrivateTag } from "components/Tag";
import { PublicTag } from "components/Tag/PublicTag";
import { transparentize } from "polished";
import React from "react";
import { IPool } from "types";
import { ZERO_NUMBER } from "utils/number";

const useStyles = makeStyles((theme) => ({
  root: {
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
}));

interface IProps {
  className?: string;
  onClick: () => void;
  pool: IPool;
}

export const UpcomingPoolItem = (props: IProps) => {
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
      <div className={classes.content}>
        <div className={clsx(classes.section, classes.topWrapper)}>
          <Avatar className={classes.avatar} src={pool.img} />
          <Typography className={classes.title}>{pool.tokenName}</Typography>
          <PoolRaisedTag isUpcoming />
        </div>
        <div className={classes.section}>
          <div className={classes.row}>
            {isPrivate ? <PrivateTag /> : <PublicTag />}
            {!isClosed && (
              <PoolCloseTimeTag diff={diff} timestamp={finishTime} />
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
      </div>
    </div>
  );
};
