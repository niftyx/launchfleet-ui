import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { NETWORK_CONFIG, STORAGE_KEY_CONNECTOR } from "config/constants";
import React, { useEffect, useState } from "react";
import { Maybe } from "types";
import { waitSeconds } from "utils";
import connectors from "utils/connectors";
import { ConnectorNames } from "utils/enums";
import { getLogger } from "utils/logger";

const logger = getLogger("useConnectedWeb3Context::");
export interface ConnectedWeb3Context {
  account: Maybe<string> | null;
  library: Web3Provider | undefined;
  networkId: number | undefined;
  rawWeb3Context: any;
  initialized: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ConnectedWeb3Context = React.createContext<Maybe<ConnectedWeb3Context>>(
  null
);

/**
 * This hook can only be used by components under the `ConnectedWeb3` component. Otherwise it will throw.
 */
export const useConnectedWeb3Context = () => {
  const context = React.useContext(ConnectedWeb3Context);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

/**
 * Component used to render components that depend on Web3 being available. These components can then
 * `useConnectedWeb3Context` safely to get web3 stuff without having to null check it.
 */
export const ConnectedWeb3: React.FC = (props) => {
  const context = useWeb3React<Web3Provider>();
  const {
    account,
    activate,
    active,
    chainId,
    deactivate,
    error,
    library,
  } = context;
  const [state, setState] = useState<{
    initialized: boolean;
  }>({
    initialized: false,
  });

  const setInitialized = (initialized: boolean) => {
    setState((prev) => ({ ...prev, initialized }));
  };
  const updateInitialized = () => {
    if (!state.initialized) setInitialized(true);
  };

  useEffect(() => {
    const connector = localStorage.getItem(STORAGE_KEY_CONNECTOR);
    if (error) {
      localStorage.removeItem(STORAGE_KEY_CONNECTOR);
      deactivate();
      updateInitialized();
    } else if (connector && Object.keys(connectors).includes(connector)) {
      if (!active) {
        activate(connectors[connector as ConnectorNames])
          .then(() => updateInitialized())
          .catch(() => updateInitialized());
      }
    } else {
      updateInitialized();
    }
    // eslint-disable-next-line
  }, [context, library, active, error]);

  const onConnect = async () => {
    try {
      await window.ethereum.request(NETWORK_CONFIG);
      await waitSeconds(1);
      const wallet = ConnectorNames.Injected;
      context.activate(connectors[wallet]);
      localStorage.setItem(STORAGE_KEY_CONNECTOR, wallet);
    } catch (error) {
      logger.error(error);
    }
  };

  const onDisconnect = () => {
    context.deactivate();
    localStorage.removeItem(STORAGE_KEY_CONNECTOR);
  };

  const value = {
    account: account || null,
    library,
    networkId: chainId,
    rawWeb3Context: context,
    initialized: state.initialized,
    onConnect,
    onDisconnect,
  };

  return (
    <ConnectedWeb3Context.Provider value={value}>
      {props.children}
    </ConnectedWeb3Context.Provider>
  );
};

export const WhenConnected: React.FC = (props) => {
  const { account } = useConnectedWeb3Context();

  return <>{account && props.children}</>;
};
