import { gql, useQuery } from "@apollo/client";
import axios from "axios";
import { DEFAULT_READONLY_PROVIDER } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks/useIsMountedRef";
import { useEffect, useState } from "react";
import { ERC20Service } from "services/erc20";
import { IPool } from "types";
import { wranglePool } from "utils/thegraph";

const query = gql`
  query GetPool($id: ID!) {
    pool(id: $id) {
      id
      address
      creator
      token
      tokenTarget
      multiplier
      weiToken
      minWei
      maxWei
      poolType
      startTime
      endTime
      claimTime
      meta
      totalOwed
      weiRaised
      totalMembers
      createTimestamp
      updateTimestamp
    }
  }
`;

interface GraphResponse {
  pool: IPool;
}

interface IState {
  loading: boolean;
  pool?: IPool;
  forceUpdate: boolean;
}

export const usePoolDetails = (
  id: string
): IState & {
  reload: () => Promise<void>;
} => {
  const [state, setState] = useState<IState>({
    loading: true,
    forceUpdate: false,
  });
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const { data, error, loading, refetch } = useQuery<GraphResponse>(query, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    skip: false,
    variables: { id },
  });
  const isMountedRef = useIsMountedRef();

  const loadMeta = async (pool: IPool): Promise<IPool> => {
    const updatedPool = { ...pool };

    const erc20 = new ERC20Service(
      provider || DEFAULT_READONLY_PROVIDER,
      account,
      pool.token
    );
    const profile = await erc20.getProfileSummary();
    if (profile !== null) {
      updatedPool.tokenDecimals = profile.decimals;
      updatedPool.tokenSymbol = profile.symbol;
      updatedPool.tokenName = profile.name;
    }
    try {
      const totalSupply = await erc20.getTotalSupply();
      updatedPool.tokenTotalSupply = totalSupply;
    } catch (error) {
      console.warn(error);
    }

    let metaDetails = {};
    try {
      metaDetails = (await axios.get(pool.meta)).data;
      return { ...updatedPool, ...metaDetails };
    } catch (error) {
      console.error(error);
      return updatedPool;
    }
  };

  const reload = async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        forceUpdate: true,
      }));
      await refetch();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    const updateData = async () => {
      if (error) {
        setState((prev) => ({ ...prev, loading: false }));
      } else if (data) {
        if (data.pool.id) {
          if (
            !state.pool ||
            state.pool.id !== data.pool.id ||
            state.forceUpdate
          ) {
            // get meta info
            setState((prev) => ({
              ...prev,
              loading: true,
            }));
            const updatedPool = await loadMeta(wranglePool(data.pool));
            if (isMountedRef.current === true) {
              setState((prev) => ({
                ...prev,
                loading: false,
                pool: updatedPool,
                forceUpdate: false,
              }));
            }
          }
        }
      }
    };
    updateData();
  }, [data, error]);

  return { ...state, reload };
};
