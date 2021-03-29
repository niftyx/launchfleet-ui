import { BigNumber } from "@ethersproject/bignumber";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { NotFoundPanel, SimpleLoader } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { usePoolDetails } from "hooks";
import React, { useState } from "react";
import { useParams } from "react-router";
import useCommonStyles from "styles/common";
import { EPoolDetailsTab } from "utils/enums";
import { MAX_NUMBER, isValidHexString } from "utils/number";

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
  const { library: provider, networkId } = useConnectedWeb3Context();
  const params = useParams();
  const [state, setState] = useState<IState>({
    tab: EPoolDetailsTab.PoolDetails,
  });

  const poolId: string = ((params as any) || { id: "" }).id;
  const {
    load: reloadPoolInfo,
    loading: poolLoading,
    pool: poolData,
  } = usePoolDetails(
    isValidHexString(poolId) ? BigNumber.from(poolId) : MAX_NUMBER,
    networkId || DEFAULT_NETWORK_ID,
    provider
  );

  const setTab = (tab: EPoolDetailsTab) =>
    setState((prev) => ({ ...prev, tab }));

  const isPoolValid = isValidHexString(poolId);

  const renderContent = () => {
    if (!poolId) return null;
    if (poolLoading && !poolData) {
      return <SimpleLoader />;
    }
    if (!poolData) {
      return <NotFoundPanel />;
    }
    return (
      <>
        <HeroSection
          pool={poolData}
          poolId={BigNumber.from(poolId)}
          reloadPoolInfo={reloadPoolInfo}
        />
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
          {isPoolValid ? renderContent() : <NotFoundPanel />}
        </div>
      </div>
    </div>
  );
};

export default PoolDetailsPage;
