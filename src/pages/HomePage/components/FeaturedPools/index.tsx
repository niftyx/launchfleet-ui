import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolItem, SimpleLoader } from "components";
import { useFeaturedPools } from "hooks";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {},
  pools: {
    fontSize: 14,
    margin: "24px 0 12px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    borderRadius: 12,
    textDecoration: "none",
    backgroundColor: theme.colors.sixth,
    color: theme.colors.secondary,
  },
}));

interface IProps {
  className?: string;
}

export const FeaturedPools = (props: IProps) => {
  const classes = useStyles();
  const { loading, pools } = useFeaturedPools();

  const renderPools = () => {
    return pools.map((pool) => <PoolItem key={pool.id} pool={pool} />);
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      {loading ? <SimpleLoader /> : renderPools()}
      <NavLink className={classes.pools} to="/pools">
        View all pools
      </NavLink>
    </div>
  );
};
