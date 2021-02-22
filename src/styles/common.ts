import { makeStyles } from "@material-ui/core";
import { transparentize } from "polished";

const useCommonStyles = makeStyles((theme) => ({
  scroll: {
    "&::-webkit-scrollbar": {
      width: theme.spacing(0.5),
      boxShadow: `inset 0 0 6px ${transparentize(0.3, theme.colors.fourth)}`,
    },
    "&::-webkit-scrollbar-track": {},
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colors.fourth,
    },
  },
  scrollHorizontal: {
    "&::-webkit-scrollbar": {
      height: theme.spacing(0.25),
      boxShadow: `inset 0 0 6px ${transparentize(0.3, theme.colors.fourth)}`,
    },
    "&::-webkit-scrollbar-track": {},
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colors.fourth,
    },
  },
  transparentButton: {
    backgroundColor: transparentize(0.9, theme.colors.default),
    borderRadius: theme.spacing(0.75),
    color: theme.colors.default,
    "&:hover": {
      backgroundColor: transparentize(0.5, theme.colors.default),
    },
  },
  textAlignRight: {
    textAlign: "right",
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
  fadeAnimation: {
    transition: "all 1s",
    opacity: 0,
    "&.visible": {
      opacity: 1,
    },
  },
  hideBelowWide: {
    [theme.breakpoints.down("sm")]: {
      display: "none !important",
    },
  },
  showBelowWide: {
    [theme.breakpoints.up("md")]: {
      display: "none !important",
    },
  },
  maxHeightTransition: {
    overflow: "hidden",
    maxHeight: 0,
    transition: "max-height 0.5s cubic-bezier(0, 1, 0, 1)",
    "&.visible": {
      maxHeight: 2000,
      transition: "max-height 1s ease-in-out",
    },
  },
}));

export default useCommonStyles;
