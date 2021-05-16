import { BigNumber } from "@ethersproject/bignumber";
import { Button, Grid, makeStyles } from "@material-ui/core";
import { ReactComponent as ArrowRightIcon } from "assets/svgs/arrow-right.svg";
import clsx from "clsx";
import {
  FormRatioField,
  FormTextField,
  PoolTypeSelect,
  SimpleLoader,
  TokenInput,
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
import { EPoolType } from "utils/enums";
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
    },
    "&.noMargin": {
      marginBottom: 0,
      "& + div": {
        marginTop: 12,
      },
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
  tokenTarget: BigNumber;
  poolType: EPoolType;
  multiplier: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  claimTime: BigNumber;
  minWei: BigNumber;
  maxWei: BigNumber;
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
    basePool.weiToken
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
      tokenTarget: basePool.tokenTarget,
      poolType: basePool.poolType,
      multiplier: basePool.multiplier,
      startTime: basePool.startTime,
      endTime: basePool.endTime,
      claimTime: basePool.claimTime,
      minWei: basePool.minWei,
      maxWei: basePool.maxWei,
    };

    return (
      <Formik
        initialValues={initialFormValues}
        onSubmit={(values, { setFieldError }) => {
          if (values.tokenTarget.eq(ZERO_NUMBER)) {
            setFieldError("tokenTarget", "StartAmount can't be zero.");
            return;
          }
          if (values.tokenTarget.gt(state.balance)) {
            setFieldError("tokenTarget", "Insufficient fund!");
            return;
          }
          if (values.multiplier.eq(ZERO_NUMBER)) {
            setFieldError("multiplier", "ExpectedRate can't be zero.");
            return;
          }

          if (values.minWei.eq(ZERO_NUMBER)) {
            setFieldError("minWei", "Min Allocation can't be zero.");
            return;
          }
          if (values.minWei.gte(values.maxWei)) {
            setFieldError(
              "maxWei",
              "Max Allocation should be greater than Min Allocation"
            );
            return;
          }

          const nowTime = BigNumber.from(Math.floor(Date.now() / 1000));
          if (values.startTime.lte(nowTime)) {
            setFieldError("startTime", "StartTime can't be past time.");
            return;
          }
          if (values.endTime.lte(values.startTime)) {
            setFieldError("endTime", "EndTime can't be earlier than startTime");
            return;
          }
          if (values.claimTime.lte(values.endTime)) {
            setFieldError(
              "claimTime",
              "ClaimTime can't be earlier than endTime"
            );
            return;
          }

          const payloadValues = { ...values };

          onNext(payloadValues);
        }}
        validationSchema={Yup.object().shape({
          startTime: Yup.string().required(),
          endTime: Yup.string().required(),
          claimTime: Yup.string().required(),
        })}
      >
        {({
          errors,
          handleBlur,
          handleSubmit,
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
                    error: Boolean(touched.multiplier && errors.multiplier),
                  }}
                  InputLabelProps={{ htmlFor: "token", shrink: true }}
                  helperText={
                    (touched["multiplier"] && errors["multiplier"]) as string
                  }
                  integerOnly
                  label="Swap ratio"
                  onChange={(multiplier) =>
                    setFieldValue("multiplier", multiplier)
                  }
                  tokenSymbol={token.symbol}
                  value={values.multiplier}
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
                  FormHelperTextProps={{
                    error: Boolean(touched.tokenTarget && errors.tokenTarget),
                  }}
                  amount={values.tokenTarget}
                  helperText={
                    (touched["tokenTarget"] && errors["tokenTarget"]) as string
                  }
                  maxVisible
                  onChangeValue={(tokenTarget) =>
                    setFieldValue("tokenTarget", tokenTarget)
                  }
                  onMax={() => {
                    setFieldValue("tokenTarget", state.balance);
                  }}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormTextField
                  FormControlProps={{ fullWidth: true }}
                  FormHelperTextProps={{
                    error: Boolean(touched.startTime && errors.startTime),
                  }}
                  InputLabelProps={{
                    htmlFor: "startTime",
                    shrink: true,
                  }}
                  InputProps={{
                    id: "startTime",
                    name: "startTime",
                    onBlur: handleBlur,
                    onChange: (e) => {
                      const time = moment(e.target.value).utc().valueOf();
                      setFieldValue(
                        "startTime",
                        BigNumber.from(`${Math.floor(time / 1000)}`)
                      );
                    },
                    placeholder: "",
                    value: values.startTime.eq(ZERO_NUMBER)
                      ? ""
                      : moment(values.startTime.toNumber() * 1000).format(
                          "yyyy-MM-DDThh:mm"
                        ),
                    required: true,
                    disableUnderline: true,
                    type: "datetime-local",
                  }}
                  helperText={
                    (touched["startTime"] && errors["startTime"]) as string
                  }
                  label="Pool start time"
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormTextField
                  FormControlProps={{ fullWidth: true }}
                  FormHelperTextProps={{
                    error: Boolean(touched.endTime && errors.endTime),
                  }}
                  InputLabelProps={{
                    htmlFor: "endTime",
                    shrink: true,
                  }}
                  InputProps={{
                    id: "endTime",
                    name: "endTime",
                    onBlur: handleBlur,
                    onChange: (e) => {
                      const time = moment(e.target.value).utc().valueOf();
                      setFieldValue(
                        "endTime",
                        BigNumber.from(`${Math.floor(time / 1000)}`)
                      );
                    },
                    placeholder: "",
                    value: values.endTime.eq(ZERO_NUMBER)
                      ? ""
                      : moment(values.endTime.toNumber() * 1000).format(
                          "yyyy-MM-DDThh:mm"
                        ),
                    required: true,
                    disableUnderline: true,
                    type: "datetime-local",
                  }}
                  helperText={
                    (touched["endTime"] && errors["endTime"]) as string
                  }
                  label="Pool end time"
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormTextField
                  FormControlProps={{ fullWidth: true }}
                  FormHelperTextProps={{
                    error: Boolean(touched.claimTime && errors.claimTime),
                  }}
                  InputLabelProps={{
                    htmlFor: "claimTime",
                    shrink: true,
                  }}
                  InputProps={{
                    id: "claimTime",
                    name: "claimTime",
                    onBlur: handleBlur,
                    onChange: (e) => {
                      const time = moment(e.target.value).utc().valueOf();
                      setFieldValue(
                        "claimTime",
                        BigNumber.from(`${Math.floor(time / 1000)}`)
                      );
                    },
                    placeholder: "",
                    value: values.claimTime.eq(ZERO_NUMBER)
                      ? ""
                      : moment(values.claimTime.toNumber() * 1000).format(
                          "yyyy-MM-DDThh:mm"
                        ),
                    required: true,
                    disableUnderline: true,
                    type: "datetime-local",
                  }}
                  helperText={
                    (touched["claimTime"] && errors["claimTime"]) as string
                  }
                  label="Pool claim time"
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <div className={classes.label}>
                  <span>Min Allocation Per Wallet</span>
                </div>
                <TokenInput
                  FormHelperTextProps={{
                    error: Boolean(touched.minWei && errors.minWei),
                  }}
                  amount={values.minWei}
                  helperText={(touched["minWei"] && errors["minWei"]) as string}
                  maxVisible={false}
                  onChangeValue={(minWei) => setFieldValue("minWei", minWei)}
                  onMax={() => {}}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <div className={classes.label}>
                  <span>Max Allocation Per Wallet</span>
                </div>
                <TokenInput
                  FormHelperTextProps={{
                    error: Boolean(touched.maxWei && errors.maxWei),
                  }}
                  amount={values.maxWei}
                  helperText={(touched["maxWei"] && errors["maxWei"]) as string}
                  maxVisible={false}
                  onChangeValue={(maxWei) => setFieldValue("maxWei", maxWei)}
                  onMax={() => {}}
                />
              </Grid>
              <Grid item lg={6} xs={12}>
                <div className={clsx(classes.label, "switchLabel")}>
                  <span>Pool Type</span>
                </div>
                <PoolTypeSelect
                  onChange={(poolType) => {
                    setFieldValue("poolType", poolType);
                  }}
                  poolType={values.poolType}
                />
              </Grid>

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
