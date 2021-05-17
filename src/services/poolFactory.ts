import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("Services::Erc20");

const poolFactoryAbi = [
  "function poolsCount() external view returns (uint256)",
  "function pools(uint256) external view returns (address)",
  "function getFeeInfo() external view returns (address, uint256)",
  "function getBaseInfo() external view returns (address, uint256)",
  "function createPool(address token,uint256 tokenTarget,uint256 multiplier,address weiToken,uint256 minWei,uint256 maxWei,uint8 poolType,uint256 startTime,uint256 endTime,uint256 claimTime,string memory meta) external returns (address)",
  "event PoolCreated(address indexed addr)",
];

class PoolFactoryService {
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
        poolFactoryAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(
        tokenAddress,
        poolFactoryAbi,
        provider
      );
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

  getFeeInfo = async (): Promise<{
    feeRecipient: string;
    feePercent: BigNumber;
  }> => {
    const res = await this.contract.getFeeInfo();
    return { feeRecipient: res[0], feePercent: res[1] };
  };

  getBaseInfo = async (): Promise<{ address: string; amount: BigNumber }> => {
    const res = await this.contract.getBaseInfo();
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

  getCreatedPoolId = async (txHash: string): Promise<string> => {
    const filter = this.contract.filters.PoolCreated();
    if (!filter.topics || filter.topics.length === 0) return "";
    const PoolCreatedId = filter.topics[0] as string;
    const transactionReceipt: TransactionReceipt = await this.provider.getTransactionReceipt(
      txHash
    );

    const poolCreateLog = transactionReceipt.logs.find((lg) =>
      lg.topics.includes(PoolCreatedId)
    );

    if (poolCreateLog) {
      const parsedLog = this.contract.interface.parseLog(poolCreateLog);
      return parsedLog.args[0];
    }

    return "";
  };
}

export { PoolFactoryService };
