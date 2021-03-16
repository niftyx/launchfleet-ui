import { makeStyles } from "@material-ui/core";
import { transparentize } from "polished";

const useCommonStyles = makeStyles((theme) => ({
  scroll: {
    "&::-webkit-scrollbar": {
      width: theme.spacing(0.5),
      boxShadow: theme.colors.boxShadow1,
    },
    "&::-webkit-scrollbar-track": {},
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: transparentize(0.3, theme.colors.primary),
    },
  },
  scrollHorizontal: {
    "&::-webkit-scrollbar": {
      height: theme.spacing(0.25),
      boxShadow: theme.colors.boxShadow1,
    },
    "&::-webkit-scrollbar-track": {},
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colors.primary,
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
  maxHeightTransition: {
    overflow: "hidden",
    maxHeight: 0,
    transition: "max-height 0.5s cubic-bezier(0, 1, 0, 1)",
    "&.visible": {
      maxHeight: 2000,
      transition: "max-height 1s ease-in-out",
    },
  },
  hideOnMobile: {
    [theme.breakpoints.down("xs")]: {
      display: "none !important",
    },
  },
  hideOnPad: {
    [theme.breakpoints.down(theme.custom.padWidth)]: {
      display: "none !important",
    },
  },
  hideUpPad: {
    [theme.breakpoints.up(theme.custom.padWidth)]: {
      display: "none !important",
    },
  },
  wrapper: {
    padding: "16px 24px",
  },
  pageContent: {
    maxWidth: theme.custom.appContentMaxWidth,
    margin: "auto",
  },
}));

export default useCommonStyles;
