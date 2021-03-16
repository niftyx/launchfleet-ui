import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { LoadingScreen } from "components";
import { useConnectedWeb3Context } from "contexts";
import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router";
import useCommonStyles from "styles/common";

import { TabBar } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {},
  tabBar: { marginBottom: 24 },
}));

const PoolsPage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account } = useConnectedWeb3Context();
  const isConnected = !!account;

  return (
    <div className={classes.root}>
      <div className={commonClasses.wrapper}>
        <div className={clsx(commonClasses.pageContent, classes.content)}>
          <TabBar className={classes.tabBar} />
          <Suspense fallback={<LoadingScreen />}>
            <Switch>
              <Route
                component={lazy(
                  () => import("pages/PoolsPage/components/AllPools")
                )}
                exact
                path="/pools/all"
              />
            </Switch>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PoolsPage;
