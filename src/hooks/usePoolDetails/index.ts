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
import { PoolzService } from "services/poolz";
import { IPool } from "types";
import { EPoolStatus } from "utils/enums";
import { MAX_NUMBER } from "utils/number";
import { ZERO_ADDRESS } from "utils/token";

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
    const poolzAddress = getContractAddress(
      networkId || DEFAULT_NETWORK_ID,
      "poolz"
    );
    const poolzService = new PoolzService(
      provider || DEFAULT_READONLY_PROVIDER,
      "",
      poolzAddress
    );

    setState((prev) => ({ ...prev, loading: true }));
    try {
      const [basePoolInfo, morePoolInfo, extraPoolInfo] = await Promise.all([
        poolzService.getPoolBaseData(id),
        poolzService.getPoolMoreData(id),
        poolzService.getPoolExtraData(id),
      ]);

      const poolInfo = [...basePoolInfo, ...morePoolInfo, ...extraPoolInfo];

      if (poolInfo[0] === ZERO_ADDRESS) {
        if (isMountedRef.current === true) setState(() => ({ loading: false }));
        return;
      }

      const status = await poolzService.getPoolStatus(id);
      const erc20Service = new ERC20Service(
        provider || DEFAULT_READONLY_PROVIDER,
        "",
        poolInfo[0]
      );

      const erc20Info = await erc20Service.getProfileSummary();
      const totalSupply = await erc20Service.getTotalSupply();

      const pool: IPool = {
        poolId: id,
        // baseData
        token: poolInfo[0],
        creator: poolInfo[1],
        finishTime: poolInfo[2],
        rate: poolInfo[3],
        pozRate: poolInfo[4],
        startAmount: poolInfo[5],
        // moreData
        lockedUntil: poolInfo[6],
        leftTokens: poolInfo[7],
        startTime: poolInfo[8],
        openForAll: poolInfo[9],
        unlockedTokens: poolInfo[10],
        is21DecimalRate: poolInfo[11],
        // extraData
        tookLeftOvers: poolInfo[12],
        whiteListId: poolInfo[13],
        mainCoin: poolInfo[14],
        // status
        poolStatus: Object.values(EPoolStatus)[status],
        // erc20 info
        tokenName: erc20Info?.name || "",
        tokenSymbol: erc20Info?.symbol || "",
        tokenDecimals: erc20Info?.decimals || DEFAULT_DECIMALS,
        tokenTotalSupply: totalSupply,
      };

      if (isMountedRef.current === true) {
        setState(() => ({ loading: false, pool }));
      }
    } catch (error) {
      console.error(error);
      if (isMountedRef.current === true) setState(() => ({ loading: false }));
    }
  };

  useEffect(() => {
    loadPoolDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id.toHexString(), networkId, provider]);

  return { ...state, load: loadPoolDetails };
};
