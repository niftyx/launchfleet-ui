import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { waitSeconds } from "utils";
import { getRemainingTimeStr } from "utils/pool";

const useStyles = makeStyles((theme) => ({
  root: { color: theme.colors.third, fontSize: 12, lineHeight: "16px" },
}));

interface IProps {
  className?: string;
  toTimestamp: number;
  onFinished: () => void;
}

interface IState {
  nowTime: number;
}

export const Timer = (props: IProps) => {
  const classes = useStyles();
  const nowTime = Math.floor(Date.now() / 1000);
  const { onFinished, toTimestamp } = props;

  const [state, setState] = useState<IState>({
    nowTime,
  });

  useEffect(() => {
    let isMounted = true;
    const setNowTime = async () => {
      while (isMounted) {
        const nowTime = Math.floor(Date.now() / 1000);
        setState((prev) => ({ ...prev, nowTime }));
        await waitSeconds(1);
        if (nowTime === toTimestamp) {
          onFinished();
          break;
        }
      }
    };

    setNowTime();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Typography align="center" className={clsx(classes.root, props.className)}>
      {getRemainingTimeStr(toTimestamp - state.nowTime)}
    </Typography>
  );
};
