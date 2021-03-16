import {
  InputAdornment,
  TextField,
  TextFieldProps,
  makeStyles,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: transparentize(0.7, theme.colors.third),
    height: 44,
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
  },
  icon: {
    color: theme.colors.secondary,
    width: 18,
    height: 18,
  },
}));

export const SearchBar = (props: TextFieldProps) => {
  const classes = useStyles();

  return (
    <TextField
      {...props}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon className={classes.icon} />
          </InputAdornment>
        ),
      }}
      className={clsx(props.className, classes.root)}
      fullWidth
    />
  );
};
