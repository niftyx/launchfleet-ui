import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import useCommonStyles from "styles/common";

import { FeaturedPools, HeroSection, UpcomingPools } from "./components";

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
}));

const HomePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <div className={classes.root}>
      <HeroSection />
      <div className={commonClasses.wrapper}>
        <div className={clsx(commonClasses.pageContent, classes.content)}>
          <UpcomingPools />
          <FeaturedPools />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
