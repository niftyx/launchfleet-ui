import {
  IKnownTokenData,
  INetwork,
  IToken,
  KnownContracts,
  KnownToken,
  NetworkId,
} from "types";
import { NULL_ADDRESS } from "utils/token";
import { entries } from "utils/type-utils";

export const networkIds = {
  MATIC: 137,
  MUMBAI: 80001,
} as const;

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.MUMBAI]: {
    label: "Mumbai Testnet",
    url: "https://rpc-mumbai.maticvigil.com/",
    contracts: {
      factory: "0xbbc9246EDB0f5942C847bD5eE728d5325063F310",
    },
    etherscanUri: "https://mumbai-explorer.matic.today/",
    thegraph: {
      httpUri: "https://api.thegraph.com/subgraphs/name/altbee/launch-test",
      wsUri: "wss://api.thegraph.com/subgraphs/name/altbee/launch-test",
    },
  },
  [networkIds.MATIC]: {
    label: "Matic Mainnet",
    url: "https://rpc-mainnet.maticvigil.com/",
    contracts: {
      factory: "0xbbc9246EDB0f5942C847bD5eE728d5325063F310",
    },
    etherscanUri: "https://explorer.matic.network/",
    thegraph: {
      httpUri: "https://api.thegraph.com/subgraphs/name/altbee/launch-test",
      wsUri: "wss://api.thegraph.com/subgraphs/name/altbee/launch-test",
    },
  },
};

export const supportedNetworkIds = Object.keys(networks).map(
  Number
) as NetworkId[];

export const tokenIds = {
  matic: "matic",
  wmatic: "wmatic",
  usdt: "usdt",
};

export const knownTokens: { [name in KnownToken]: IKnownTokenData } = {
  matic: {
    symbol: "MATIC",
    decimals: 18,
    name: "Polygon",
    image:
      "https://github.com/trustwallet/assets/blob/master/blockchains/polygon/info/logo.png",
    addresses: {
      [networkIds.MUMBAI]: NULL_ADDRESS,
      [networkIds.MATIC]: NULL_ADDRESS,
    },
    coingeckoTokenId: "matic-network",
  },
  wmatic: {
    symbol: "WMATIC",
    decimals: 18,
    name: "Wrapped Matic",
    image:
      "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png",
    addresses: {
      [networkIds.MUMBAI]: "0x8377da69E99e6DB975fCa7677C2f07C5792a4acc",
      [networkIds.MATIC]: "0x8377da69E99e6DB975fCa7677C2f07C5792a4acc",
    },
    coingeckoTokenId: "wmatic",
  },
  usdt: {
    symbol: "USDT",
    decimals: 18,
    name: "Tether USD",
    image:
      "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xde3A24028580884448a5397872046a019649b084/logo.png",
    addresses: {
      [networkIds.MUMBAI]: "0xd7a65c9B81Fec5F73E8eC1996B1c541cC059b0F3",
      [networkIds.MATIC]: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    },
    coingeckoTokenId: "tether",
  },
  launch: {
    symbol: "LAUNCH",
    decimals: 18,
    name: "LAUNCH TOKEN",
    image:
      "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xde3A24028580884448a5397872046a019649b084/logo.png",
    addresses: {
      [networkIds.MUMBAI]: "0x496BF10c5D16590e0Fc0feC10f28d7C2B67768C8",
      [networkIds.MATIC]: "0x496BF10c5D16590e0Fc0feC10f28d7C2B67768C8",
    },
    coingeckoTokenId: "tether",
  },
};

export const supportedNetworkURLs = entries(networks).reduce<{
  [networkId: number]: string;
}>(
  (acc, [networkId, network]) => ({
    ...acc,
    [networkId]: network.url,
  }),
  {}
);

const validNetworkId = (networkId: number): networkId is NetworkId => {
  return networks[networkId as NetworkId] !== undefined;
};

export const getContractAddress = (
  networkId: number,
  contract: KnownContracts
): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }
  return networks[networkId].contracts[contract];
};

export const getToken = (networkId: number, tokenId: KnownToken): IToken => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  const token = knownTokens[tokenId];
  if (!token) {
    throw new Error(`Unsupported token id: '${tokenId}'`);
  }

  const address = token.addresses[networkId];

  if (!address) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  return {
    address,
    decimals: token.decimals,
    symbol: token.symbol,
    image: token.image,
    name: token.name,
    coingeckoTokenId: token.coingeckoTokenId,
  };
};

export const getTokenFromAddress = (
  networkId: number,
  address: string
): IToken => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  for (const token of Object.values(knownTokens)) {
    const tokenAddress = token.addresses[networkId];

    // token might not be supported in the current network
    if (!tokenAddress) {
      continue;
    }

    if (tokenAddress.toLowerCase() === address.toLowerCase()) {
      return {
        address: tokenAddress,
        decimals: token.decimals,
        symbol: token.symbol,
        image: token.image,
        name: token.name,
        coingeckoTokenId: token.coingeckoTokenId,
      };
    }
  }

  throw new Error(
    `Couldn't find token with address '${address}' in network '${networkId}'`
  );
};

export const getContractAddressName = (networkId: number) => {
  const networkName = Object.keys(networkIds).find(
    (key) => (networkIds as any)[key] === networkId
  );
  const networkNameCase =
    networkName &&
    networkName.substr(0, 1).toUpperCase() +
      networkName.substr(1).toLowerCase();
  return networkNameCase;
};

export const getEtherscanUri = (networkId: number): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  return networks[networkId].etherscanUri;
};

export const getGraphUris = (
  networkId: number
): { httpUri: string; wsUri: string } => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  return networks[networkId].thegraph;
};
