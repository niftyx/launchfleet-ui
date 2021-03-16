import { Grid, Hidden, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { UpcomingPoolItem } from "components";
import { MockUpcomingPools } from "config/constants";
import React from "react";

import { SubscribeWrapper } from "../SubscribeWrapper";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

interface IProps {
  className?: string;
}

export const UpcomingPools = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <Grid container spacing={3}>
        {MockUpcomingPools.map((pool) => (
          <Grid
            item
            key={`${pool.token}-${pool.startTime.toHexString()}`}
            md={4}
            sm={6}
            xs={12}
          >
            <UpcomingPoolItem onClick={() => {}} pool={pool} />
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
