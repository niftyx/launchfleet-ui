import { BigNumber } from "@ethersproject/bignumber";
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  Input,
  InputLabelProps,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_DECIMALS } from "config/constants";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { ZERO_NUMBER } from "utils/number";

const useStyles = makeStyles((theme) => ({
  root: {},
  inputRow: {
    display: "flex",
    alignItems: "center",
    marginTop: "12px !important",
  },
  inputLeft: {
    backgroundColor: theme.colors.default,
    fontSize: 14,
    color: theme.colors.third,
    padding: "18px 24px",
    borderRadius: 8,
    userSelect: "none",
    minWidth: "unset",
    maxWidth: 115,
    border: `2px solid ${theme.colors.transparent}`,
  },
  input: {
    flex: 1,
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
  equal: {
    margin: "0 16px",
  },
}));

interface IProps {
  className?: string;
  FormControlProps: FormControlProps;
  InputLabelProps: InputLabelProps;
  FormHelperTextProps?: FormHelperTextProps;
  label?: string;
  integerOnly?: boolean;
  helperText?: string | false | undefined;
  tokenSymbol: string;
  value: BigNumber;
  onChange: (_: BigNumber) => void;
}

export const FormRatioField = (props: IProps) => {
  const {
    className,
    helperText,
    integerOnly = false,
    onChange: onChangeValue,
    tokenSymbol,
    value: amount,
  } = props;
  const classes = useStyles();
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    if (amount.eq(ZERO_NUMBER)) {
      // setCurrentValue(() => "");
    } else if (
      !ethers.utils.parseUnits(currentValue || "0", DEFAULT_DECIMALS).eq(amount)
    ) {
      setCurrentValue(() => ethers.utils.formatUnits(amount, DEFAULT_DECIMALS));
    }
    // eslint-disable-next-line
  }, [amount, currentValue]);

  const onChangeAmount = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value } = e.target;
    const inputValue =
      integerOnly && value ? parseInt(value).toFixed(0) : value;
    if (!inputValue) {
      onChangeValue(ZERO_NUMBER);
    } else {
      const newValue = ethers.utils.parseUnits(inputValue, DEFAULT_DECIMALS);
      onChangeValue(newValue);
    }
    setCurrentValue(() => inputValue);
  };

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
      <div className={classes.inputRow}>
        <input
          className={clsx(classes.inputLeft)}
          disabled
          value={`1 ${tokenSymbol.toUpperCase()}`}
        />
        <Typography className={classes.equal}>=</Typography>
        <Input
          className={clsx(classes.input)}
          classes={{
            focused: clsx(classes.inputFocused),
          }}
          disableUnderline
          id={props.InputLabelProps.htmlFor}
          onChange={onChangeAmount}
          placeholder="0.00"
          type="number"
          value={currentValue}
        />
      </div>

      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
