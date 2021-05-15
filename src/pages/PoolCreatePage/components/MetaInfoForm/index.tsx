import { Button, Grid, makeStyles } from "@material-ui/core";
import { ReactComponent as ArrowRightIcon } from "assets/svgs/arrow-right.svg";
import clsx from "clsx";
import { FormLogoUpload, FormTextField } from "components";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { getIPFSService } from "services/ipfs";
import { IBasePool } from "types";
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
  logo: string;
  name: string;
  description: string;
}

interface IState {
  loading: boolean;
  logoUploading: boolean;
}

export const MetaInfoForm = (props: IProps) => {
  const classes = useStyles();
  const { basePool, onNext } = props;
  const [state, setState] = useState<IState>({
    loading: false,
    logoUploading: false,
  });

  const renderForm = () => {
    const initialFormValues: IFormValues = {
      logo: basePool.logo,
      name: basePool.name,
      description: basePool.description,
    };
    const ipfsService = getIPFSService();

    return (
      <Formik
        initialValues={initialFormValues}
        onSubmit={(values, { setFieldError }) => {
          const payloadValues = { ...values };

          onNext(payloadValues);
        }}
        validationSchema={Yup.object().shape({
          logo: Yup.string().required(),
          name: Yup.string().required(),
          description: Yup.string().required(),
        })}
      >
        {({
          errors,
          handleBlur,
          handleChange,
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
              <Grid item sm={6} xs={12}>
                <FormLogoUpload
                  FormControlProps={{ fullWidth: true }}
                  InputProps={{
                    onChange: async (newFile: File | null) => {
                      if (newFile) {
                        try {
                          setState((prev) => ({
                            ...prev,
                            logoUploading: true,
                          }));
                          const logoUrl = await ipfsService.uploadData(newFile);
                          setState((prev) => ({
                            ...prev,
                            logoUploading: false,
                          }));
                          setFieldValue("logo", logoUrl);
                        } catch (error) {
                          console.error(error);
                          setState((prev) => ({
                            ...prev,
                            logoUploading: false,
                          }));
                        }
                      }
                    },
                    id: "logo",
                    name: "logo",
                    value: null,
                    onBlur: handleBlur,
                  }}
                  imageUrl={values.logo}
                  loading={state.logoUploading}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormTextField
                  FormControlProps={{ fullWidth: true }}
                  FormHelperTextProps={{
                    error: Boolean(touched.name && errors.name),
                  }}
                  InputLabelProps={{
                    htmlFor: "name",
                    shrink: true,
                  }}
                  InputProps={{
                    id: "name",
                    name: "name",
                    onBlur: handleBlur,
                    onChange: handleChange,
                    placeholder: "",
                    value: values.name,
                    required: true,
                    disableUnderline: true,
                  }}
                  helperText={touched["name"] && errors["name"]}
                  label="Pool Name"
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  FormControlProps={{ fullWidth: true }}
                  FormHelperTextProps={{
                    error: Boolean(touched.description && errors.description),
                  }}
                  InputLabelProps={{
                    htmlFor: "description",
                    shrink: true,
                  }}
                  InputProps={{
                    id: "description",
                    name: "description",
                    onBlur: handleBlur,
                    onChange: handleChange,
                    placeholder: "",
                    value: values.description,
                    required: true,
                    disableUnderline: true,
                    multiline: true,
                  }}
                  helperText={touched["description"] && errors["description"]}
                  label="Pool Description"
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
  return renderForm();
};
