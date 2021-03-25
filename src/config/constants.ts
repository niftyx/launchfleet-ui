import { BigNumber } from "@ethersproject/bignumber";
import { ReactComponent as DiscordIcon } from "assets/svgs/discord.svg";
import { ReactComponent as MediumIcon } from "assets/svgs/medium.svg";
import { ReactComponent as TelegramIcon } from "assets/svgs/telegram.svg";
import { ReactComponent as TwitterIcon } from "assets/svgs/twitter.svg";
import { ethers } from "ethers";
import { IPool, NetworkId } from "types";
import { ZERO_NUMBER } from "utils/number";
import { ZERO_ADDRESS } from "utils/token";

export const STORAGE_KEY_SETTINGS = "settings";
export const STORAGE_KEY_CONNECTOR = "CONNECTOR";
export const LOGGER_ID = "snowstorm";

export const TEST_MODE = Boolean(Number(process.env.REACT_APP_TEST || "1"));

export const DEFAULT_NETWORK_ID: NetworkId = TEST_MODE ? 43113 : 43114;

export const PRICE_DECIMALS = 18;
export const DEFAULT_DECIMALS = 18;
export const DEFAULT_USD = 0;

export const PAGE_ITEMS = BigNumber.from(5);

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

export const DEFAULT_READONLY_PROVIDER = new ethers.providers.JsonRpcProvider(
  NETWORK_CONFIG.params[0].rpcUrls[0],
  DEFAULT_NETWORK_ID
);

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
