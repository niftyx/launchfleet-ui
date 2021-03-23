import { BigNumber } from "@ethersproject/bignumber";
import { ReactComponent as DiscordIcon } from "assets/svgs/discord.svg";
import { ReactComponent as MediumIcon } from "assets/svgs/medium.svg";
import { ReactComponent as TelegramIcon } from "assets/svgs/telegram.svg";
import { ReactComponent as TwitterIcon } from "assets/svgs/twitter.svg";
import { IPool } from "types";
import { ZERO_NUMBER } from "utils/number";
import { ZERO_ADDRESS } from "utils/token";

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

export const GUIDE_LINKS = [
  { label: "Support", href: "/support" },
  { label: "Docs", href: "/docs" },
  { label: "Terms & Privacy", href: "/terms-privacy" },
];

export const SOCIAL_LINKS = [
  { href: "/discord", icon: DiscordIcon },
  { href: "/medium", icon: MediumIcon },
  { href: "/telegram", icon: TelegramIcon },
  { href: "/twitter", icon: TwitterIcon },
];

export const MockUpcomingPools: IPool[] = [
  {
    token: "0xBFe7d8bc6c870d4710d5E9ac8DAbe0dc5659FF33",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1615894637"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("1610720692"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock1.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
  {
    token: "0xBFe7d8bc6c870d4710d5E9ac8DAbe0dc5659FF33",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1616983836"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("1610720692"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock2.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
  {
    token: "0xBFe7d8bc6c870d4710d5E9ac8DAbe0dc5659FF33",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1617883836"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("1610720692"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock1.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
  {
    token: "0xBFe7d8bc6c870d4710d5E9ac8DAbe0dc5659FF33",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1610721000"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("0"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock2.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
  {
    token: "0xBFe7d8bc6c870d4710d5E9ac8DAbe0dc5659FF33",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1610721000"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("1610720692"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock1.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
];

export const MockPools: IPool[] = [
  {
    token: "0xBFe7d8bc6c870d4710d5E9ac8DAbe0dc5659FF33",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1610721000"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("1610720692"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock1.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
  {
    token: "0xBFe7d8bc6c870d4710d5E9ac8DAbe0dc5659FF69",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1610721000"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("1610720692"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock2.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
  {
    token: "0xBFe7d8bc6c870d4710d5E9ac8DAbe0dc5659FF23",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1610721000"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("1610720692"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock1.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
  {
    token: "0xBFe7d8bc6c870d4710d5E9ac8DAbe0dc2659FF33",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1617883836"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("0"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock2.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
  {
    token: "0xBFe7d8bc6c870d4610d539ac8DAbe0dc5659FF33",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1617883836"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("1610720692"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock1.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
  {
    token: "0xBFe7d8bc6c870d4710d5E9ac8DAb70dc5659FF33",
    creator: "0x10f74f2B3F464353e73B9c651Ae10B9c4bbb4aB6",
    finishTime: BigNumber.from("1610721000"),
    rate: BigNumber.from("1714000000000000000000000"),
    pozRate: BigNumber.from("1714000000000000000000000"),
    mainCoin: ZERO_ADDRESS,
    startAmount: BigNumber.from("100000000000000000000000"),
    isLocked: false,
    leftTokens: BigNumber.from("100000000000000000000000"),
    startTime: BigNumber.from("1610720692"),
    openForAll: BigNumber.from("1610720692"),
    unlockedTokens: ZERO_NUMBER,
    tookLeftOvers: true,
    is21DecimalRate: true,
    img: "/imgs/mock2.png",
    tokenName: "Fractal Bot Ocean",
    tokenSymbol: "TBA",
  },
];
