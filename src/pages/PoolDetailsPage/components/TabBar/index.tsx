import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useConnectedWeb3Context } from "contexts";
import { transparentize } from "polished";
import React, { useEffect } from "react";
import useCommonStyles from "styles/common";
import { IPool } from "types";
import { EPoolDetailsTab } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    overflowX: "auto",
    paddingBottom: 8,
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
    whiteSpace: "nowrap",
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
  pool: IPool;
}

export const TabBar = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account } = useConnectedWeb3Context();
  const isConnected = !!account;
  const { onChangeTab, pool, tab } = props;

  useEffect(() => {
    if (!isConnected && tab === EPoolDetailsTab.YourAllocations) {
      onChangeTab(EPoolDetailsTab.PoolDetails);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <div
      className={clsx(
        commonClasses.scrollHorizontal,
        classes.root,
        props.className
      )}
    >
      {Object.values(EPoolDetailsTab)
        .filter((e) => {
          switch (e) {
            case EPoolDetailsTab.Manage:
              return pool.creator === (account || "").toLowerCase();
            case EPoolDetailsTab.YourAllocations:
              return isConnected;
            default:
              return true;
          }
        })
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
