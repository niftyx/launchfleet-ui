import { BigNumber } from "@ethersproject/bignumber";
import {
  DEFAULT_INTERVAL,
  DEFAULT_NETWORK_ID,
  DEFAULT_READONLY_PROVIDER,
} from "config/constants";
import { getContractAddress } from "config/networks";
import { useEffect, useState } from "react";
import { PoolzService } from "services/poolz";
import { waitSeconds } from "utils";
import { ONE_NUMBER, ZERO_NUMBER } from "utils/number";

interface IState {
  upcomingPoolIds: BigNumber[];
  loading: boolean;
}

export const useUpcomingPools = (provider: any, networkId?: number): IState => {
  const [state, setState] = useState<IState>({
    loading: false,
    upcomingPoolIds: [],
  });

  useEffect(() => {
    let isMounted = true;
    const poolzAddress = getContractAddress(
      networkId || DEFAULT_NETWORK_ID,
      "poolz"
    );
    const poolzService = new PoolzService(
      provider || DEFAULT_READONLY_PROVIDER,
      "",
      poolzAddress
    );
    const loadUpcomingPoolIds = async () => {
      while (isMounted) {
        setState((prev) => ({ ...prev, loading: true }));
        try {
          const poolsCount = await poolzService.getPoolsCount();
          const poolIds: BigNumber[] = [];
          for (
            let index = ZERO_NUMBER;
            index.lt(poolsCount);
            index = index.add(ONE_NUMBER)
          ) {
            poolIds.push(index);
          }
          const poolStatuses = await Promise.all(
            poolIds.map((poolId) => poolzService.getPoolStatus(poolId))
          );
          const upcomingPoolIds = poolIds.filter(
            (_, index) => poolStatuses[index] === 2 // Premade: now < startTime
          );
          if (isMounted)
            setState((prev) => ({ ...prev, loading: false, upcomingPoolIds }));
        } catch (error) {
          console.error(error);
          if (isMounted) setState((prev) => ({ ...prev, loading: false }));
        }
        await waitSeconds(DEFAULT_INTERVAL);
      }
    };
    loadUpcomingPoolIds();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId, provider]);

  return state;
};
