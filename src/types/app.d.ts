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
}

export interface IBasePool {
  token: string; //token to sell address
  tokenSymbol: string;
  tokenDecimals: number;
  tokenName: string;
  auctionFinishTimestamp: BigNumber; //Until what time the pool will work
  expectedRate: BigNumber; //the rate of the trade
  pozRate: BigNumber; //the rate for POZ Holders, how much each token = main coin
  startAmount: BigNumber; //Total amount of the tokens to sell in the pool
  lockedUntil: number; //False = DSP or True = TLP
  mainCoin: string; // address(0x0) = ETH, address of main token
  is21Decimal: boolean; //focus the for smaller tokens.
  now: BigNumber; // start time
  whitelistId: BigNumber; // the Id of the Whitelist contract, 0 For turn-off
}

export interface IPool {
  token: string;
  creator: string;
  finishTime: BigNumber;
  rate: BigNumber;
  pozRate: BigNumber;
  mainCoin: string;
  startAmount: BigNumber;
  isLocked: boolean;
  leftTokens: BigNumber;
  startTime: BigNumber;
  openForAll: BigNumber;
  unlockedTokens: BigNumber;
  tookLeftOvers: boolean;
  is21DecimalRate: boolean;
  img?: string;
  tokenName: string;
  tokenSymbol: string;
}
