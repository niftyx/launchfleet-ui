import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SimpleLoader } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { usePoolDetails } from "hooks";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import useCommonStyles from "styles/common";
import { EPoolDetailsTab } from "utils/enums";

import { HeroSection, PoolDetails, TabBar } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {},
  tabs: {
    marginTop: 32,
  },
}));

interface IState {
  tab: EPoolDetailsTab;
}

const PoolDetailsPage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const isConnected = !!account;
  const params = useParams();
  const history = useHistory();
  const [state, setState] = useState<IState>({
    tab: EPoolDetailsTab.PoolDetails,
  });

  const poolId = ((params as any) || { id: "" }).id;
  const { loading: poolLoading, pool: poolData } = usePoolDetails(
    poolId,
    networkId || DEFAULT_NETWORK_ID,
    provider
  );

  const setTab = (tab: EPoolDetailsTab) =>
    setState((prev) => ({ ...prev, tab }));

  useEffect(() => {
    if (!poolId) {
      history.push("/pools");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolId]);

  const renderContent = () => {
    if (!poolId) return null;
    if (!poolData || poolLoading) {
      return <SimpleLoader />;
    }
    return (
      <>
        <HeroSection pool={poolData} />
        <TabBar className={classes.tabs} onChangeTab={setTab} tab={state.tab} />
        {state.tab === EPoolDetailsTab.PoolDetails && (
          <PoolDetails pool={poolData} />
        )}
      </>
    );
  };

  return (
    <div className={classes.root}>
      <div className={commonClasses.wrapper}>
        <div className={clsx(commonClasses.pageContent, classes.content)}>
          {poolId && renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PoolDetailsPage;
