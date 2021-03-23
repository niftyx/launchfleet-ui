import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  Input,
  InputLabelProps,
  InputProps,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  input: {
    marginTop: "12px !important",
    backgroundColor: theme.colors.default,
    fontSize: 14,
    color: theme.colors.secondary,
    padding: "12px 24px",
    borderRadius: 8,
    userSelect: "none",
    border: `2px solid ${theme.colors.transparent}`,
    transition: "all 0.4s",
  },
  inputFocused: {
    borderColor: theme.colors.primary,
  },
  label: {
    color: theme.colors.fourteen,
    fontSize: 12,
  },
}));

interface IProps {
  className?: string;
  FormControlProps: FormControlProps;
  InputLabelProps: InputLabelProps;
  InputProps: InputProps;
  FormHelperTextProps?: FormHelperTextProps;
  label?: string;
  helperText?: string | false | undefined;
}

export const FormTextField = (props: IProps) => {
  const { className, helperText } = props;
  const classes = useStyles();
  return (
    <FormControl
      className={clsx(classes.root, className)}
      {...props.FormControlProps}
    >
      {props.label && (
        <label
          className={classes.label}
          htmlFor={props.InputLabelProps.htmlFor}
        >
          {props.label}
        </label>
      )}
      <Input
        {...props.InputProps}
        className={clsx(classes.input, props.InputProps.className)}
        classes={{
          ...props.InputProps.classes,
          focused: clsx(
            classes.inputFocused,
            props.InputProps.classes?.focused
          ),
        }}
      />
      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
