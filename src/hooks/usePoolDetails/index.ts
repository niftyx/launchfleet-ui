import { BigNumber } from "@ethersproject/bignumber";
import {
  DEFAULT_DECIMALS,
  DEFAULT_NETWORK_ID,
  DEFAULT_READONLY_PROVIDER,
} from "config/constants";
import { getContractAddress } from "config/networks";
import { useIsMountedRef } from "hooks/useIsMountedRef";
import { useEffect, useState } from "react";
import { ERC20Service } from "services/erc20";
import { PoolFactoryService } from "services/poolFactory";
import { IPool } from "types";
import { EPoolStatus } from "utils/enums";
import { MAX_NUMBER, ZERO_NUMBER } from "utils/number";
import { NULL_ADDRESS } from "utils/token";

interface IState {
  pool?: IPool;
  loading: boolean;
}

export const usePoolDetails = (
  id: BigNumber,
  networkId?: number,
  provider?: any
): IState & {
  load: () => Promise<void>;
} => {
  const [state, setState] = useState<IState>({
    loading: false,
  });

  const isMountedRef = useIsMountedRef();

  const loadPoolDetails = async () => {
    if (id.eq(MAX_NUMBER)) {
      return;
    }
    const factoryAddress = getContractAddress(
      networkId || DEFAULT_NETWORK_ID,
      "factory"
    );
    const factoryService = new PoolFactoryService(
      provider || DEFAULT_READONLY_PROVIDER,
      "",
      factoryAddress
    );

    setState((prev) => ({ ...prev, loading: true }));
  };

  useEffect(() => {
    loadPoolDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id.toHexString(), networkId]);

  return { ...state, load: loadPoolDetails };
};
