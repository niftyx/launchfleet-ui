import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { NotFoundPanel, SimpleLoader } from "components";
import { useConnectedWeb3Context } from "contexts";
import { usePoolDetails } from "hooks";
import React, { useState } from "react";
import { useParams } from "react-router";
import useCommonStyles from "styles/common";
import { EPoolDetailsTab } from "utils/enums";
import { isValidHexString } from "utils/number";

import {
  AboutPool,
  HeroSection,
  Manage,
  PoolDetails,
  TabBar,
  YourAllocations,
} from "./components";

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
  const params = useParams();
  const [state, setState] = useState<IState>({
    tab: EPoolDetailsTab.PoolDetails,
  });
  const { account } = useConnectedWeb3Context();

  const poolId: string = ((params as any) || { id: "" }).id;
  const { loading, pool, reload } = usePoolDetails(poolId);

  const setTab = (tab: EPoolDetailsTab) =>
    setState((prev) => ({ ...prev, tab }));

  const isPoolValid = isValidHexString(poolId);

  const renderContent = () => {
    if (!poolId) return null;
    if (loading && !pool) {
      return <SimpleLoader />;
    }
    if (!pool) {
      return <NotFoundPanel />;
    }
    return (
      <>
        <HeroSection pool={pool} reloadPoolInfo={reload} />
        <TabBar
          className={classes.tabs}
          onChangeTab={setTab}
          pool={pool}
          tab={state.tab}
        />
        {state.tab === EPoolDetailsTab.PoolDetails && (
          <PoolDetails pool={pool} />
        )}
        {state.tab === EPoolDetailsTab.AboutPool && <AboutPool pool={pool} />}
        {state.tab === EPoolDetailsTab.YourAllocations && (
          <YourAllocations pool={pool} />
        )}
        {state.tab === EPoolDetailsTab.Manage &&
          pool.creator === (account || "").toLowerCase() && (
            <Manage pool={pool} reloadPoolInfo={reload} />
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
