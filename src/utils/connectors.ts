import { InjectedConnector } from "@web3-react/injected-connector";
import { supportedNetworkIds } from "config/networks";

const injected = new InjectedConnector({
  supportedChainIds: supportedNetworkIds,
});

export default {
  injected,
};
