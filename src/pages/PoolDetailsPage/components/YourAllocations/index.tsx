import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SimpleLoader } from "components";
import { useConnectedWeb3Context } from "contexts";
import React, { useEffect, useState } from "react";
import { IInvestHistory, IPool } from "types";
import { waitSeconds } from "utils";

const useStyles = makeStyles((theme) => ({
  root: { marginTop: 24 },
  section: {
    backgroundColor: theme.colors.default,
    borderRadius: 24,
    padding: "24px 32px",
  },
  row: {},
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

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!account) return;
      setState((prev) => ({ ...prev, loading: true }));
      try {
        await waitSeconds(3);
        if (isMounted)
          setState((prev) => ({ ...prev, loading: false, history: [] }));
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
    return <div className={classes.section}>History</div>;
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      {state.loading ? <SimpleLoader /> : renderHistory()}
    </div>
  );
};
