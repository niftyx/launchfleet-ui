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
  const { loading: upcomingPoolIdsLoading, pools } = useUpcomingPools();
  return (
    <div className={clsx(classes.root, props.className)}>
      <Grid container spacing={3}>
        {upcomingPoolIdsLoading && pools.length === 0 && (
          <Grid item md={4} sm={6} xs={12}>
            <SimpleLoader />
          </Grid>
        )}
        {pools.map((pool) => (
          <Grid item key={pool.id} md={4} sm={6} xs={12}>
            <UpcomingPoolItem pool={pool} />
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
