import { TransactionReceipt } from "@ethersproject/abstract-provider/lib/index";
import { BigNumber, Contract, Wallet, ethers, utils } from "ethers";
import { IToken, Maybe } from "types";
import { getLogger } from "utils/logger";
import { isAddress, isContract } from "utils/tools";

const logger = getLogger("Services::Poolz");

const poolzAbi = [
  "function poolsCount() external view returns (uint8)",
  "function owner() external view returns (address)",
  "function MinETHInvest() external view returns (uint8)",
  "function IsERC20Maincoin() external view returns (bool)",
  "function MaxDuration() external view returns (uint8)",
  "function MinDuration() external view returns (uint8)",
  "function isPoolLocked(uint) external view returns (bool)",
  "function getTotalInvestor() external view returns (uint8)",
  "function GetPoolBaseData(uint256 _Id) public view returns (address,address,uint256,uint256,uint256,uint256)",
  "function GetInvestmentData(uint256 _id) external view returns (uint256,address,uint256,uint256,uint256)",
  "function IsTokenFilterOn() external view returns (bool)",
  "function paused() external view returns (bool)",
  "function PozFee() external view returns (uint256)",
  "function poolsMap(address, uint256) external view returns (uint256)",
  "function IsValidToken(address _address) public view returns (bool)",
  "function GetPoolStatus(uint256 _id) external view returns (uint8)",
  "function IsPayble() external view returns(bool)",
  // write
  "function SetFee(uint256 _fee) public",
  "function SwapTokenFilter() public",
  "function SetMinMaxETHInvest(uint256 _MinETHInvest, uint256 _MaxETHInvest) public",
  "function setGovernerContract(address _address) external",
  "function WithdrawInvestment(uint256 _id) public returns (bool)",
  "function WithdrawETHFee(address _to) public",
  "function SetPOZFee(uint256 _fee) public",
  "function SwitchIsPayble() public",
  "function SetMinMaxDuration(uint256 _minDuration, uint256 _maxDuration) public",
  "function SetPoolPrice(uint256 _PoolPrice) public",
  "function InvestERC20(uint256 _PoolId, uint256 _Amount) external",
  "function CreatePool( address _Token, uint256 _FinishTime, uint256 _Rate, uint256 _POZRate, uint256 _StartAmount, uint64 _LockedUntil, address _MainCoin, bool _Is21Decimal, uint256 _Now, uint256 _WhiteListId ) public payable",
  "function InvestETH(uint256 _PoolId) external payable",
  "function WithdrawERC20Fee(address _Token, address _to) public",
  "function WithdrawLeftOvers(uint256 _PoolId) public returns (bool)",
  // events
  "event NewPool(address token, uint256 id)",
  "event FinishPool(uint256 id)",
  "event PoolUpdate(uint256 id)",
  "event NewInvestorEvent(uint256 Investor_ID, address Investor_Address)",
];

class PoolzService {
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
        poolzAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, poolzAbi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  getPoolsCount = async (): Promise<number> => {
    return this.contract.poolsCount();
  };

  getOwner = async (): Promise<string> => {
    return this.contract.owner();
  };

  getMinEthInvest = async (): Promise<number> => {
    return this.contract.MinETHInvest();
  };

  IsERC20Maincoin = async (): Promise<BigNumber> => {
    return this.contract.IsERC20Maincoin();
  };

  getMaxDuration = async (): Promise<number> => {
    return this.contract.MaxDuration();
  };

  getMinDuration = async (): Promise<number> => {
    return this.contract.MinDuration();
  };

  isPoolLocked = async (poolId: BigNumber): Promise<boolean> => {
    return this.contract.isPoolLocked(poolId);
  };

  getTotalInvestor = async (): Promise<number> => {
    return this.contract.getTotalInvestor();
  };

