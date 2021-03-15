import { Avatar, makeStyles } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import clsx from "clsx";
import { DEFAULT_DECIMALS } from "config/constants";
import copy from "copy-to-clipboard";
import { BigNumber } from "ethers";
import { useSnackbar } from "notistack";
import { transparentize } from "polished";
import React from "react";
import { formatBigNumber, formatToShortNumber, shortenAddress } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 16,
    color: theme.colors.twelfth,
    backgroundColor: theme.colors.default,
    textTransform: "none",
    height: 65,
    minWidth: 210,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
  },
  avatar: {},
  middle: { flex: 1, margin: "0 16px" },
  moreWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  balance: {
    color: transparentize(0.2, theme.colors.secondary),
    fontSize: 14,
    fontWeight: 300,
  },
  address: {
    fontSize: 14,
    color: theme.colors.third,
    fontWeight: 200,
  },
  more: {
    width: 24,
    height: 24,
    color: transparentize(0.3, theme.colors.twelfth),
    border: `1px solid ${transparentize(0.3, theme.colors.twelfth)}`,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
    cursor: "pointer",
    transition: "all 0.4s",
    "& svg": { width: 16, height: 16 },
    "&:hover": {
      color: transparentize(0.5, theme.colors.twelfth),
      border: `1px solid ${transparentize(0.5, theme.colors.twelfth)}`,
    },
  },
}));

interface IProps {
  className?: string;
  account: string;
  ethBalance: BigNumber;
}

export const AccountInfoBar = (props: IProps) => {
  const classes = useStyles();
  const { account, ethBalance } = props;
  const { enqueueSnackbar } = useSnackbar();

  const onCopy = () => {
    copy(account);
    enqueueSnackbar("Copied to clipboard");
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <Avatar src="/imgs/avatar.png" />
      <div className={classes.middle}>
        <div className={classes.balance}>
          {formatToShortNumber(
            formatBigNumber(ethBalance, DEFAULT_DECIMALS, 3),
            3
          )}{" "}
          AVAX
        </div>
        <div className={classes.address}>{shortenAddress(account || "")}</div>
      </div>

      <div className={classes.moreWrapper}>
        <span className={classes.more}>
          <MoreHorizIcon />
        </span>
      </div>
    </div>
  );
};
