import { BigNumber } from "@ethersproject/bignumber";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolItem, SimpleLoader } from "components";
import { PAGE_ITEMS } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { usePoolsCount } from "hooks";
import React from "react";
import { NavLink } from "react-router-dom";
import { ONE_NUMBER, ZERO_NUMBER } from "utils/number";

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
  const { library: provider, networkId } = useConnectedWeb3Context();
  const { loading: poolsCountLoading, poolsCount } = usePoolsCount(
    provider,
    networkId
  );

  const renderPools = () => {
    const maxDisplayCount = poolsCount.gt(PAGE_ITEMS) ? PAGE_ITEMS : poolsCount;
    const poolIds: BigNumber[] = [];
    for (
      let index = ZERO_NUMBER;
      index.lt(maxDisplayCount);
      index = index.add(ONE_NUMBER)
    ) {
      poolIds.push(index);
    }
    return poolIds.map((id) => <PoolItem key={id.toHexString()} poolId={id} />);
  };
  const showLoading = poolsCountLoading && poolsCount.eq(ZERO_NUMBER);

  return (
    <div className={clsx(classes.root, props.className)}>
      {showLoading ? <SimpleLoader /> : renderPools()}
      <NavLink className={classes.pools} to="/pools">
        View all pools
      </NavLink>
    </div>
  );
};
