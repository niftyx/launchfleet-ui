import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SearchBar } from "components";
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

const AllPools = () => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ keyword: "" });

  const setKeyword = (keyword: string) =>
    setState((prev) => ({ ...prev, keyword }));

  const onLoadMore = () => {};

  return (
    <div className={clsx(classes.root)}>
      <SearchBar
        onChange={(e) => setKeyword(e.target.value)}
        value={state.keyword}
      />
      <div className={classes.content}></div>
      <Button
        className={classes.loadMore}
        fullWidth
        onClick={onLoadMore}
        variant="contained"
      >
        Load more pools
      </Button>
    </div>
  );
};

export default AllPools;
