import {
  Input,
  InputAdornment,
  InputProps,
  makeStyles,
} from "@material-ui/core";
import { ReactComponent as SearchSvg } from "assets/svgs/search_outline.svg";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: transparentize(0.75, theme.colors.sixth),
    height: 44,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    "& input": {
      color: theme.colors.third,
      fontSize: 14,
      "&::placeholder": {
        color: theme.colors.third,
      },
      "&:-ms-input-placeholder": {
        color: theme.colors.third,
      },
      "&::-ms-input-placeholder": {
        color: theme.colors.third,
      },
    },
  },
  icon: {
    color: theme.colors.secondary,
    width: 18,
    height: 18,
  },
}));

export const SearchBar = (props: InputProps) => {
  const classes = useStyles();

  return (
    <Input
      {...props}
      className={clsx(props.className, classes.root)}
      disableUnderline
      fullWidth
      placeholder="Search by pool ID, pool name, token contract"
      startAdornment={
        <InputAdornment position="start">
          <SearchSvg className={classes.icon} />
        </InputAdornment>
      }
    />
  );
};
