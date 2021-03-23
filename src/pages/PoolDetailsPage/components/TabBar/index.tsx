import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useConnectedWeb3Context } from "contexts";
import { transparentize } from "polished";
import React, { useEffect } from "react";
import { EPoolDetailsTab } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 32,
    },
  },
  item: {
    userSelect: "none",
    cursor: "pointer",
    transition: "all 0.4s",
    padding: "8px 0",
    position: "relative",
    color: theme.colors.third,
    "&::after": {
      content: `" "`,
      position: "absolute",
      left: "50%",
      width: 0,
      bottom: 0,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.transparent,
      transition: "all 0.4s",
    },
    "&:hover": {
      color: transparentize(0.3, theme.colors.primary),
      "&::after": {
        content: `" "`,
        position: "absolute",
        left: 0,
        width: "100%",
        bottom: 0,
        height: 4,
        borderRadius: 2,
        backgroundColor: transparentize(0.3, theme.colors.primary),
      },
    },
    "&.active": {
      color: theme.colors.primary,
      "&::after": {
        content: `" "`,
        position: "absolute",
        left: 0,
        width: "100%",
        bottom: 0,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
      },
    },
  },
}));

interface IProps {
  className?: string;
  tab: EPoolDetailsTab;
  onChangeTab: (_: EPoolDetailsTab) => void;
}

export const TabBar = (props: IProps) => {
  const classes = useStyles();
  const { account } = useConnectedWeb3Context();
  const isConnected = !!account;
  const { onChangeTab, tab } = props;

  useEffect(() => {
    if (!isConnected && tab === EPoolDetailsTab.YourAllocations) {
      onChangeTab(EPoolDetailsTab.PoolDetails);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <div className={clsx(classes.root, props.className)}>
      {Object.values(EPoolDetailsTab)
        .filter((e) => e !== EPoolDetailsTab.YourAllocations || isConnected)
        .map((e) => (
          <div
            className={clsx(classes.item, tab === e ? "active" : "")}
            key={e}
            onClick={() => onChangeTab(e)}
          >
            {e}
          </div>
        ))}
    </div>
  );
};
