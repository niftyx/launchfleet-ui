import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { IPool } from "types";

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
  },
}));

interface IProps {
  className?: string;
  pool: IPool;
}

export const PoolDetails = (props: IProps) => {
  const classes = useStyles();
  const { pool } = props;

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
                Token Distribution
              </Typography>
              <Typography className={classes.sectionValue}>
                February 4th 2021, 3:25 PM UTC
              </Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Min. allocation per wallet
              </Typography>
              <Typography className={classes.sectionValue}>0 ETH</Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Max. allocation per wallet
              </Typography>
              <Typography className={classes.sectionValue}>5 AVAX</Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Min Swap Level
              </Typography>
              <Typography className={classes.sectionValue}>15 AVAX</Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Access Type
              </Typography>
              <Typography className={classes.sectionValue}>Private</Typography>
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
                100,000,000
              </Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Holders
              </Typography>
              <Typography className={classes.sectionValue}>3,247</Typography>
            </div>
            <div className={classes.sectionRow}>
              <Typography className={classes.sectionComment}>
                Transfers
              </Typography>
              <Typography className={classes.sectionValue}>15,411</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
