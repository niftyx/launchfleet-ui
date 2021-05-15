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
import { ONE_NUMBER, ZERO_NUMBER } from "utils/number";

interface IState {
  myPoolIds: BigNumber[];
  loading: boolean;
}

export const useMyPools = (
  provider: any,
  account: string,
  networkId?: number
): IState => {
  const [state, setState] = useState<IState>({
    loading: false,
    myPoolIds: [],
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
    const loadMyPoolIds = async () => {
      // while (isMounted) {
      //   setState((prev) => ({ ...prev, loading: true }));
      //   try {
      //     const poolsCount = await poolzService.getPoolsCount();
      //     const poolIds: BigNumber[] = [];
      //     for (
      //       let index = ZERO_NUMBER;
      //       index.lt(poolsCount);
      //       index = index.add(ONE_NUMBER)
      //     ) {
      //       poolIds.push(index);
      //     }
      //     const poolBaseInfos = await Promise.all(
      //       poolIds.map((poolId) => poolzService.getPoolBaseData(poolId))
      //     );
      //     const myPoolIds = poolIds.filter(
      //       (_, index) =>
      //         poolBaseInfos[index][1].toLowerCase() === account.toLowerCase() // creator === account
      //     );
      //     if (isMounted)
      //       setState((prev) => ({ ...prev, loading: false, myPoolIds }));
      //   } catch (error) {
      //     console.error(error);
      //     if (isMounted) setState((prev) => ({ ...prev, loading: false }));
      //   }
      //   await waitSeconds(DEFAULT_INTERVAL);
      // }
    };
    loadMyPoolIds();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId, provider]);

  return state;
};
