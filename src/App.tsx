import { Web3Provider } from "@ethersproject/providers";
import { ThemeProvider } from "@material-ui/styles";
import { Web3ReactProvider } from "@web3-react/core";
import {
  ApolloProviderWrapper,
  ConnectedWeb3,
  GlobalProvider,
  useSettings,
} from "contexts";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import routes, { renderRoutes } from "routes";
import { createTheme } from "theme";

import "./App.css";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const { settings } = useSettings();
  const theme = createTheme(settings);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={3000}
        maxSnack={3}
      >
        <Web3ReactProvider getLibrary={getLibrary}>
          <ConnectedWeb3>
            <ApolloProviderWrapper>
              <GlobalProvider>
                <BrowserRouter>{renderRoutes(routes as any)}</BrowserRouter>
              </GlobalProvider>
            </ApolloProviderWrapper>
          </ConnectedWeb3>
        </Web3ReactProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
