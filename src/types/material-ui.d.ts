import { Theme } from "@material-ui/core/styles/createMuiTheme";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    custom: {
      appHeaderDesktopHeight: React.CSSProperties["height"];
      appHeaderMobileHeight: React.CSSProperties["height"];
      appContentMaxWidth: React.CSSProperties["width"];
    };
    colors: {
      transparent: string;
      default: string;
      primary: string;
      secondary: string;
      third: string;
      fourth: string;
      opposite: string;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderDesktopHeight: React.CSSProperties["height"];
      appHeaderMobileHeight: React.CSSProperties["height"];
      appContentMaxWidth: React.CSSProperties["width"];
    };
    colors: {
      transparent: string;
      default: string;
      primary: string;
      secondary: string;
      third: string;
      fourth: string;
      opposite: string;
    };
  }
}
