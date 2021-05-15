import { knownTokens } from "config/networks";
import { BigNumber } from "ethers";
import { EPoolStatus, EPoolType } from "utils/enums";

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

export type KnownToken = "matic" | "usdt" | "wmatic" | "launch";

export interface INetwork {
  label: string;
  url: string;
  contracts: {
    factory: string;
  };
  thegraph: {
    httpUri: string;
    wsUri: string;
  };
  etherscanUri: string;
}

export type NetworkId = 137 | 80001;

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
  price: {
    [key in KnownToken]: {
      usd: number;
      price: BigNumber;
      decimals: number;
    };
  };
  ethBalance: BigNumber;
  txModalData: {
    visible: boolean;
    title: string;
    instruction: string;
    txId: string;
  };
  baseTokenInfo: {
    address: string;
    amount: BigNumber;
  };
}

export interface IBasePool {
  token: string; //token to sell address
  tokenSymbol: string;
  tokenDecimals: number;
  tokenName: string;
  tokenTarget: BigNumber;
  multiplier: BigNumber;
  weiToken: string; // address(0x0) = ETH, address of main token
  minWei: BigNumber;
  maxWei: BigNumber;
  poolType: EPoolType;
  startTime: BigNumber;
  endTime: BigNumber;
  claimTime: BigNumber;

  logo: string;
  name: string;
  description: string;

  meta: string;
}

export interface IPool {
  poolId: string;

  creator: string;
  token: string;
  tokenTarget: BigNumber;
  multiplier: BigNumber;
  weiToken: string; // address(0x0) = ETH, address of main token
  minWei: BigNumber;
  maxWei: BigNumber;
  poolType: EPoolType;
  startTime: BigNumber;
  endTime: BigNumber;
  claimTime: BigNumber;
  meta: string;

  logo: string;
  //
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenTotalSupply: BigNumber;
  //
  totalMembers: BigNumber;
}

export interface IPoolHistory {
  id: string;
  txHash: string;
  status: EPoolStatus;
  timestamp: number;
  pool?: IPool;
}

export interface IInvestor {
  id: string;
  address: string;
  createTimeStamp: number;
  updateTimeStamp: number;
  history?: IInvestHistory[];
  pools?: IPool[];
}

export interface IInvestHistory {
  id: string;
  txHash: string;
  amount: BigNumber;
  timestamp: number;
  investorId: BigNumber;
  investor?: IInvestor;
  pool?: IPool;
}
