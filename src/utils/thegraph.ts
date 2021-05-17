import { BigNumber } from "@ethersproject/bignumber";
import axios from "axios";
import { IPool } from "types";

type GraphVariables = { [key: string]: string | number | string[] };

export const fetchQuery = (
  query: string,
  variables: GraphVariables,
  endpoint: string
) => {
  return axios.post(endpoint, { query, variables });
};

export const wranglePool = (data: any): IPool => {
  return {
    ...data,
    tokenTarget: BigNumber.from(data.tokenTarget || "0"),
    multiplier: BigNumber.from(data.multiplier || "0"),
    minWei: BigNumber.from(data.minWei || "0"),
    maxWei: BigNumber.from(data.maxWei || "0"),
    startTime: BigNumber.from(data.startTime || "0"),
    endTime: BigNumber.from(data.endTime || "0"),
    claimTime: BigNumber.from(data.claimTime || "0"),
    totalOwed: BigNumber.from(data.totalOwed || "0"),
    weiRaised: BigNumber.from(data.weiRaised || "0"),
    totalMembers: BigNumber.from(data.totalMembers || "0"),
  } as IPool;
};
