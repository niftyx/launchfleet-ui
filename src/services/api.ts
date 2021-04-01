import { BigNumber } from "@ethersproject/bignumber";
import { RateLimit } from "async-sema";
import axios from "axios";
import { API_RPS, API_URL } from "config/constants";
import { IInvestHistory } from "types";

axios.defaults.baseURL = API_URL;

class APIService {
  private readonly poolPath = "/pools/v1/";
  private readonly _rateLimit: () => Promise<void>;

  constructor() {
    this._rateLimit = RateLimit(API_RPS); // requests per second
  }

  public async getTotalMembersOfPool(poolId: BigNumber): Promise<BigNumber> {
    await this._rateLimit();
    const response = await axios.get(
      `${this.poolPath}${poolId.toHexString()}/total-members`
    );

    return BigNumber.from(response.data.hex);
  }

  public async getPoolHistory(poolId: BigNumber): Promise<any> {
    await this._rateLimit();
    const response = await axios.get(
      `${this.poolPath}${poolId.toHexString()}/history`
    );

    console.log(response);

    return response.data;
  }

  public async getPoolInvestHistory(poolId: BigNumber): Promise<any> {
    await this._rateLimit();
    const response = await axios.get(
      `${this.poolPath}${poolId.toHexString()}/invest-history`
    );
    console.log(response);

    return response.data;
  }

  public async getPoolInvestorHistory(
    poolId: BigNumber,
    investor: string
  ): Promise<IInvestHistory[]> {
    await this._rateLimit();
    const response = await axios.get(
      `${this.poolPath}${poolId.toHexString()}/history/${investor}`
    );

    return response.data.records.map((e: any) => ({
      ...e,
      amount: BigNumber.from(e.amount.hex),
    }));
  }
}

let apiService: APIService;

export const getApiService = () => {
  if (!apiService) {
    apiService = new APIService();
  }
  return apiService;
};
