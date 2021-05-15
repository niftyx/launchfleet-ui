/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { TransactionModal } from "components";
import {
  DEFAULT_INTERVAL,
  DEFAULT_NETWORK_ID,
  DEFAULT_READONLY_PROVIDER,
  DEFAULT_USD,
  PRICE_DECIMALS,
} from "config/constants";
import { getContractAddress, getToken, knownTokens } from "config/networks";
import { useConnectedWeb3Context } from "contexts/connectedWeb3";
import { BigNumber, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useIsMountedRef } from "hooks";
import _ from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";
import { PoolFactoryService } from "services/poolFactory";
import { IGlobalData, KnownToken } from "types";
import { getLogger } from "utils/logger";
import { MAX_NUMBER, ZERO_NUMBER } from "utils/number";
import { NULL_ADDRESS } from "utils/token";

const logger = getLogger("GlobalContext::");

const defaultTokenPrices = {
  matic: {
    usd: DEFAULT_USD,
    price: ZERO_NUMBER,
    decimals: PRICE_DECIMALS,
  },
  wmatic: {
    usd: DEFAULT_USD,
    price: ZERO_NUMBER,
    decimals: PRICE_DECIMALS,
  },
  usdt: {
    usd: DEFAULT_USD,
    price: ZERO_NUMBER,
    decimals: PRICE_DECIMALS,
  },
  launch: {
    usd: DEFAULT_USD,
    price: ZERO_NUMBER,
    decimals: PRICE_DECIMALS,
  },
};

const defaultData: IGlobalData = {
  price: defaultTokenPrices,
  ethBalance: ZERO_NUMBER,
  txModalData: {
    visible: false,
    title: "",
    instruction: "",
    txId: "",
  },
  baseTokenInfo: {
    address: NULL_ADDRESS,
    amount: ZERO_NUMBER,
  },
};

const GlobalContext = createContext({
  data: defaultData,
  updateData: () => {},
  fetchEthBalance: async () => {},
  setTxModalData: (
    visible: boolean,
    title?: string,
    instruction?: string,
    txId?: string
  ) => {},
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
  const { account, library: provider, networkId } = useConnectedWeb3Context();

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

  const loadGlobalPoolConfig = async (): Promise<void> => {
    const factoryAddress = getContractAddress(
      networkId || DEFAULT_NETWORK_ID,
      "factory"
    );
    const factoryService = new PoolFactoryService(
      provider || DEFAULT_READONLY_PROVIDER,
      account,
      factoryAddress
    );
    try {
      const baseInfo = await factoryService.getBaseInfo();
      if (isRefMounted.current === true) {
        setCurrentData((prev) => ({
          ...prev,
          baseTokenInfo: baseInfo,
        }));
      }
    } catch (error) {
      if (isRefMounted.current === true) {
        setCurrentData((prev) => ({
          ...prev,
          baseTokenInfo: defaultData.baseTokenInfo,
        }));
      }
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(() => {
      fetchPrices();
    }, DEFAULT_INTERVAL * 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchEthBalance();
    const interval = setInterval(fetchEthBalance, DEFAULT_INTERVAL * 1000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, provider]);

  useEffect(() => {
    loadGlobalPoolConfig();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const handleUpdateData = (update = {}) => {
    const mergedData = _.merge({}, currentData, update);
    setCurrentData(mergedData);
  };

  const setTxModalData = (
    visible: boolean,
    title?: string,
    instruction?: string,
    txId?: string
  ) => {
    setCurrentData((prev) => ({
      ...prev,
      txModalData: {
        visible,
        title: title || "",
        instruction: instruction || "",
        txId: txId || "",
      },
    }));
  };

  return (
    <GlobalContext.Provider
      value={{
        data: currentData,
        updateData: handleUpdateData,
        fetchEthBalance,
        setTxModalData,
      }}
    >
      {children}
      <TransactionModal
        {...currentData.txModalData}
        onClose={() => setTxModalData(false)}
      />
    </GlobalContext.Provider>
  );
};

export const GlobalConsumer = GlobalContext.Consumer;

export default GlobalContext;
