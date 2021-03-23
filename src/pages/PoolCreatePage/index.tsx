import { BigNumber } from "@ethersproject/bignumber";
import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getContractAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { transparentize } from "polished";
import React, { useState } from "react";
import { ERC20Service } from "services/erc20";
import { PoolzService } from "services/poolz";
import useCommonStyles from "styles/common";
import { IBasePool } from "types";
import { ECreatePoolStep } from "utils/enums";
import { ZERO_NUMBER } from "utils/number";
import { ZERO_ADDRESS } from "utils/token";

import {
  ConfirmSection,
  HeaderSection,
  SwapRulesForm,
  TokenInformationForm,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    color: theme.colors.secondary,
    fontSize: 32,
  },
  content: {},
  main: {
    backgroundColor: transparentize(0.75, theme.colors.sixth),
    padding: 32,
    borderRadius: 12,
    marginTop: 32,
  },
}));

const basePool: IBasePool = {
  token: "",
  tokenName: "",
  tokenDecimals: 0,
  tokenSymbol: "",
  auctionFinishTimestamp: ZERO_NUMBER,
  expectedRate: ZERO_NUMBER,
  pozRate: ZERO_NUMBER,
  startAmount: ZERO_NUMBER,
  lockedUntil: 0,
  mainCoin: ZERO_ADDRESS,
  is21Decimal: false,
  now: ZERO_NUMBER,
  whitelistId: ZERO_NUMBER,
};

interface IProps {
  className?: string;
}

interface IState {
  step: ECreatePoolStep;
  basePool: IBasePool;
}

const PoolCreatePage = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { setTxModalData } = useGlobal();
  const {
    account,
    library: provider,
    networkId,
    onConnect,
  } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    step: ECreatePoolStep.TokenInformation,
    basePool,
  });

  const setStep = (step: ECreatePoolStep) => {
    setState((prev) => ({ ...prev, step }));
  };

  const onCreatePool = async () => {
    if (!account || !provider) {
      onConnect();
      return;
    }
    try {
      const { basePool } = state;
      const poolContractAddress = getContractAddress(
        networkId || DEFAULT_NETWORK_ID,
        "poolz"
      );
      const poolService = new PoolzService(
        provider,
        account,
        poolContractAddress
      );
      const erc20Service = new ERC20Service(provider, account, basePool.token);

      setTxModalData(true, "Loading ...");

      const hasEnoughAllowance = await erc20Service.hasEnoughBalanceToFund(
        poolContractAddress,
        basePool.startAmount
      );
      if (!hasEnoughAllowance) {
        setTxModalData(
          true,
          "Approving tokens ...",
          "Follow wallet instructions"
        );
        const txHash = await erc20Service.approveUnlimited(poolContractAddress);
        setTxModalData(
          true,
          "Approving tokens ...",
          "Please wait until the transaction is confirmed!",
          txHash
        );
        await provider.waitForTransaction(txHash);
      }
      setTxModalData(true, "Creating pool ...", "Follow wallet instructions");
      const txHash = await poolService.createPool(
        basePool.token,
        basePool.auctionFinishTimestamp,
        basePool.expectedRate,
        basePool.pozRate,
        basePool.startAmount,
        ZERO_NUMBER,
        false,
        ZERO_NUMBER,
        ZERO_NUMBER
      );
      setTxModalData(
        true,
        "Creating pool ...",
        "Please wait until the transaction is confirmed!",
        txHash
      );
      await provider.waitForTransaction(txHash);
    } catch (error) {
      setTxModalData(false);
    }
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={commonClasses.wrapper}>
        <div className={clsx(commonClasses.pageContent, classes.content)}>
          <Typography className={classes.title}>Create pool</Typography>
          <div className={classes.main}>
            <HeaderSection setStep={setStep} step={state.step} />
            {state.step === ECreatePoolStep.TokenInformation && (
              <TokenInformationForm
                basePool={state.basePool}
                onNext={(data) => {
                  setState((prev) => ({
                    ...prev,
                    basePool: { ...prev.basePool, ...data } as IBasePool,
                    step: ECreatePoolStep.SwapRules,
                  }));
                }}
              />
            )}
            {state.step === ECreatePoolStep.SwapRules && (
              <SwapRulesForm
                basePool={state.basePool}
                onNext={(data) => {
                  setState((prev) => ({
                    ...prev,
                    basePool: { ...prev.basePool, ...data } as IBasePool,
                    step: ECreatePoolStep.Confirm,
                  }));
                }}
              />
            )}
            {state.step === ECreatePoolStep.Confirm && (
              <ConfirmSection
                basePool={state.basePool}
                onConfirm={onCreatePool}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolCreatePage;