import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  InputLabelProps,
  MenuItem,
  Select,
  SelectProps,
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
    padding: "8px 4px",
    borderRadius: 8,
    userSelect: "none",
    border: `2px solid ${theme.colors.transparent}`,
    transition: "all 0.4s",
    "& svg": {
      color: theme.colors.secondary,
    },
  },
  label: {
    color: theme.colors.fourteen,
    fontSize: 12,
  },
  select: { padding: "8px 20px" },
  icon: {
    right: 16,
  },
}));

interface IProps {
  className?: string;
  FormControlProps: FormControlProps;
  InputLabelProps: InputLabelProps;
  SelectProps: SelectProps;
  items: { value: string; label: string }[];
  FormHelperTextProps?: FormHelperTextProps;
  label?: string;
  helperText?: string | false | undefined;
}

export const FormSelectField = (props: IProps) => {
  const { className, helperText, items } = props;
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
      <Select
        {...props.SelectProps}
        className={clsx(classes.input, props.SelectProps.className)}
        classes={{
          ...props.SelectProps.classes,
          icon: classes.icon,
          select: classes.select,
        }}
        disableUnderline
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
