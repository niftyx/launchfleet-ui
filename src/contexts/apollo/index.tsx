import { ApolloProvider } from "@apollo/react-hooks";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context } from "contexts/connectedWeb3";
import React from "react";

import { getApolloClient } from "../../apolloClientConfig";

export const ApolloProviderWrapper: React.FC = ({ children }) => {
  const { networkId } = useConnectedWeb3Context();
  const client = React.useMemo(
    () => getApolloClient(networkId || DEFAULT_NETWORK_ID),
    [networkId]
  );

  return <ApolloProvider client={client as any}>{children}</ApolloProvider>;
};
