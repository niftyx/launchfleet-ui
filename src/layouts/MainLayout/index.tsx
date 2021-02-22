import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import useCommonStyles from "styles/common";

import { Footer, Header } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: "auto",
    minHeight: "100vh",
  },
  content: {},
}));

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export const MainLayout = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <div className={clsx(classes.root, commonClasses.scroll)}>
      <Header />
      <main className={classes.content}>{props.children}</main>
      <Footer />
    </div>
  );
};
