import { BigNumber } from "@ethersproject/bignumber";
import { MIN_CALC_TOKENS } from "config/constants";
import { IPool, IToken } from "types";

import { BigNumberMax, BigNumberMin, ZERO_NUMBER } from "./number";
import { ZERO_ADDRESS } from "./token";

export const getRemainingTimeStr = (time: number): string => {
  return [
    { value: Math.floor(time / 60 / 60 / 24), unit: "d" },
    { value: Math.floor((time / 60 / 60) % 24), unit: "h" },
    { value: Math.floor((time / 60) % 60), unit: "m" },
    { value: Math.floor(time % 60), unit: "s" },
  ]
    .filter((e) => e.value)
    .map((e) => `${e.value}${e.unit}`)
    .join(" : ");
};

export const getMinMaxAllocationPerWallet = (
  pool: IPool,
  globalConfig: {
    MinETHInvest: BigNumber;
    MaxETHInvest: BigNumber;
    MinERC20Invest: BigNumber;
    MaxERC20Invest: BigNumber;
  },
  isPrivate: boolean
): {
  MinAllocationPerWallet: BigNumber;
  MaxAllocationPerWallet: BigNumber;
} => {
  const result = {
    MinAllocationPerWallet: ZERO_NUMBER,
    MaxAllocationPerWallet: ZERO_NUMBER,
  };

  const rate = isPrivate ? pool.pozRate : pool.rate;
  const leftTokens = pool.leftTokens;

  const maxAllocation = leftTokens.div(rate);
  const minAllocation = MIN_CALC_TOKENS.div(rate);

  const isMainToken = pool.mainCoin === ZERO_ADDRESS;

  if (isMainToken) {
    result.MinAllocationPerWallet = BigNumberMax(
      globalConfig.MinETHInvest,
      minAllocation
    );
    result.MaxAllocationPerWallet = BigNumberMin(
      globalConfig.MaxETHInvest,
      maxAllocation
    );
  } else {
    result.MinAllocationPerWallet = BigNumberMax(
      globalConfig.MinERC20Invest,
      minAllocation
    );
    result.MaxAllocationPerWallet = BigNumberMin(
      globalConfig.MaxERC20Invest,
      maxAllocation
    );
  }

  return result;
};
