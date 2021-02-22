import { knownTokens } from "config/networks";
import { BigNumber } from "ethers";

export interface ISettings {
  theme: THEME;
  responsiveFontSizes: boolean;
}

export interface IToken {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  image?: string;
  coingeckoTokenId: string;
}

export type Maybe<T> = T | null;

export type KnownToken = "avax" | "usdt" | "eth";

export interface INetwork {
  label: string;
  url: string;
  contracts: {
    poolz: string;
  };
  etherscanUri: string;
}

export type NetworkId = 43113 | 43114;

export type KnownContracts = keyof INetwork["contracts"];

export interface IKnownTokenData {
  symbol: string;
  decimals: number;
  image: string;
  name: string;
  addresses: {
    [K in NetworkId]?: string;
  };
  coingeckoTokenId: string;
}

export interface IGlobalData {
  itemCartIds: string[];
  inventoryCartIds: string[];
  price: {
    [key in KnownToken]: {
      usd: number;
      price: BigNumber;
      decimals: number;
    };
  };
  ethBalance: BigNumber;
}
