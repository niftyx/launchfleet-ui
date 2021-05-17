import { Tooltip, Typography, makeStyles } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import axios from "axios";
import clsx from "clsx";
import { COVALENTHQ_API_KEY, DEFAULT_NETWORK_ID } from "config/constants";
import { getToken, getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IPool } from "types";
import { formatBigNumber, numberWithCommas } from "utils";
import { getPoolTypeConfigTexts } from "utils/pool";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 24,
  },
  content: {
    display: "flex",
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      display: "block",
    },
  },
  section: {
    backgroundColor: theme.colors.default,
    borderRadius: 24,
    padding: "24px 32px",
    width: `calc(50% - 12px)`,
    "& + &": {
      marginLeft: 24,
    },
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      width: "auto",
      "& + &": {
        marginLeft: 0,
        marginTop: 24,
      },
    },
  },
  sectionTitle: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontWeight: 600,
  },
  sectionContent: {
    marginTop: 12,
  },
  sectionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    "& + &": {
      borderTop: `1px solid ${theme.colors.ninth}`,
    },
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  sectionComment: {
    color: theme.colors.third,
    fontWeight: 200,
    marginRight: 16,
  },
  sectionValue: {
    color: theme.colors.secondary,
    fontWeight: 200,
    wordBreak: "break-all",
    display: "flex",
    alignItems: "center",
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

interface IState {
  holders: number;
}

export const PoolDetails = (props: IProps) => {
  const classes = useStyles();
  const { pool } = props;
  const {
    data: {
      baseTokenInfo: { amount },
    },
  } = useGlobal();
  const { networkId } = useConnectedWeb3Context();
  const mainToken = getTokenFromAddress(
    networkId || DEFAULT_NETWORK_ID,
    pool.weiToken
  );
  const baseToken = getToken(DEFAULT_NETWORK_ID, "launch");
  const [state, setState] = useState<IState>({ holders: 0 });

  const finalAmountStr = amount.isZero()
    ? ""
    : formatBigNumber(amount, baseToken.decimals);
  const TYPE_INFO = getPoolTypeConfigTexts(finalAmountStr);

  useEffect(() => {
    const loadTokenHoldersAndTransfers = async () => {
      setState((prev) => ({ ...prev, holders: 0 }));
      const holdersEndPoint = `https://api.covalenthq.com/v1/${networkId}/tokens/${pool.token}/token_holders/?key=${COVALENTHQ_API_KEY}`;
      // const transfersEndPoint = `https://api.covalenthq.com/v1/${networkId}/address/${pool.token}/transactions_v2/?key=${COVALENTHQ_API_KEY}`;
      try {
        const holdersData = (await axios.get(holdersEndPoint)).data;
        const holders = holdersData.data.pagination.total_count;
        setState((prev) => ({ ...prev, holders }));
      } catch (error) {
        console.warn(error);
        setState((prev) => ({ ...prev, holders: 0 }));
      }
    };

    loadTokenHoldersAndTransfers();
  }, [pool.token]);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <div className={classes.section}>
          <Typography className={classes.sectionTitle}>
            Pool information
          </Typography>
          <div className={classes.sectionContent}>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Start Time
              </Typography>
              <Typography className={classes.sectionValue}>
                {moment(pool.startTime.toNumber() * 1000)
                  .utc()
                  .format("MMM DD HH:MM:SS")}
                &nbsp;UTC
              </Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Finish Time
              </Typography>
              <Typography className={classes.sectionValue}>
                {moment(pool.endTime.toNumber() * 1000)
                  .utc()
                  .format("MMM DD HH:MM:SS")}
                &nbsp;UTC
              </Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Claim Time
              </Typography>
              <Typography className={classes.sectionValue}>
                {moment(pool.claimTime.toNumber() * 1000)
                  .utc()
                  .format("MMM DD HH:MM:SS")}
                &nbsp;UTC
              </Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Min. allocation per wallet
              </Typography>
              <Typography className={classes.sectionValue}>
                {formatBigNumber(pool.minWei, mainToken.decimals)}&nbsp;
                {mainToken.symbol.toUpperCase()}
              </Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Max. allocation per wallet
              </Typography>
              <Typography className={classes.sectionValue}>
                {formatBigNumber(pool.maxWei, mainToken.decimals)}&nbsp;
                {mainToken.symbol.toUpperCase()}
              </Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Access Type
              </Typography>
              <Typography className={classes.sectionValue}>
                {["Private", "LAUNCH holders", "Public"][pool.poolType]}
                &nbsp;
                <Tooltip title={TYPE_INFO[pool.poolType].hint}>
                  <HelpOutlineIcon />
                </Tooltip>
              </Typography>
            </div>
          </div>
        </div>
        <div className={classes.section}>
          <Typography className={classes.sectionTitle}>
            Token Information
          </Typography>
          <div className={classes.sectionContent}>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>Name</Typography>
              <Typography className={classes.sectionValue}>
                {pool.tokenName}
              </Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Address
              </Typography>
              <Typography align="right" className={classes.sectionValue}>
                {pool.token}
              </Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Total Supply
              </Typography>
              <Typography className={classes.sectionValue}>
                {numberWithCommas(
                  formatBigNumber(pool.tokenTotalSupply, pool.tokenDecimals, 0)
                )}
              </Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Holders
              </Typography>
              <Typography className={classes.sectionValue}>
                {numberWithCommas(state.holders)}
              </Typography>
            </div>
            {/* <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Transfers
              </Typography>
              <Typography className={classes.sectionValue}>15,411</Typography>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
