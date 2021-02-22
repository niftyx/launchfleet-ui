import { makeStyles } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import clsx from "clsx";
import { DEFAULT_DECIMALS } from "config/constants";
import copy from "copy-to-clipboard";
import { BigNumber } from "ethers";
import { useSnackbar } from "notistack";
import React from "react";
import { formatBigNumber, formatToShortNumber, shortenAddress } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "8px 16px",
    border: `1px solid ${theme.colors.secondary}`,
    borderRadius: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressWrapper: {
    display: "flex",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: theme.colors.secondary,
    padding: "0 12px",
    borderRadius: 24,
    color: theme.colors.primary,
  },
  copy: {
    marginLeft: 8,
    display: "inline-block",
    width: 16,
    height: 16,
    lineHeight: 1,
    cursor: "pointer",
    "& svg": {
      fontSize: 16,
      width: 16,
      height: 16,
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
      <span>
        {formatToShortNumber(
          formatBigNumber(ethBalance, DEFAULT_DECIMALS, 3),
          3
        )}{" "}
        AVAX
      </span>
      <div className={classes.addressWrapper}>
        <span>{shortenAddress(account || "")}</span>
        <span className={classes.copy} onClick={onCopy}>
          <FileCopyIcon />
        </span>
      </div>
    </div>
  );
};
