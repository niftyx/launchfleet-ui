import { BigNumber } from "@ethersproject/bignumber";
import { Button, Grid, makeStyles } from "@material-ui/core";
import { ReactComponent as ArrowRightIcon } from "assets/svgs/arrow-right.svg";
import { ReactComponent as InfoCirlceIcon } from "assets/svgs/info-round-rect.svg";
import clsx from "clsx";
import {
  DspTlpSwitch,
  FormRatioField,
  FormTextField,
  SimpleLoader,
  TokenInput,
  YesNoSwitch,
} from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ERC20Service } from "services/erc20";
import { IBasePool } from "types";
import { formatBigNumber } from "utils";
import { ZERO_NUMBER } from "utils/number";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  root: {},
  submit: {
    borderRadius: 12,
  },
  submitDisabled: {
    backgroundColor: `${theme.colors.seventh} !important`,
  },
  label: {
    color: theme.colors.fourteen,
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    "&.switchLabel": {
      maxWidth: 360,
      marginBottom: 16,
    },
  },
  subLabel: {
    color: theme.colors.fourteen,
    fontSize: 12,
    display: "flex",
    alignItems: "center",
  },
}));

interface IProps {
  className?: string;
  basePool: IBasePool;
  onNext: (_: any) => void;
}

interface IFormValues {
  auctionFinishTimestamp: BigNumber;
  expectedRate: BigNumber;
  pozRate: BigNumber;
  startAmount: BigNumber;
  lockedUntil: number;
  poolzHoldersDifferentRatio: boolean;
}

interface IState {
  balance: BigNumber;
  loading: boolean;
}

