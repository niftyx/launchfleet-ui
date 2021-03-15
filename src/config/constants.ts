export const STORAGE_KEY_SETTINGS = "settings";
export const STORAGE_KEY_CONNECTOR = "CONNECTOR";
export const LOGGER_ID = "snowstorm";

export const TEST_MODE = Boolean(Number(process.env.REACT_APP_TEST || "1"));

export const DEFAULT_NETWORK_ID = 43113;

export const PRICE_DECIMALS = 18;
export const DEFAULT_DECIMALS = 18;
export const DEFAULT_USD = 0;

export const NETWORK_CONFIG = TEST_MODE
  ? {
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xa869",
          chainName: "Fuji Testnet",
          nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18,
          },
          rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://cchain.explorer.avax-test.network/"],
        },
      ],
    }
  : {
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xa86a",
          chainName: "Avalanche Mainnet",
          nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18,
          },
          rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
        },
      ],
    };
