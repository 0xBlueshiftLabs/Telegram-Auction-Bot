import React, { useMemo, useState } from "react";
import Input from "../Input";
import { Button } from "../Button";
import HorizontalInfo from "../HorizontalInfo";
import { BigNumber, utils } from "ethers";
import InterTypography from "../InterTypography";
import { useThemeParams } from "@tma.js/sdk-react";
import { StageProps } from "../../types";

export function AmountStage({
  chainId,
  account,
  setStage,
  prevStageParams,
  stageInfo,
}: StageProps) {
  const theme = useThemeParams();

  const [sellAmount, setSellAmount] = useState<string | undefined>();
  const [minFundingThreshold, setMinFundingThreshold] = useState<
    string | undefined
  >();
  const [minBuyAmountPerOrder, setMinBuyAmountPerOrder] = useState<
    string | undefined
  >();

  const {
    sellAmountBN,
    minFundingThresholdBN,
    minBuyAmountPerOrderBN,
    minBuyAmountBN,
    error,
    disabled,
  } = useMemo(() => {
    const sellAmountBN = utils.parseUnits(
      sellAmount
        ? isNaN(Number(sellAmount ?? 0))
          ? "0"
          : (sellAmount as string)
        : "0",
      prevStageParams?.auctioningToken.decimals
    );
    const minFundingThresholdBN = utils.parseUnits(
      minFundingThreshold
        ? isNaN(Number(minFundingThreshold ?? 0))
          ? "0"
          : (minFundingThreshold as string)
        : "0",
      prevStageParams?.biddingToken.decimals
    );
    const minBuyAmountPerOrderBN = utils.parseUnits(
      minBuyAmountPerOrder
        ? isNaN(Number(minBuyAmountPerOrder ?? 0))
          ? "0"
          : (minBuyAmountPerOrder as string)
        : "0",
      prevStageParams?.biddingToken.decimals
    );
    const minBuyAmountBN = minFundingThresholdBN;
    const maxAmount = BigNumber.from("2").pow(BigNumber.from("96"));
    const sellLimitExceeded = sellAmountBN.gt(maxAmount)
      ? `Auctioned Amount has to be less than ${utils.formatUnits(
          maxAmount,
          prevStageParams?.auctioningToken.decimals
        )}`
      : undefined;
    const fundingLimitExceeded = minFundingThresholdBN.gt(maxAmount)
      ? `Minimum ${
          prevStageParams?.biddingToken.symbol
        } required has to be less than ${utils.formatUnits(
          maxAmount,
          prevStageParams?.biddingToken.decimals
        )}`
      : undefined;

    const minBuyAmountExceeded = minBuyAmountPerOrderBN.gt(maxAmount)
      ? `Minimum ${
          prevStageParams?.biddingToken.symbol
        } per order has to be less than ${utils.formatUnits(
          maxAmount,
          prevStageParams?.biddingToken.decimals
        )}`
      : undefined;

    const insufficientBalance = sellAmountBN.gt(
      prevStageParams?.auctioningToken.balance
    )
      ? `Insufficient ${prevStageParams?.auctioningToken.symbol} balance`
      : undefined;

    const error =
      sellLimitExceeded ||
      fundingLimitExceeded ||
      minBuyAmountExceeded ||
      insufficientBalance;

    return {
      sellAmountBN,
      minFundingThresholdBN,
      minBuyAmountPerOrderBN,
      minBuyAmountBN,
      error,
      disabled: Boolean(
        sellAmountBN.eq(0) ||
          minFundingThresholdBN.eq(0) ||
          minBuyAmountPerOrderBN.eq(0) ||
          error
      ),
    };
  }, [sellAmount, minFundingThreshold, minBuyAmountPerOrder, prevStageParams]);

  return (
    <>
      <Input
        label={`${prevStageParams?.auctioningToken.symbol} to sell`}
        value={sellAmount}
        setValue={(val) => setSellAmount(val)}
        placeholder="0.00"
      />
      <Input
        label={`Minimum ${prevStageParams?.biddingToken.symbol} required`}
        value={minFundingThreshold}
        setValue={(val) => setMinFundingThreshold(val)}
        placeholder="0.00"
      />
      <Input
        label={`Minimum ${prevStageParams?.biddingToken.symbol} per order`}
        value={minBuyAmountPerOrder}
        setValue={(val) => setMinBuyAmountPerOrder(val)}
        placeholder="0.00"
      />

      <HorizontalInfo
        header={`Amount of ${prevStageParams?.auctioningToken.symbol} to sell`}
        value={sellAmount}
        isLoading={false}
      />
      <HorizontalInfo
        header={`Minimum ${prevStageParams?.biddingToken.symbol} amount required per order`}
        value={minBuyAmountPerOrder}
        isLoading={false}
      />
      <HorizontalInfo
        header={`Minimum ${prevStageParams?.biddingToken.symbol} required to raise (For auction not to be cancelled)`}
        value={minFundingThreshold}
        isLoading={false}
      />

      {error && (
        <InterTypography style={{ color: theme.linkColor as string }}>
          {error}
        </InterTypography>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
        }}
      >
        <Button
          disabled={disabled}
          height="40px"
          fontSize="16px"
          variant="primary"
          onClickFn={() =>
            setStage({
              stage: 2,
              stageParams: {
                ...stageInfo?.stageParams,
                sellAmountBN,
                minFundingThresholdBN,
                minBuyAmountPerOrderBN,
                minBuyAmountBN,
              },
            })
          }
        >
          {!disabled ? "Next" : "Invalid Params"}
        </Button>
        <Button
          height="40px"
          fontSize="16px"
          variant="secondary"
          onClickFn={() => setStage({ ...stageInfo, stage: 0 })}
        >
          {"Back"}
        </Button>
      </div>
    </>
  );
}
