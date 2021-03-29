import { BigNumber } from "@ethersproject/bignumber";
import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolItem, SearchBar, SimpleLoader } from "components";
import { PAGE_ITEMS } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { usePoolsCount } from "hooks";
import React, { useState } from "react";
import { ONE_NUMBER, ZERO_NUMBER } from "utils/number";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    marginTop: 24,
    marginBottom: 16,
  },
  loadMore: {
    height: 36,
    borderRadius: 12,
    backgroundColor: theme.colors.sixth,
    color: theme.colors.secondary,
    fontSize: 14,
  },
}));

interface IState {
  keyword: string;
  maxDisplayCount: BigNumber;
}

const AllPools = () => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    keyword: "",
    maxDisplayCount: PAGE_ITEMS,
  });
  const { library: provider, networkId } = useConnectedWeb3Context();
  const { loading: poolsCountLoading, poolsCount } = usePoolsCount(
    provider,
    networkId
  );

  const setKeyword = (keyword: string) =>
    setState((prev) => ({ ...prev, keyword }));

  const onLoadMore = () => {
    const maxDisplayCount = state.maxDisplayCount.add(PAGE_ITEMS);
    if (maxDisplayCount.lt(poolsCount)) {
      setState((prev) => ({ ...prev, maxDisplayCount }));
    } else {
      setState((prev) => ({ ...prev, maxDisplayCount: poolsCount }));
    }
  };

  const showMore =
    poolsCount.eq(ZERO_NUMBER) || state.maxDisplayCount.lt(poolsCount);
  const showLoading = poolsCountLoading && poolsCount.eq(ZERO_NUMBER);

  const renderPools = () => {
    const { maxDisplayCount } = state;
    const poolIds: BigNumber[] = [];
    for (
      let index = ZERO_NUMBER;
      index.lt(maxDisplayCount) && index.lt(poolsCount);
      index = index.add(ONE_NUMBER)
    ) {
      poolIds.push(index);
    }
    return poolIds.map((id) => <PoolItem key={id.toHexString()} poolId={id} />);
  };

  return (
    <div className={clsx(classes.root)}>
      <SearchBar
        onChange={(e) => setKeyword(e.target.value)}
        value={state.keyword}
      />
      <div className={classes.content}>
        {showLoading ? <SimpleLoader /> : renderPools()}
      </div>
      {showMore && (
        <Button
          className={classes.loadMore}
          fullWidth
          onClick={onLoadMore}
          variant="contained"
        >
          Load more pools
        </Button>
      )}
    </div>
  );
};

export default AllPools;
