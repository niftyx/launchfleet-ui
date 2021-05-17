import axios from "axios";
import { DEFAULT_READONLY_PROVIDER, ITEMS_PER_PAGE } from "config/constants";
import { getGraphUris } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks/useIsMountedRef";
import { useEffect, useState } from "react";
import { ERC20Service } from "services/erc20";
import { IPool } from "types";
import { fetchQuery, wranglePool } from "utils/thegraph";

const query = `
  query GetPools($first: Int!, $skip: Int!) {
    pools(
      first: $first
      skip: $skip
      orderBy: createTimestamp
      orderDirection: asc
    ) {
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

interface IState {
  loading: boolean;
  pools: IPool[];
  hasMore: boolean;
}

export const useAllPools = (): IState & {
  loadMorePools: () => Promise<void>;
} => {
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    loading: false,
    pools: [],
    hasMore: false,
  });
  const isMountedRef = useIsMountedRef();
  const { httpUri } = getGraphUris(networkId);

  const loadMorePools = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const result = (
        await fetchQuery(
          query,
          {
            skip: state.pools.length,
            first: ITEMS_PER_PAGE + 1,
          },
          httpUri
        )
      ).data;
      const hasMore = result.data.pools.length === ITEMS_PER_PAGE + 1;
      const pools: IPool[] = result.data.pools
        .map((pool: any) => wranglePool(pool))
        .slice(0, ITEMS_PER_PAGE);

      const poolMetaInfoPromises = pools.map(async (pool) => {
        const erc20 = new ERC20Service(
          provider || DEFAULT_READONLY_PROVIDER,
          account,
          pool.token
        );
        const profile = await erc20.getProfileSummary();
        if (profile === null) return {};
        const totalSupply = await erc20.getTotalSupply();
        let metaDetails = {};
        try {
          metaDetails = (await axios.get(pool.meta)).data;
        } catch (error) {
          console.error(error);
        }
        return {
          tokenName: profile.name,
          tokenSymbol: profile.symbol,
          tokenDecimals: profile.decimals,
          tokenTotalSupply: totalSupply,
          ...metaDetails,
        };
      });
      const poolsMetaInfo = await Promise.all(poolMetaInfoPromises);

      const poolsWithMetaInfo = pools.map((pool, index) => ({
        ...pool,
        ...poolsMetaInfo[index],
      }));

      if (isMountedRef.current === true)
        setState((prev) => ({
          ...prev,
          loading: false,
          pools: [...prev.pools, ...poolsWithMetaInfo],
          hasMore,
        }));
    } catch (error) {
      console.error(error);
      if (isMountedRef.current === true)
        setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const reloadPools = async () => {
    setState((prev) => ({ ...prev, pools: [], loading: true, hasMore: false }));

    try {
      const result = (
        await fetchQuery(
          query,
          {
            skip: 0,
            first: ITEMS_PER_PAGE + 1,
          },
          httpUri
        )
      ).data;
      const hasMore = result.data.pools.length === ITEMS_PER_PAGE + 1;
      const pools: IPool[] = result.data.pools
        .map((pool: any) => wranglePool(pool))
        .slice(0, ITEMS_PER_PAGE);

      const poolMetaInfoPromises = pools.map(async (pool) => {
        const erc20 = new ERC20Service(
          provider || DEFAULT_READONLY_PROVIDER,
          account,
          pool.token
        );
        const profile = await erc20.getProfileSummary();
        if (profile === null) return {};
        const totalSupply = await erc20.getTotalSupply();
        let metaDetails = {};
        try {
          metaDetails = (await axios.get(pool.meta)).data;
        } catch (error) {
          console.error(error);
        }
        return {
          tokenName: profile.name,
          tokenSymbol: profile.symbol,
          tokenDecimals: profile.decimals,
          tokenTotalSupply: totalSupply,
          ...metaDetails,
        };
      });
      const poolsMetaInfo = await Promise.all(poolMetaInfoPromises);

      const poolsWithMetaInfo = pools.map((pool, index) => ({
        ...pool,
        ...poolsMetaInfo[index],
      }));

      if (isMountedRef.current === true)
        setState((prev) => ({
          ...prev,
          loading: false,
          pools: poolsWithMetaInfo,
          hasMore,
        }));
    } catch (error) {
      console.error(error);
      if (isMountedRef.current === true)
        setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    reloadPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [httpUri]);

  return { ...state, loadMorePools };
};
