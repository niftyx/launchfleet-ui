import { Grid, Hidden, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SimpleLoader, UpcomingPoolItem } from "components";
import { useConnectedWeb3Context } from "contexts";
import { useUpcomingPools } from "hooks";
import React from "react";
import { IPool } from "types";

import { SubscribeWrapper } from "../SubscribeWrapper";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

interface IProps {
  className?: string;
}

export const UpcomingPools = (props: IProps) => {
  const classes = useStyles();
  const { library: provider, networkId } = useConnectedWeb3Context();
  const { loading: upcomingPoolIdsLoading, upcomingPoolIds } = useUpcomingPools(
    provider,
    networkId
  );
  return (
    <div className={clsx(classes.root, props.className)}>
      <Grid container spacing={3}>
        {upcomingPoolIdsLoading && (
          <Grid item md={4} sm={6} xs={12}>
            <SimpleLoader />
          </Grid>
        )}
        {upcomingPoolIds.map((poolId) => (
          <Grid item key={`${poolId.toHexString()}`} md={4} sm={6} xs={12}>
            <UpcomingPoolItem poolId={poolId} />
          </Grid>
        ))}
        <Hidden xsDown>
          <Grid item md={4} sm={6} xs={12}>
            <SubscribeWrapper />
          </Grid>
        </Hidden>
      </Grid>
      <Hidden smUp>
        <SubscribeWrapper />
      </Hidden>
    </div>
  );
};