export const SwapRulesForm = (props: IProps) => {
  const classes = useStyles();
  const { basePool, onNext } = props;
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    balance: ZERO_NUMBER,
    loading: true,
  });
  const token = getTokenFromAddress(
    networkId || DEFAULT_NETWORK_ID,
    basePool.token
  );

  useEffect(() => {
    let isMounted = true;

    const loadBalance = async () => {
      try {
        const erc20Service = new ERC20Service(
          provider,
          account,
          basePool.token
        );
        const balance = await erc20Service.getBalanceOf(account || "");
        if (isMounted) setState(() => ({ loading: false, balance }));
      } catch (error) {
        if (isMounted)
          setState(() => ({ loading: false, balance: ZERO_NUMBER }));
      }
    };

    loadBalance();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePool.token]);

  const renderForm = () => {
    const initialFormValues: IFormValues = {
      auctionFinishTimestamp: basePool.auctionFinishTimestamp,
      expectedRate: basePool.expectedRate,
      pozRate: basePool.pozRate,
      startAmount: basePool.startAmount,
      lockedUntil: basePool.lockedUntil,
      poolzHoldersDifferentRatio: !basePool.expectedRate.eq(basePool.pozRate),
    };

    return (
      <Formik
        initialValues={initialFormValues}
        onSubmit={(values, { setFieldError }) => {
          if (values.startAmount.eq(ZERO_NUMBER)) {
            setFieldError("startAmount", "Error");
            return;
          }
          if (values.expectedRate.eq(ZERO_NUMBER)) {
            setFieldError("expectedRate", "Error");
            return;
          }
          if (
            values.pozRate.eq(ZERO_NUMBER) &&
            values.poolzHoldersDifferentRatio
          ) {
            setFieldError("pozRate", "Error");
            return;
          }

          if (values.poolzHoldersDifferentRatio) {
            onNext(values);
          } else {
            onNext({
              ...values,
              pozRate: values.expectedRate,
            });
          }
        }}
        validationSchema={Yup.object().shape({
          auctionFinishTimestamp: Yup.string().required(),
        })}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          isValid,
          setFieldValue,
          touched,
          values,
        }) => (
          <Form
            className={clsx(classes.root, props.className)}
            onSubmit={handleSubmit}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormRatioField
                  FormControlProps={{ fullWidth: true }}
                  FormHelperTextProps={{
                    error: Boolean(touched.expectedRate && errors.expectedRate),
                  }}
                  InputLabelProps={{ htmlFor: "token", shrink: true }}
                  label="Swap ratio"
                  onChange={(expectedRate) =>
                    setFieldValue("expectedRate", expectedRate)
                  }
                  tokenSymbol={token.symbol}
                  value={values.expectedRate}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <div className={classes.label}>
                  <span>Amount of tokens locked</span>
                  <span>
                    Balance: {formatBigNumber(state.balance, token.decimals)}
                  </span>
                </div>
                <TokenInput
                  amount={values.startAmount}
                  maxVisible
                  onChangeValue={(startAmount) =>
                    setFieldValue("startAmount", startAmount)
                  }
                  onMax={() => {
                    setFieldValue("startAmount", state.balance);
                  }}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormTextField
                  FormControlProps={{ fullWidth: true }}
                  FormHelperTextProps={{
                    error: Boolean(
                      touched.auctionFinishTimestamp &&
                        errors.auctionFinishTimestamp
                    ),
                  }}
                  InputLabelProps={{
                    htmlFor: "auctionFinishTimestamp",
                    shrink: true,
                  }}
                  InputProps={{
                    id: "auctionFinishTimestamp",
                    name: "auctionFinishTimestamp",
                    onBlur: handleBlur,
                    onChange: (e) => {
                      const time = moment(e.target.value).utc().valueOf();
                      setFieldValue(
                        "auctionFinishTimestamp",
                        BigNumber.from(`${Math.floor(time / 1000)}`)
                      );
                    },
                    placeholder: "",
                    value: values.auctionFinishTimestamp.eq(ZERO_NUMBER)
                      ? ""
                      : moment(
                          values.auctionFinishTimestamp.toNumber() * 1000
                        ).format("yyyy-MM-DDThh:mm"),
                    required: true,
                    disableUnderline: true,
                    type: "datetime-local",
                  }}
                  label="Pool running time"
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <div className={clsx(classes.label, "switchLabel")}>
                  <div className={classes.subLabel}>
                    <span>Different swap ratio for poolz holders?</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <InfoCirlceIcon />
                  </div>
                  <YesNoSwitch
                    checked={values.poolzHoldersDifferentRatio}
                    onToggle={() => {
                      setFieldValue(
                        "poolzHoldersDifferentRatio",
                        !values.poolzHoldersDifferentRatio
                      );
                    }}
                  />
                </div>
                <div className={clsx(classes.label, "switchLabel")}>
                  <div className={classes.subLabel}>
                    <span>Lock-in period rules</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <InfoCirlceIcon />
                  </div>
                  <DspTlpSwitch
                    isDsp={values.lockedUntil === 0}
                    setDsp={(lockedUntil) => {
                      setFieldValue("lockedUntil", lockedUntil);
                    }}
                  />
                </div>
              </Grid>
              {values.poolzHoldersDifferentRatio && (
                <Grid item sm={6} xs={12}>
                  <FormRatioField
                    FormControlProps={{ fullWidth: true }}
                    FormHelperTextProps={{
                      error: Boolean(touched.pozRate && errors.pozRate),
                    }}
                    InputLabelProps={{ htmlFor: "token", shrink: true }}
                    label="Pool holders swap ratio"
                    onChange={(pozRate) => setFieldValue("pozRate", pozRate)}
                    tokenSymbol={token.symbol}
                    value={values.pozRate}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  className={classes.submit}
                  classes={{ disabled: classes.submitDisabled }}
                  color="primary"
                  disabled={!isValid}
                  fullWidth
                  type="submit"
                  variant="contained"
                >
                  Confirm&nbsp;&nbsp;
                  <ArrowRightIcon />
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  };
  return state.loading ? <SimpleLoader /> : renderForm();
};
