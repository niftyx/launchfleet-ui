import { BigNumber } from "@ethersproject/bignumber";
import {
  DEFAULT_INTERVAL,
  DEFAULT_NETWORK_ID,
  DEFAULT_READONLY_PROVIDER,
} from "config/constants";
import { getContractAddress } from "config/networks";
import { useEffect, useState } from "react";
import { PoolFactoryService } from "services/poolFactory";
import { waitSeconds } from "utils";
import { ZERO_NUMBER } from "utils/number";

interface IState {
  poolsCount: BigNumber;
  loading: boolean;
}

export const usePoolsCount = (provider: any, networkId?: number): IState => {
  const [state, setState] = useState<IState>({
    loading: false,
    poolsCount: ZERO_NUMBER,
  });

  useEffect(() => {
    let isMounted = true;
    const factoryAddress = getContractAddress(
      networkId || DEFAULT_NETWORK_ID,
      "factory"
    );
    const factoryService = new PoolFactoryService(
      provider || DEFAULT_READONLY_PROVIDER,
      "",
      factoryAddress
    );
    const loadPoolsCount = async () => {
      // while (isMounted) {
      //   setState((prev) => ({ ...prev, loading: true }));
      //   try {
      //     const poolsCount = await poolzService.getPoolsCount();
      //     if (isMounted)
      //       setState((prev) => ({ ...prev, loading: false, poolsCount }));
      //   } catch (error) {
      //     if (isMounted) setState((prev) => ({ ...prev, loading: false }));
      //   }
      //   await waitSeconds(DEFAULT_INTERVAL);
      // }
    };
    loadPoolsCount();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId, provider]);

  return state;
};
