import { Box, LinearProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    minHeight: "100%",
    padding: theme.spacing(3),
    "&.full-screen": {
      height: "100vh",
    },
  },
}));

interface IProps {
  fullScreen?: boolean;
  className?: string;
}

export const LoadingScreen = (props: IProps) => {
  const classes = useStyles();
  const { fullScreen = false } = props;

  return (
    <div
      className={clsx(
        classes.root,
        props.className,
        fullScreen ? "full-screen" : ""
      )}
    >
      <Box width={400}>
        <LinearProgress />
      </Box>
    </div>
  );
};
