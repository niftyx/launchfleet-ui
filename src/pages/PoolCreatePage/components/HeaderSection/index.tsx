import { Typography, makeStyles } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { ECreatePoolStep } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  left: {},
  leftWrapper: {
    display: "flex",
    alignItems: "center",
  },
  leftItem: {
    display: "flex",
    alignItems: "center",
    color: theme.colors.secondary,
    fontSize: 24,

    "& + &": {
      marginLeft: 20,
    },
    "& svg": {
      color: transparentize(0.3, theme.colors.eighth),
    },
  },
  leftIcon: {
    color: theme.colors.secondary,
    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": {
      opacity: 0.7,
    },
  },
  progressWrapper: {
    width: 120,
  },
  progressbar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: transparentize(0.5, theme.colors.sixth),
    position: "relative",
  },
  progress: {
    height: 7,
    borderRadius: 3,
    overflow: "hidden",
    transition: "all 0.3s",
  },
  progressBg: {
    background: theme.colors.gradient1,
    height: 8,
    borderRadius: 4,
    "&.filled": {
      background: "none",
      backgroundColor: theme.colors.tenth,
    },
  },
  progressText: {
    color: theme.colors.primary,
    fontWeight: 600,
    fontSize: 12,
    marginTop: 10,
  },
}));

interface IProps {
  className?: string;
  step: ECreatePoolStep;
  setStep: (_: ECreatePoolStep) => void;
}

export const HeaderSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { setStep, step } = props;
  const stepValues = Object.values(ECreatePoolStep);
  const stepIndex = stepValues.indexOf(step);
  const percent = (100 * (stepIndex + 1)) / (stepValues.length - 1);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.left}>
        <div className={clsx(classes.leftWrapper, commonClasses.hideOnPad)}>
          {stepValues.map((stepValue, index) => {
            if (index > stepIndex) return null;
            if (index === 0) {
              return (
                <Typography className={classes.leftItem} key={stepValue}>
                  {stepValue}
                </Typography>
              );
            }
            return (
              <div className={classes.leftItem} key={stepValue}>
                <ChevronRightIcon
                  className={classes.leftIcon}
                  onClick={() => setStep(stepValues[stepIndex - 1])}
                />
                <Typography className={classes.leftItem}>
                  {stepValue}
                </Typography>
              </div>
            );
          })}
        </div>
        <div className={clsx(classes.leftWrapper, commonClasses.hideUpPad)}>
          {stepIndex > 0 && (
            <ChevronLeftIcon
              className={classes.leftIcon}
              onClick={() => setStep(stepValues[stepIndex - 1])}
            />
          )}
          <Typography>{step}</Typography>
        </div>
      </div>
      <div className={classes.progressWrapper}>
        <div className={classes.progressbar}>
          <div
            className={clsx(classes.progress)}
            style={{ width: `${percent}%` }}
          >
            <div
              className={clsx(
                classes.progressBg,
                (percent & 2) === 1 ? "filled" : ""
              )}
            ></div>
          </div>
        </div>
        <Typography className={classes.progressText} color="primary">
          Step {stepIndex + 1} of 3
        </Typography>
      </div>
    </div>
  );
};
