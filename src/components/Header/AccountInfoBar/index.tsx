import {
  Avatar,
  Button,
  Popover,
  Typography,
  makeStyles,
} from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import clsx from "clsx";
import { DEFAULT_DECIMALS } from "config/constants";
import copy from "copy-to-clipboard";
import { BigNumber } from "ethers";
import { useSnackbar } from "notistack";
import { transparentize } from "polished";
import React, { useRef } from "react";
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
  paper: {
    backgroundColor: theme.colors.default,
    top: 50,
    width: 320,
    marginTop: 8,
    padding: "16px 24px",
    borderRadius: 8,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rowLabel: {
    fontSize: 14,
    color: theme.colors.third,
    fontWeight: 300,
  },
  copy: {
    cursor: "pointer",
    userSelect: "none",
    color: theme.colors.twelfth,
    padding: 4,
    borderRadius: "50%",
    transition: "all 0.4s",
    "& svg": {
      width: 18,
      height: 18,
    },
    "&:hover": {
      opacity: 0.7,
    },
  },
  divider: {
    marginBottom: 8,
    height: 1,
    backgroundColor: transparentize(0.9, theme.colors.eighth),
  },
  disconnect: {
    fontSize: 14,
    color: theme.colors.third,
    fontWeight: 300,
    height: 32,
  },
}));

interface IProps {
  className?: string;
  account: string;
  ethBalance: BigNumber;
  onDisconnect: () => void;
}

export const AccountInfoBar = (props: IProps) => {
  const classes = useStyles();
  const { account, ethBalance, onDisconnect } = props;
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = () => {
    setAnchorEl(ref.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "account-info-popover" : undefined;

  const onCopy = () => {
    copy(account);
    enqueueSnackbar("Copied to clipboard");
  };

  return (
    <>
      <div className={clsx(classes.root, props.className)} ref={ref}>
        <Avatar src="/imgs/avatar.png" />
        <div className={classes.middle}>
          <div className={classes.balance}>
            {formatToShortNumber(
              formatBigNumber(ethBalance, DEFAULT_DECIMALS, 3),
              3
            )}{" "}
            MATIC
          </div>
          <div className={classes.address}>{shortenAddress(account || "")}</div>
        </div>

        <div className={classes.moreWrapper}>
          <span className={classes.more} onClick={handleClick}>
            <MoreHorizIcon />
          </span>
        </div>
      </div>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        classes={{
          paper: classes.paper,
        }}
        id={id}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div>
          <div className={classes.row}>
            <Typography className={classes.rowLabel}>
              Balance available
            </Typography>
            <div className={classes.balance}>
              {formatToShortNumber(
                formatBigNumber(ethBalance, DEFAULT_DECIMALS, 3),
                3
              )}{" "}
              MATIC
            </div>
          </div>
          <div className={classes.row}>
            <Typography className={classes.rowLabel}>
              {shortenAddress(account || "")}
            </Typography>
            <span className={classes.copy} onClick={onCopy}>
              <FileCopyIcon />
            </span>
          </div>
          <div className={classes.divider} />
          <Button
            className={classes.disconnect}
            fullWidth
            onClick={onDisconnect}
          >
            Disconnect
          </Button>
        </div>
      </Popover>
    </>
  );
};
