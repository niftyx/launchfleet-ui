import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";
import useCommonStyles from "styles/common";

import {
  AlertSection,
  FeaturedPools,
  HeroSection,
  UpcomingPools,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    paddingTop: 36,
    paddingBottom: 40,
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      paddingTop: 30,
      paddingBottom: 24,
    },
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: theme.colors.secondary,
    fontSize: 18,
  },
  sectionContent: {
    marginTop: 24,
    marginBottom: 40,
  },
  viewPools: {
    color: theme.colors.primary,
    fontSize: 13,
    textDecoration: "none",
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <div className={classes.root}>
      <HeroSection />
      <div className={commonClasses.wrapper}>
        <div className={clsx(commonClasses.pageContent, classes.content)}>
          <Typography className={classes.sectionTitle}>
            Upcoming pools
          </Typography>
          <UpcomingPools className={classes.sectionContent} />
          <div className={classes.sectionHeader}>
            <Typography className={classes.sectionTitle}>
              Featured pools
            </Typography>
            <NavLink className={classes.viewPools} to="/pools">
              View all pools
            </NavLink>
          </div>
          <FeaturedPools className={classes.sectionContent} />
          <AlertSection />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
