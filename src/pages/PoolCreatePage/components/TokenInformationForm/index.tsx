import { Button, Grid, makeStyles } from "@material-ui/core";
import { ReactComponent as ArrowRightIcon } from "assets/svgs/arrow-right.svg";
import clsx from "clsx";
import { FormSelectField, FormTextField } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken, networks, tokenIds } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { ethers } from "ethers";
import { Form, Formik } from "formik";
import React from "react";
import { ERC20Service } from "services/erc20";
import { IBasePool, KnownToken } from "types";
import { ZERO_ADDRESS } from "utils/token";
import { isAddress } from "utils/tools";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  root: {},
  submit: {
    borderRadius: 12,
  },
  submitDisabled: {
    backgroundColor: `${theme.colors.seventh} !important`,
  },
}));

interface IProps {
  className?: string;
  basePool: IBasePool;
  onNext: (_: any) => void;
}

interface IFormValues {
  token: string;
  tokenName: string;
  symbol: string;
  decimals: number;
  toToken: string;
}

export const TokenInformationForm = (props: IProps) => {
  const classes = useStyles();
  const { basePool, onNext } = props;
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const initialFormValues: IFormValues = {
    token: basePool.token,
    tokenName: basePool.tokenName,
    symbol: basePool.tokenSymbol,
    decimals: basePool.tokenDecimals,
    toToken: basePool.mainCoin,
  };

  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={(values) => {
        onNext({
          ...values,
          tokenSymbol: values.symbol,
          tokenDecimals: values.decimals,
          mainCoin: values.toToken,
        });
      }}
      validationSchema={Yup.object().shape({
        token: Yup.string().required(),
        tokenName: Yup.string().required(),
        symbol: Yup.string().required(),
        decimals: Yup.number().required(),
        toToken: Yup.string().required(),
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
            <Grid item sm={6} xs={12}>
              <FormTextField
                FormControlProps={{ fullWidth: true }}
                FormHelperTextProps={{
                  error: Boolean(touched.token && errors.token),
                }}
                InputLabelProps={{ htmlFor: "token", shrink: true }}
                InputProps={{
                  id: "token",
                  name: "token",
                  onBlur: handleBlur,
                  onChange: (e) => {
                    handleChange(e);
                    const tokenAddress = e.target.value;
                    if (isAddress(tokenAddress)) {
                      const network = networks[DEFAULT_NETWORK_ID];
                      const erc20Service = new ERC20Service(
                        provider ||
                          new ethers.providers.JsonRpcProvider(
                            network.url,
                            DEFAULT_NETWORK_ID
                          ),
                        account,
                        tokenAddress
                      );
                      erc20Service
                        .getProfileSummary()
                        .then((token) => {
                          setFieldValue("symbol", token?.symbol);
                          setFieldValue("decimals", token?.decimals);
                        })
                        .catch((err) => {
                          setFieldValue("symbol", "");
                          setFieldValue("decimals", 0);
                        });
                    } else {
                      setFieldValue("symbol", "");
                      setFieldValue("decimals", 0);
                    }
                  },
                  placeholder: "",
                  value: values.token,
                  required: true,
                  disableUnderline: true,
                }}
                helperText={touched.token && errors.token}
                label="Token contract address"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormTextField
                FormControlProps={{ fullWidth: true }}
                FormHelperTextProps={{
                  error: Boolean(touched.tokenName && errors.tokenName),
                }}
                InputLabelProps={{ htmlFor: "tokenName", shrink: true }}
                InputProps={{
                  id: "tokenName",
                  name: "tokenName",
                  onBlur: handleBlur,
                  onChange: handleChange,
                  placeholder: "",
                  value: values.tokenName,
                  required: true,
                  disableUnderline: true,
                }}
                helperText={touched.tokenName && errors.tokenName}
                label="Token name"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormTextField
                FormControlProps={{ fullWidth: true }}
                FormHelperTextProps={{
                  error: Boolean(touched.symbol && errors.symbol),
                }}
                InputLabelProps={{ htmlFor: "symbol", shrink: true }}
                InputProps={{
                  id: "symbol",
                  name: "symbol",
                  onBlur: handleBlur,
                  onChange: handleChange,
                  placeholder: "",
                  value: values.symbol,
                  required: true,
                  disableUnderline: true,
                  disabled: true,
                }}
                helperText={touched.symbol && errors.symbol}
                label="Token symbol"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormTextField
                FormControlProps={{ fullWidth: true }}
                FormHelperTextProps={{
                  error: Boolean(touched.decimals && errors.decimals),
                }}
                InputLabelProps={{ htmlFor: "decimals", shrink: true }}
                InputProps={{
                  id: "decimals",
                  name: "decimals",
                  onBlur: handleBlur,
                  onChange: handleChange,
                  placeholder: "",
                  value: values.decimals,
                  required: true,
                  disableUnderline: true,
                  disabled: true,
                }}
                helperText={touched.decimals && errors.decimals}
                label="Token decimals"
              />
            </Grid>
            <Grid item xs={12}>
              <FormSelectField
                FormControlProps={{ fullWidth: true }}
                InputLabelProps={{ htmlFor: "toToken", shrink: true }}
                SelectProps={{
                  id: "toToken",
                  name: "toToken",
                  onBlur: handleBlur,
                  onChange: handleChange,
                  value: values.toToken,
                }}
                items={Object.keys(tokenIds).map((tokenId) => {
                  const token = getToken(
                    networkId || DEFAULT_NETWORK_ID,
                    tokenId as KnownToken
                  );
                  return {
                    value: token.address,
                    label: token.symbol,
                  };
                })}
                label="To token"
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
                Set swipe ration&nbsp;&nbsp;
                <ArrowRightIcon />
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
