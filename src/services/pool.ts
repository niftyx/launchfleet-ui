import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("Services::Erc20");

const poolAbi = [
  "function claimableAmount(address user) external view returns (uint256)",
  "function setMeta(string memory _meta) external",
  "function withdrawToken() external",
  "function withdrawWei(uint256 amount) public payable",
  "function withdrawWeiToken(uint256 amount) external",
  "function claim() external",
  "function buyWithEth() public payable",
  "function buy(uint256 weiAmount) public",
  "function addMultipleWhitelistedAddresses(address[] calldata _addresses) external",
  "function removeWhitelistedAddress(address _address) external",
  "function addWhitelistedAddress(address _address) external",
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

  getClaimableAmount = async (address: string): Promise<BigNumber> => {
    return this.contract.claimableAmount(address);
  };

  setMeta = async (meta: string): Promise<string> => {
    const transactionObject = await this.contract.setMeta(meta, {
      value: "0x0",
    });
    logger.log(`setMeta transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  claim = async (): Promise<string> => {
    const transactionObject = await this.contract.claim({
      value: "0x0",
    });
    logger.log(`claim transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  withdrawToken = async (): Promise<string> => {
    const transactionObject = await this.contract.withdrawToken({
      value: "0x0",
    });
    logger.log(`withdrawToken transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  withdrawWei = async (amount: BigNumber): Promise<string> => {
    const transactionObject = await this.contract.withdrawWei(amount, {
      value: "0x0",
    });
    logger.log(`withdrawWei transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  withdrawWeiToken = async (amount: BigNumber): Promise<string> => {
    const transactionObject = await this.contract.withdrawWeiToken(amount, {
      value: "0x0",
    });
    logger.log(`withdrawWeiToken transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  buyWithEth = async (amount: BigNumber): Promise<string> => {
    const transactionObject = await this.contract.buyWithEth({
      value: amount,
    });
    logger.log(`buyWithEth transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  buy = async (amount: BigNumber): Promise<string> => {
    const transactionObject = await this.contract.buy(amount, {
      value: "0x0",
    });
    logger.log(`buy transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  addWhitelistedAddress = async (address: string): Promise<string> => {
    const transactionObject = await this.contract.addWhitelistedAddress(
      address,
      {
        value: "0x0",
      }
    );
    logger.log(
      `addWhitelistedAddress transaction hash: ${transactionObject.hash}`
    );
    return transactionObject.hash;
  };

  addMultipleWhitelistedAddresses = async (
    addresses: string[]
  ): Promise<string> => {
    const transactionObject = await this.contract.addMultipleWhitelistedAddresses(
      addresses,
      {
        value: "0x0",
      }
    );
    logger.log(
      `addMultipleWhitelistedAddresses transaction hash: ${transactionObject.hash}`
    );
    return transactionObject.hash;
  };

  removeWhitelistedAddress = async (address: string): Promise<string> => {
    const transactionObject = await this.contract.removeWhitelistedAddress(
      address,
      {
        value: "0x0",
      }
    );
    logger.log(
      `removeWhitelistedAddress transaction hash: ${transactionObject.hash}`
    );
    return transactionObject.hash;
  };
}

export { PoolService };
