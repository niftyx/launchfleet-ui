import { parseEther } from "@ethersproject/units";
import { BigNumber, ethers } from "ethers";

export const ZERO_NUMBER = BigNumber.from(0);
export const MAX_NUMBER = ethers.constants.MaxUint256;
export const ONE_NUMBER = BigNumber.from(1);
export const ETH_NUMBER = parseEther("1");

export const isValidHexString = (str: string) => {
  return /^0[xX][0-9a-fA-F]+$/.test(str);
};

export const BigNumberMax = (a: BigNumber, b: BigNumber): BigNumber => {
  if (a.gt(b)) return a;
  return b;
};

export const BigNumberMin = (a: BigNumber, b: BigNumber): BigNumber => {
  if (a.gt(b)) return b;
  return a;
};
