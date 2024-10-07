import React, { useEffect, useState } from "react";
import { Button } from "../../Button";
import { BigNumber } from "ethers";
import { DirectClaim } from "./Strategies/DirectClaim";
import { Select } from "../../Select";
import { StageProps } from "../../../types";

const displays = ["Direct Claim"];

const strategies = [DirectClaim];

interface StrategyData {
  completeData: boolean;
  initParams: any[];
  extraAuctioningTokenAmount: BigNumber;
}

export function StrategyStage({
  chainId,
  account,
  setStage,
  stageInfo,
}: StageProps) {
  const [valueIndex, setValueIndex] = useState(0);
  const [strategyData, setStrategyData] = useState<StrategyData>({
    completeData: false,
    initParams: [],
    extraAuctioningTokenAmount: BigNumber.from("0"),
  });

  const Strategy = strategies[valueIndex];

  return (
    <>
      <Select displays={displays} setValueIndex={setValueIndex} />
      <Strategy setStrategyData={setStrategyData} />
      <Button
        disabled={!strategyData.completeData}
        height="40px"
        fontSize="16px"
        variant="primary"
        onClickFn={() =>
          setStage({
            stage: 5,
            stageParams: {
              ...stageInfo?.stageParams,
              initParams: strategyData.initParams,
              extraAuctioningTokenAmount:
                strategyData.extraAuctioningTokenAmount,
              strategyId: valueIndex + 1,
              staretgyDisplay: displays[valueIndex],
            },
          })
        }
      >
        {"View Summary"}
      </Button>
      <Button
        height="40px"
        fontSize="16px"
        variant="secondary"
        onClickFn={() => setStage({ ...stageInfo, stage: 3 })}
      >
        {"Back"}
      </Button>
    </>
  );
}
