import {
  IKnownTokenData,
  INetwork,
  IToken,
  KnownContracts,
  KnownToken,
  NetworkId,
} from "types";
import { ZERO_ADDRESS } from "utils/token";
import { entries } from "utils/type-utils";

export const networkIds = {
  AVAXTEST: 43113,
  AVAXMAIN: 43114,
} as const;

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.AVAXTEST]: {
    label: "AVAX TEST",
    url: "https://api.avax-test.network/ext/bc/C/rpc",
    contracts: {
      poolz: "0x04D9bD40D5E978d0bd0Ac948D9dBDe5352405319",
    },
    etherscanUri: "https://cchain.explorer.avax-test.network/",
  },
  [networkIds.AVAXMAIN]: {
    label: "AVAX Main",
    url: "https://api.avax.network/ext/bc/C/rpc",
    contracts: {
      poolz: "0x04D9bD40D5E978d0bd0Ac948D9dBDe5352405319",
    },
    etherscanUri: "https://cchain.explorer.avax.network/",
  },
};

export const supportedNetworkIds = Object.keys(networks).map(
  Number
) as NetworkId[];

export const tokenIds = {
  avax: "avax",
  eth: "eth",
  usdt: "usdt",
};

export const knownTokens: { [name in KnownToken]: IKnownTokenData } = {
  avax: {
    symbol: "AVAX",
    decimals: 18,
    name: "Avalanche",
    image:
      "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/ethereum-tokens/0x9dEbca6eA3af87Bf422Cea9ac955618ceb56EfB4/logo.png",
    addresses: {
      [networkIds.AVAXTEST]: ZERO_ADDRESS,
      [networkIds.AVAXMAIN]: ZERO_ADDRESS,
    },
    coingeckoTokenId: "avalanche-2",
  },
  eth: {
    symbol: "ETH",
    decimals: 18,
    name: "Ether (Wrapped)",
    image:
      "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15/logo.png",
    addresses: {
      [networkIds.AVAXTEST]: "0xc126c54E0f85cFe907D8444D740fF5e071C9CAD5",
      [networkIds.AVAXMAIN]: "0xf20d962a6c8f70c731bd838a3a388d7d48fa6e15",
    },
    coingeckoTokenId: "ethereum",
  },
  usdt: {
    symbol: "USDT",
    decimals: 18,
    name: "Tether USD",
    image:
      "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xde3A24028580884448a5397872046a019649b084/logo.png",
    addresses: {
      [networkIds.AVAXTEST]: "0x348eeeF3e45efDcc0d5A043C3909C28d03084F13",
      [networkIds.AVAXMAIN]: "0xde3a24028580884448a5397872046a019649b084",
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
