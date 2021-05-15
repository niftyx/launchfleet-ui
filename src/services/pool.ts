import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("Services::Erc20");

const poolAbi = [
  "function poolsCount() external view returns (uint256)",
  "function pools(uint256) external view returns (address)",
  "function getFeeInfo() external view returns (address, uint256)",
  "function getBaseInfo() external view returns (address, uint256)",
  "function createPool(address token,uint256 tokenTarget,uint256 multiplier,address weiToken,uint256 minWei,uint256 maxWei,uint8 poolType,uint256 startTime,uint256 endTime,uint256 claimTime,string memory meta) external returns (address)",
];

class PoolService {
  provider: any;
  contract: Contract;

  constructor(
    provider: any,
    signerAddress: Maybe<string>,
    tokenAddress: string
  ) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(
        tokenAddress,
        poolAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, poolAbi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  getPoolCount = async (): Promise<BigNumber> => {
    return this.contract.poolsCount();
  };

  getPool = async (index: BigNumber): Promise<string> => {
    return this.contract.pools(index);
  };

  getFeeInfo = async (): Promise<{ address: string; percent: BigNumber }> => {
    const res = this.contract.getFeeInfo();
    return { address: res[0], percent: res[1] };
  };

  getBaseInfo = async (): Promise<{ address: string; amount: BigNumber }> => {
    const res = this.contract.getBaseInfo();
    return { address: res[0], amount: res[1] };
  };

  createPool = async (
    token: string,
    tokenTarget: BigNumber,
    multiplier: BigNumber,
    weiToken: string,
    minWei: BigNumber,
    maxWei: BigNumber,
    poolType: number,
    startTime: BigNumber,
    endTime: BigNumber,
    claimTime: BigNumber,
    meta: string
  ): Promise<string> => {
    const transactionObject = await this.contract.createPool(
      token,
      tokenTarget,
      multiplier,
      weiToken,
      minWei,
      maxWei,
      poolType,
      startTime,
      endTime,
      claimTime,
      meta,
      {
        value: "0x0",
      }
    );
    logger.log(`CreatePool transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };
}

export { PoolService };
