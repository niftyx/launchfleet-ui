import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  DEFAULT_MAX_WEI,
  DEFAULT_MIN_WEI,
  DEFAULT_NETWORK_ID,
} from "config/constants";
import { getContractAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useSnackbar } from "notistack";
import { transparentize } from "polished";
import React, { useState } from "react";
import { ERC20Service } from "services/erc20";
import { PoolFactoryService } from "services/poolFactory";
import useCommonStyles from "styles/common";
import { IBasePool } from "types";
import { ECreatePoolStep, EPoolType } from "utils/enums";
import { ETH_NUMBER, ZERO_NUMBER } from "utils/number";
import { NULL_ADDRESS } from "utils/token";

import {
  ConfirmSection,
  HeaderSection,
  MetaInfoForm,
  SuccessSection,
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
  tokenTarget: ZERO_NUMBER,
  multiplier: ZERO_NUMBER,
  weiToken: NULL_ADDRESS,
  minWei: DEFAULT_MIN_WEI,
  maxWei: DEFAULT_MAX_WEI,
  poolType: EPoolType.Private,
  endTime: ZERO_NUMBER,
  startTime: ZERO_NUMBER,
  claimTime: ZERO_NUMBER,
  meta: "",
  logo: "",
  name: "",
  description: "",
};

interface IProps {
  className?: string;
}

interface IState {
  step: ECreatePoolStep;
  basePool: IBasePool;
  poolId: string;
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
    poolId: "",
  });
  const { enqueueSnackbar } = useSnackbar();

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
      const factoryAddress = getContractAddress(
        networkId || DEFAULT_NETWORK_ID,
        "factory"
      );
      const factoryService = new PoolFactoryService(
        provider,
        "",
        factoryAddress
      );
      const erc20Service = new ERC20Service(provider, account, basePool.token);

      setTxModalData(true, "Loading ...");

      const hasEnoughFund = await erc20Service.hasEnoughBalanceToFund(
        account || "",
        basePool.tokenTarget
      );

      if (!hasEnoughFund) {
        setTxModalData(false);
        enqueueSnackbar("Insufficient fund to create a pool!", {
          variant: "error",
        });
        return;
      }

      const hasEnoughAllowance = await erc20Service.hasEnoughAllowance(
        account || "",
        factoryAddress,
        basePool.tokenTarget
      );

      if (!hasEnoughAllowance) {
        setTxModalData(
          true,
          "Approving tokens ...",
          "Follow wallet instructions"
        );
        const txHash = await erc20Service.approveUnlimited(factoryAddress);
        setTxModalData(
          true,
          "Approving tokens ...",
          "Please wait until the transaction is confirmed!",
          txHash
        );
        await provider.waitForTransaction(txHash);
      }
      setTxModalData(true, "Creating pool ...", "Follow wallet instructions");
      const txHash = await factoryService.createPool(
        basePool.token,
        basePool.tokenTarget,
        basePool.multiplier.div(ETH_NUMBER),
        basePool.weiToken,
        basePool.minWei,
        basePool.maxWei,
        basePool.poolType,
        basePool.startTime,
        basePool.endTime,
        basePool.claimTime,
        basePool.meta
      );
      setTxModalData(
        true,
        "Creating pool ...",
        "Please wait until the transaction is confirmed!",
        txHash
      );
      await provider.waitForTransaction(txHash);

      const poolId = await factoryService.getCreatedPoolId(txHash);
      setState((prev) => ({
        ...prev,
        poolId,
        step: ECreatePoolStep.Success,
      }));

      setTxModalData(false);
      enqueueSnackbar("You created a new pool successfully!");
    } catch (error) {
      console.error(error);
      enqueueSnackbar((error || {}).message || "Something went wrong!", {
        variant: "error",
      });
      setTxModalData(false);
    }
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={commonClasses.wrapper}>
        <div className={clsx(commonClasses.pageContent, classes.content)}>
          <Typography className={classes.title}>Create pool</Typography>
          <div className={classes.main}>
            {state.step !== ECreatePoolStep.Success && (
              <HeaderSection setStep={setStep} step={state.step} />
            )}
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
                    step: ECreatePoolStep.MetaInfo,
                  }));
                }}
              />
            )}
            {state.step === ECreatePoolStep.MetaInfo && (
              <MetaInfoForm
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
            {state.step === ECreatePoolStep.Success && (
              <SuccessSection poolId={state.poolId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolCreatePage;
