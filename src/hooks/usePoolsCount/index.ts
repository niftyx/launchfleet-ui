import { BigNumber } from "@ethersproject/bignumber";
import {
  DEFAULT_NETWORK_ID,
  DEFAULT_READONLY_PROVIDER,
} from "config/constants";
import { getContractAddress } from "config/networks";
import { useEffect, useState } from "react";
import { PoolzService } from "services/poolz";
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
    const poolzAddress = getContractAddress(
      networkId || DEFAULT_NETWORK_ID,
      "poolz"
    );
    const poolzService = new PoolzService(
      provider || DEFAULT_READONLY_PROVIDER,
      "",
      poolzAddress
    );
    const loadPoolsCount = async () => {
      while (isMounted) {
        setState((prev) => ({ ...prev, loading: true }));
        try {
          const poolsCount = await poolzService.getPoolsCount();
          if (isMounted)
            setState((prev) => ({ ...prev, loading: false, poolsCount }));
        } catch (error) {
          if (isMounted) setState((prev) => ({ ...prev, loading: false }));
        }
        await waitSeconds(10);
      }
    };
    loadPoolsCount();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId, provider]);

  return state;
};