  getPoolBaseData = async (
    id: BigNumber
  ): Promise<{
    token1: string;
    token2: string;
    e1: BigNumber;
    e2: BigNumber;
    e3: BigNumber;
    e4: BigNumber;
  }> => {
    return this.contract.GetPoolBaseData(id);
  };

  getInvestmentData = async (
    id: BigNumber
  ): Promise<{
    e1: BigNumber;
    token1: string;
    e2: BigNumber;
    e3: BigNumber;
    e4: BigNumber;
  }> => {
    return this.contract.GetInvestmentData(id);
  };

  isTokenFilterOn = async (): Promise<boolean> => {
    return this.contract.IsTokenFilterOn();
  };

  paused = async (): Promise<boolean> => {
    return this.contract.paused();
  };

  getPozFee = async (): Promise<BigNumber> => {
    return this.contract.PozFee();
  };

  isValidToken = async (address: string): Promise<boolean> => {
    return this.contract.IsValidToken(address);
  };

  getPoolStatus = async (id: BigNumber): Promise<number> => {
    return this.contract.GetPoolStatus(id);
  };

  isPayble = async (): Promise<BigNumber> => {
    return this.contract.IsPayble();
  };

  setFee = async (fee: BigNumber): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.SetFee(fee);
    logger.log(`SetFee transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  swapTokenFilter = async (): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.SwapTokenFilter();
    logger.log(`SwapTokenFilter transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  setMinMaxETHInvest = async (
    _MinETHInvest: BigNumber,
    _MaxETHInvest: BigNumber
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.SetMinMaxETHInvest(
      _MinETHInvest,
      _MaxETHInvest
    );
    logger.log(
      `SetMinMaxETHInvest transaction hash: ${transactionObject.hash}`
    );
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  setGovernerContract = async (
    address: string
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.setGovernerContract(address);
    logger.log(
      `setGovernerContract transaction hash: ${transactionObject.hash}`
    );
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  withdrawInvestment = async (id: BigNumber): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.WithdrawInvestment(id);
    logger.log(
      `WithdrawInvestment transaction hash: ${transactionObject.hash}`
    );
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  withdrawETHFee = async (address: string): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.WithdrawETHFee(address);
    logger.log(`WithdrawETHFee transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  setPOZFee = async (fee: BigNumber): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.SetPOZFee(fee);
    logger.log(`SetPOZFee transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  SwitchIsPayble = async (): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.SwitchIsPayble();
    logger.log(`SwitchIsPayble transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  setMinMaxDuration = async (
    _minDuration: BigNumber,
    _maxDuration: BigNumber
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.SetMinMaxDuration(
      _minDuration,
      _maxDuration
    );
    logger.log(`SetMinMaxDuration transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  setPoolPrice = async (price: BigNumber): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.SetPoolPrice(price);
    logger.log(`SetPoolPrice transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  investERC20 = async (
    poolId: BigNumber,
    amount: BigNumber
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.InvestERC20(poolId, amount);
    logger.log(`InvestERC20 transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  createPool = async (
    token: string,
    finishTime: BigNumber,
    rate: BigNumber,
    pozRate: BigNumber,
    startAmount: BigNumber,
    lockedUntil: BigNumber,
    is21Decimal: boolean,
    now: BigNumber,
    whitelistId: BigNumber
  ): Promise<string> => {
    const transactionObject = await this.contract.CreatePool(
      token,
      finishTime,
      rate,
      pozRate,
      startAmount,
      lockedUntil,
      is21Decimal,
      now,
      whitelistId
    );
    logger.log(`CreatePool transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  investETH = async (poolId: BigNumber): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.InvestETH(poolId);
    logger.log(`InvestETH transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  withdrawERC20Fee = async (
    token: string,
    to: string
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.WithdrawERC20Fee(token, to);
    logger.log(`WithdrawERC20Fee transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  withdrawLeftOvers = async (
    poolId: BigNumber
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.WithdrawLeftOvers(poolId);
    logger.log(`WithdrawLeftOvers transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };
}

export { PoolzService };
