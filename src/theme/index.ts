import { colors, createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import _ from "lodash";
import { ISettings } from "types";
import { THEME } from "utils/enums";

import CustomColors from "./colors";
import custom from "./custom";
import { softShadows, strongShadows } from "./shadows";
import typography from "./typography";

const baseOptions = {
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: "hidden",
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: "rgba(0,0,0,0.075)",
      },
    },
  },
};

const themesOptions = [
  {
    name: THEME.Black,
    overrides: {
      MuiInputBase: {
        input: {
          "&::placeholder": {
            opacity: 1,
            color: colors.blueGrey[600],
          },
        },
      },
      MuiButton: {
        root: {
          padding: "12px 16px",
          borderRadius: "16px",
          fontWeight: 300,
          textTransform: "none",
        },
        containedPrimary: {
          backgroundColor: "#016ACF",
          color: "#fff",
        },
        containedSecondary: {
          color: "#016ACF",
        },
      },
    },
    palette: {
      type: "dark",
      action: {
        active: "rgba(255, 255, 255, 0.54)",
        hover: "#016ACFaa",
        selected: "rgba(255, 255, 255, 0.08)",
        disabled: "rgba(255, 255, 255, 0.26)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
        focus: "rgba(255, 255, 255, 0.12)",
      },
      background: {
        default: "#000",
        dark: "#1c2025",
        paper: "#282C34",
      },
      primary: {
        main: "#ff3465",
      },
      secondary: {
        main: "#ffeaef",
      },
      text: {
        primary: "#fff",
        secondary: "#ff3465",
      },
    },
    shadows: strongShadows,
  },
  {
    name: THEME.White,
    overrides: {
      MuiInputBase: {
        input: {
          "&::placeholder": {
            opacity: 1,
            color: colors.blueGrey[600],
          },
        },
      },
      MuiButton: {
        root: {
          padding: "12px 16px",
          borderRadius: "16px",
          fontWeight: 300,
          textTransform: "none",
        },
        containedPrimary: {
          backgroundColor: "#016ACF",
          color: "#fff",
        },
        containedSecondary: {
          color: "#016ACF",
        },
      },
    },
    palette: {
      type: "light",
      action: {
        active: "rgba(255, 255, 255, 0.54)",
        hover: "#016ACFaa",
        selected: "rgba(255, 255, 255, 0.08)",
        disabled: "rgba(255, 255, 255, 0.26)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
        focus: "rgba(255, 255, 255, 0.12)",
      },
      background: {
        default: "#fff",
        dark: "#212121",
        paper: "#ffeaef",
        light: "#016ACF",
      },
      primary: {
        main: "#1A202E",
      },
      secondary: {
        main: "#fff",
      },
      text: {
        primary: "#000",
        secondary: "#1A202E",
      },
    },
    shadows: softShadows,
  },
];

export const createTheme = (config: ISettings) => {
  let themeOptions = themesOptions.find((theme) => theme.name === config.theme);
  let customColor = CustomColors.find(
    (element) => element.name === config.theme
  );

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [themeOptions] = themesOptions;
  }
  if (!customColor) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [customColor] = CustomColors;
  }

  let theme = createMuiTheme(
    _.merge({}, baseOptions, themeOptions, { custom }, customColor) as any
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
