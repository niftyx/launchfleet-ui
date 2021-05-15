import { Tooltip, Typography, makeStyles } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken } from "config/networks";
import { useGlobal } from "contexts";
import React from "react";
import { formatBigNumber } from "utils";
import { EPoolType } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: theme.colors.default,
    borderRadius: 8,
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  item: {
    cursor: "pointer",
    flex: 1,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    padding: "16px 0",
    transition: "all 0.4s",
    "&.active": {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.default,
    },
    "& + &": {
      borderLeft: `1px solid ${theme.colors.seventh}`,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      "& + &": {
        borderLeft: "none",
        borderTop: `1px solid ${theme.colors.seventh}`,
      },
    },
  },
  name: {
    whiteSpace: "nowrap",
  },
}));

interface IProps {
  className?: string;
  poolType: EPoolType;
  onChange: (_: EPoolType) => void;
}

export const PoolTypeSelect = (props: IProps) => {
  const classes = useStyles();
  const { onChange, poolType } = props;
  const {
    data: {
      baseTokenInfo: { amount },
    },
  } = useGlobal();
  const baseToken = getToken(DEFAULT_NETWORK_ID, "launch");

  const finalAmountStr = amount.isZero()
    ? ""
    : formatBigNumber(amount, baseToken.decimals);

  const TYPE_INFO = [
    {
      name: "Private",
      hint:
        "You can add wallets to whitelists and only white-listed users can participate in the pool.",
    },
    {
      name: "LAUNCH Holders",
      hint: `Users than own ${finalAmountStr} LAUNCH token can participate in the pool.`,
    },
    {
      name: "Public",
      hint: "Any users can participate in the pool.",
    },
  ];

  return (
    <div className={clsx(classes.root, props.className)}>
      {[EPoolType.Private, EPoolType.BaseHolder, EPoolType.Public].map(
        (type, index) => {
          const info = TYPE_INFO[index];
          return (
            <div
              className={clsx(classes.item, type === poolType ? "active" : "")}
              key={type}
              onClick={() => onChange(type as EPoolType)}
            >
              <Typography className={classes.name} component="p">
                {info.name}
              </Typography>
              &nbsp;
              <Tooltip title={info.hint}>
                <HelpOutlineIcon />
              </Tooltip>
            </div>
          );
        }
      )}
    </div>
  );
};