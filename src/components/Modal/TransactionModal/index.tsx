import {
  CircularProgress,
  Modal,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getEtherscanUri } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: 350,
    backgroundColor: theme.colors.default,
    padding: theme.spacing(4),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    outline: "none",
    maxHeight: "80vh",
    userSelect: "none",
    overflowY: "auto",
    borderRadius: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  instruction: {
    marginTop: 16,
    fontSize: 14,
    color: theme.colors.secondary,
  },
  txLink: {
    marginTop: 16,
    display: "inline-block",
    fontSize: 16,
    color: theme.colors.twelfth,
  },
}));

interface IProps {
  className?: string;
  visible: boolean;
  onClose: () => void;
  title: string;
  instruction: string;
  txId: string;
}

export const TransactionModal = (props: IProps) => {
  const classes = useStyles();
  const { instruction, onClose, title, txId, visible } = props;
  const { networkId } = useConnectedWeb3Context();

  const etherscanUri = getEtherscanUri(networkId || DEFAULT_NETWORK_ID);
  return (
    <Modal disableBackdropClick onClose={onClose} open={visible}>
      <div className={clsx(classes.root, props.className)}>
        <Typography className={classes.title}>{title}</Typography>
        {txId && <CircularProgress color="primary" size={40} />}
        {instruction && (
          <Typography className={classes.instruction}>{instruction}</Typography>
        )}
        {txId && (
          <a
            className={classes.txLink}
            href={`${etherscanUri}tx/${txId}`}
            rel="noreferrer"
            target="_blank"
          >
            View TX
          </a>
        )}
      </div>
    </Modal>
  );
};
