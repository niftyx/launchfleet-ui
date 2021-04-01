import {
  FormHelperText,
  FormHelperTextProps,
  Input,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_DECIMALS } from "config/constants";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { ZERO_NUMBER } from "utils/number";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.colors.default,
    fontSize: 14,
    color: theme.colors.secondary,
    padding: "12px 24px",
    borderRadius: 8,
    userSelect: "none",
    border: `2px solid ${theme.colors.transparent}`,
    transition: "all 0.4s",
  },
  prefix: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 16,
    },
  },
  max: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.sixth,
    borderRadius: 8,
    height: 24,
    width: 50,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: "10px",
    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": {
      opacity: 0.7,
    },
  },
  inputFocused: {
    borderColor: theme.colors.primary,
  },
}));

interface IProps {
  className?: string;
  amount: BigNumber;
  maxVisible?: boolean;
  onMax: () => void;
  onChangeValue: (_: BigNumber) => void;
  FormHelperTextProps?: FormHelperTextProps;
  helperText?: string | false | undefined;
  error?: boolean;
}

export const TokenInput = (props: IProps) => {
  const {
    amount,
    error = false,
    helperText,
    maxVisible = false,
    onChangeValue,
    onMax,
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
    const { value: inputValue } = e.target;
    if (!inputValue) {
      onChangeValue(ZERO_NUMBER);
    } else {
      const newValue = ethers.utils.parseUnits(inputValue, DEFAULT_DECIMALS);
      onChangeValue(newValue);
    }
    setCurrentValue(() => inputValue);
  };

  return (
    <>
      <Input
        className={clsx(classes.root, props.className)}
        classes={{ focused: classes.inputFocused }}
        disableUnderline
        endAdornment={
          maxVisible && (
            <InputAdornment position="end">
              <div className={classes.prefix}>
                {maxVisible && (
                  <div className={classes.max} onClick={onMax}>
                    MAX
                  </div>
                )}
              </div>
            </InputAdornment>
          )
        }
        error={error}
        onChange={onChangeAmount}
        placeholder="0.00"
        type="number"
        value={currentValue}
      />
      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </>
  );
};
