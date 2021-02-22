/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { DEFAULT_USD, PRICE_DECIMALS } from "config/constants";
import { getToken, knownTokens } from "config/networks";
import { useConnectedWeb3Context } from "contexts/connectedWeb3";
import { BigNumber, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useIsMountedRef } from "hooks";
import _ from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";
import { IGlobalData, KnownToken } from "types";
import { getLogger } from "utils/logger";
import { ZERO_NUMBER } from "utils/number";

const logger = getLogger("GlobalContext::");

const defaultTokenPrices = {
  avax: {
    usd: DEFAULT_USD,
    price: ZERO_NUMBER,
    decimals: PRICE_DECIMALS,
  },
  eth: {
    usd: DEFAULT_USD,
    price: ZERO_NUMBER,
    decimals: PRICE_DECIMALS,
  },
  usdt: {
    usd: DEFAULT_USD,
    price: ZERO_NUMBER,
    decimals: PRICE_DECIMALS,
  },
};

const defaultData: IGlobalData = {
  itemCartIds: [],
  inventoryCartIds: [],
  price: defaultTokenPrices,
  ethBalance: ZERO_NUMBER,
};

const GlobalContext = createContext({
  data: defaultData,
  updateData: () => {},
  fetchEthBalance: async () => {},
});

/**
 * This hook can only be used by components under the `GlobalProvider` component. Otherwise it will throw.
 */
export const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: IProps) => {
  const [currentData, setCurrentData] = useState<IGlobalData>(defaultData);
  const isRefMounted = useIsMountedRef();
  const { account, library: provider } = useConnectedWeb3Context();

  const fetchPrices = async (): Promise<void> => {
    try {
      const tokenIds = Object.values(knownTokens).map(
        (e) => e.coingeckoTokenId
      );
      const prices = (
        await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
            Object.values(tokenIds).join(",")
          )}&vs_currencies=usd`
        )
      ).data;

      const tokenPrices = { ...defaultTokenPrices };

      Object.keys(prices).map((coingeckoId) => {
        Object.keys(knownTokens).map((tokenId) => {
          if (
            knownTokens[tokenId as KnownToken].coingeckoTokenId === coingeckoId
          ) {
            tokenPrices[tokenId as KnownToken] = {
              decimals: knownTokens[tokenId as KnownToken].decimals,
              usd: prices[coingeckoId].usd,
              price: parseEther(String(prices[coingeckoId].usd)),
            };
          }
        });
      });
      if (isRefMounted.current === true) {
        setCurrentData((prevCurrentData) => ({
          ...prevCurrentData,
          price: tokenPrices,
        }));
      }
    } catch (error) {
      if (isRefMounted.current === true) {
        setCurrentData((prevCurrentData) => ({
          ...prevCurrentData,
          price: defaultTokenPrices,
        }));
      }
    }
  };

  const fetchEthBalance = async (): Promise<void> => {
    try {
      if (account && provider) {
        const balance = await provider.getBalance(account);
        if (isRefMounted.current === true) {
          setCurrentData((prev) => ({ ...prev, ethBalance: balance }));
        }
      } else {
        setCurrentData((prev) => ({ ...prev, ethBalance: ZERO_NUMBER }));
      }
    } catch (error) {
      setCurrentData((prev) => ({ ...prev, ethBalance: ZERO_NUMBER }));
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(() => {
      fetchPrices();
    }, 100000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchEthBalance();
    const interval = setInterval(fetchEthBalance, 10000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, provider]);

  const handleUpdateData = (update = {}) => {
    const mergedData = _.merge({}, currentData, update);
    setCurrentData(mergedData);
  };

  return (
    <GlobalContext.Provider
      value={{
        data: currentData,
        updateData: handleUpdateData,
        fetchEthBalance,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalConsumer = GlobalContext.Consumer;

export default GlobalContext;
