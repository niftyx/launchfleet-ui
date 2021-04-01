import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SimpleLoader } from "components";
import { useConnectedWeb3Context } from "contexts";
import React, { useEffect, useState } from "react";
import { getApiService } from "services/api";
import { IInvestHistory, IPool } from "types";

const useStyles = makeStyles((theme) => ({
  root: { marginTop: 24 },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

interface IState {
  loading: boolean;
  history: IInvestHistory[];
}

export const YourAllocations = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, history: [] });
  const {
    pool: { poolId },
  } = props;
  const { account } = useConnectedWeb3Context();
  const apiService = getApiService();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!account) return;
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const res = await apiService.getPoolInvestorHistory(poolId, account);
        if (isMounted)
          setState((prev) => ({ ...prev, loading: false, history: res }));
      } catch (error) {
        if (isMounted)
          setState((prev) => ({ ...prev, loading: false, history: [] }));
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolId]);

  const renderHistory = () => {
    return <div>History</div>;
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      {state.loading ? <SimpleLoader /> : renderHistory()}
    </div>
  );
};
