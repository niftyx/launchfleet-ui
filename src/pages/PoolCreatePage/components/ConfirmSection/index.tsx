import { Button, Grid, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_DECIMALS, DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import moment from "moment";
import { transparentize } from "polished";
import React from "react";
import { IBasePool } from "types";
import { formatBigNumber } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {},
  section: {},
  sectionTitle: {
    color: theme.colors.secondary,
    fontWeight: 500,
  },
  sectionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    "& + &": {
      borderTop: `1px solid ${transparentize(0.9, theme.colors.eighth)}`,
      paddingTop: 12,
    },
  },
  sectionRowComment: {
    color: theme.colors.third,
    fontSize: 13,
  },
  sectionRowValue: {
    color: theme.colors.secondary,
    fontSize: 13,
    fontWeight: 500,
    marginLeft: 16,
    "&.long": {
      wordBreak: "break-all",
    },
  },
}));

interface IProps {
  className?: string;
  basePool: IBasePool;
  onConfirm: () => void;
}

export const ConfirmSection = (props: IProps) => {
  const classes = useStyles();
  const { basePool } = props;
  const { account, networkId } = useConnectedWeb3Context();
  const isConnected = !!account;
  const toToken = getTokenFromAddress(
    networkId || DEFAULT_NETWORK_ID,
    basePool.weiToken
  );

  return (
    <div className={clsx(classes.root, props.className)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography className={classes.sectionTitle}>
            Token Information
          </Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <div className={classes.sectionRow}>
            <Typography className={classes.sectionRowComment}>Name</Typography>
            <Typography className={classes.sectionRowValue}>
              {basePool.tokenName}
            </Typography>
          </div>
          <div className={classes.sectionRow}>
            <Typography className={classes.sectionRowComment}>
              Symbol
            </Typography>
            <Typography className={classes.sectionRowValue}>
              {basePool.tokenSymbol.toUpperCase()}
            </Typography>
          </div>
        </Grid>
        <Grid item sm={6} xs={12}>
          <div className={classes.sectionRow}>
            <Typography className={classes.sectionRowComment}>
              Address
            </Typography>
            <Typography className={clsx(classes.sectionRowValue, "long")}>
              {basePool.token}
            </Typography>
          </div>
          <div className={classes.sectionRow}>
            <Typography className={classes.sectionRowComment}>
              To token
            </Typography>
            <Typography className={classes.sectionRowValue}>
              {toToken.symbol.toUpperCase()}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.sectionTitle}>Swap Rules</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          {/* <div className={classes.sectionRow}>
            <Typography className={classes.sectionRowComment}>
              Swap ratio
            </Typography>
            <Typography className={classes.sectionRowValue}>
              1{toToken.symbol.toUpperCase()} ={" "}
              {formatBigNumber(basePool.multiplier, DEFAULT_DECIMALS, 0)}{" "}
              {basePool.tokenSymbol.toUpperCase()}
            </Typography>
          </div>
          <div className={classes.sectionRow}>
            <Typography className={classes.sectionRowComment}>
              Amount of tokens to lock
            </Typography>
            <Typography className={classes.sectionRowValue}>
              {formatBigNumber(basePool.tokenTarget, DEFAULT_DECIMALS, 0)}
            </Typography>
          </div> */}
        </Grid>
        <Grid item sm={6} xs={12}>
          <div className={classes.sectionRow}>
            <Typography className={classes.sectionRowComment}>
              Pool running time
            </Typography>
            <Typography className={clsx(classes.sectionRowValue, "long")}>
              {moment(basePool.startTime.toNumber() * 1000).toLocaleString()}
            </Typography>
          </div>
          <div className={classes.sectionRow}>
            <Typography className={classes.sectionRowComment}>
              Different swap ratio for poolz holders
            </Typography>
            {/* <Typography className={classes.sectionRowValue}>
              {basePool.pozRate.eq(basePool.multiplier) ? "No, " : "Yes, "}1
              {toToken.symbol.toUpperCase()} ={" "}
              {formatBigNumber(basePool.pozRate, DEFAULT_DECIMALS, 0)}{" "}
              {basePool.tokenSymbol.toUpperCase()}
            </Typography> */}
          </div>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            fullWidth
            onClick={props.onConfirm}
            variant="contained"
          >
            {isConnected ? "Create pool" : "Connect and create pool"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
