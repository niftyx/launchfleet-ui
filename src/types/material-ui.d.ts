import { Theme } from "@material-ui/core/styles/createMuiTheme";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    custom: {
      appHeaderDesktopHeight: React.CSSProperties["height"];
      appHeaderMobileHeight: React.CSSProperties["height"];
      appContentMaxWidth: React.CSSProperties["width"];
      padWidth: number;
    };
    colors: {
      transparent: string;
      default: string;
      opposite: string;
      primary: string;
      secondary: string;
      third: string;
      fourth: string;
      fifth: string;
      sixth: string;
      seventh: string;
      eighth: string;
      ninth: string;
      tenth: string;
      eleventh: string;
      twelfth: string;
      thirteen: string;
      fourteen: string;
      warn: string;
      gradient1: string;
      gradient2: string;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderDesktopHeight: React.CSSProperties["height"];
      appHeaderMobileHeight: React.CSSProperties["height"];
      appContentMaxWidth: React.CSSProperties["width"];
      padWidth: number;
    };
    colors: {
      transparent: string;
      default: string;
      opposite: string;
      primary: string;
      secondary: string;
      third: string;
      fourth: string;
      fifth: string;
      sixth: string;
      seventh: string;
      eighth: string;
      ninth: string;
      tenth: string;
      eleventh: string;
      twelfth: string;
      thirteen: string;
      fourteen: string;
      warn: string;
      gradient1: string;
      gradient2: string;
    };
  }
}
