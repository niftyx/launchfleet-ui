import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { ReactComponent as DiscordIcon } from "assets/svgs/discord.svg";
import { ReactComponent as MediumIcon } from "assets/svgs/medium.svg";
import { ReactComponent as TelegramIcon } from "assets/svgs/telegram.svg";
import { ReactComponent as TwitterIcon } from "assets/svgs/twitter.svg";
import { ethers } from "ethers";
import { NetworkId } from "types";

export const STORAGE_KEY_SETTINGS = "settings";
export const STORAGE_KEY_CONNECTOR = "CONNECTOR";
export const LOGGER_ID = "snowstorm";

export const TEST_MODE = Boolean(Number(process.env.REACT_APP_TEST || "1"));

export const DEFAULT_NETWORK_ID: NetworkId = TEST_MODE ? 80001 : 137;

export const API_RPS = 10;
export const PRICE_DECIMALS = 18;
export const DEFAULT_DECIMALS = 18;
export const DEFAULT_USD = 0;
export const DEFAULT_INTERVAL = 30;

export const PAGE_ITEMS = BigNumber.from(5);
export const MIN_CALC_TOKENS = parseEther("10");

export const DEFAULT_MIN_WEI = parseEther("0.1");
export const DEFAULT_MAX_WEI = parseEther("1");

export const NETWORK_CONFIG = TEST_MODE
  ? {
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x13881",
          chainName: "Mumbai Testnet",
          nativeCurrency: {
            name: "Polygon",
            symbol: "MATIC",
            decimals: 18,
          },
          rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
          blockExplorerUrls: ["https://mumbai-explorer.matic.today"],
        },
      ],
    }
  : {
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x89",
          chainName: "Matic Mainnet",
          nativeCurrency: {
            name: "Polygon",
            symbol: "MATIC",
            decimals: 18,
          },
          rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
          blockExplorerUrls: ["https://explorer.matic.network/"],
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

export const IPFS_CONFIG = {
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
};

export const IPFS_IMAGE_ENDPOINT = `https://cloudflare-ipfs.com/ipfs/`;

export const LOGO_IMAGE_FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
