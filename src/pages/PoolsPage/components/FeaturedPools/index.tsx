import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolItem, SearchBar, SimpleLoader } from "components";
import { useFeaturedPools } from "hooks";
import React, { useState } from "react";
import { isPoolFiltered } from "utils/pool";

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
}

const FeaturedPools = () => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ keyword: "" });

  const { hasMore, loadMorePools, loading, pools } = useFeaturedPools();

  const setKeyword = (keyword: string) =>
    setState((prev) => ({ ...prev, keyword }));

  const filteredPools = pools.filter((pool) =>
    isPoolFiltered(pool, state.keyword)
  );

  return (
    <div className={clsx(classes.root)}>
      <SearchBar
        onChange={(e) => setKeyword(e.target.value)}
        value={state.keyword}
      />
      <div className={classes.content}>
        {filteredPools.map((pool) => (
          <PoolItem key={pool.id} pool={pool} />
        ))}
        {loading && <SimpleLoader />}
      </div>
      {hasMore && (
        <Button
          className={classes.loadMore}
          fullWidth
          onClick={loadMorePools}
          variant="contained"
        >
          Load more pools
        </Button>
      )}
    </div>
  );
};

export default FeaturedPools;
