import { BigNumber } from "@ethersproject/bignumber";
import { IPool } from "types";

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

export const getLeftTokens = (pool: IPool): BigNumber => {
  return pool.tokenTarget.sub(pool.totalOwed);
};

export const isPoolFiltered = (pool: IPool, keyword: string): boolean => {
  if (keyword === "") return true;
  const fKeyword = keyword.toLowerCase();
  try {
    return (
      (pool.name || "").toLowerCase().includes(fKeyword) ||
      pool.id.toLowerCase().includes(fKeyword) ||
      pool.token.toLowerCase().includes(fKeyword) ||
      pool.tokenSymbol.toLowerCase().includes(fKeyword)
    );
  } catch (error) {
    return false;
  }
};

export const getPoolTypeConfigTexts = (baseStr: string) => {
  return [
    {
      name: "Private",
      hint:
        "Owner can add wallets to whitelists and only white-listed users can participate in the pool.",
    },
    {
      name: "LAUNCH Holders",
      hint: `Users than own ${baseStr} LAUNCH token can participate in the pool.`,
    },
    {
      name: "Public",
      hint: "Any users can participate in the pool.",
    },
  ];
};
