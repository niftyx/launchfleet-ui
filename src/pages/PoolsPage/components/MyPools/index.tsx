import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolItem, SearchBar, SimpleLoader } from "components";
import { useConnectedWeb3Context } from "contexts";
import { useMyPools } from "hooks";
import React, { useState } from "react";

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

const MyPools = () => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ keyword: "" });
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const { loading: myPoolsLoading, myPoolIds } = useMyPools(
    provider,
    account || "",
    networkId
  );

  const setKeyword = (keyword: string) =>
    setState((prev) => ({ ...prev, keyword }));

  return (
    <div className={clsx(classes.root)}>
      <SearchBar
        onChange={(e) => setKeyword(e.target.value)}
        value={state.keyword}
      />
      <div className={classes.content}>
        {myPoolsLoading && myPoolIds.length === 0 ? (
          <SimpleLoader />
        ) : (
          myPoolIds.map((poolId) => (
            <PoolItem key={poolId.toHexString()} poolId={poolId} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyPools;
