import React, { useState } from "react";
import { TokenStage } from "./TokenStage";
import { AmountStage } from "./AmountStage";
import { DateStage } from "./DateStage";
import { Referrals } from "./Referrals";
import { StrategyStage } from "./StrategyStage";
import { Summary } from "./Summary";
import InterTypography from "../InterTypography";

interface StageInfo {
  stage: number;
  stageParams: any;
}

const stageToComp: { [key: number]: React.ComponentType<any> } = {
  0: TokenStage,
  1: AmountStage,
  2: DateStage,
  3: Referrals,
  4: StrategyStage,
  5: Summary,
};

const stageToHeader: { [key: number]: string } = {
  0: "Select tokens",
  1: "Configure Auction",
  2: "Configure Auction Period",
  3: "Configure Referrals",
  4: "Configure Strategy",
  5: "Summary",
};

interface CreateAuctionStagesProps {
  account: string;
  chainId: number;
}

export function CreateAuctionStages({
  account,
  chainId,
}: CreateAuctionStagesProps) {
  const [stageInfo, setStageInfo] = useState<StageInfo>({
    stage: 0,
    stageParams: {},
  });
  const { stage, stageParams } = stageInfo;
  const Stage = stageToComp[stage];
  return (
    <div
      style={{
        width: "calc(100vw - 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        paddingBottom: "20px",
        gap: "20px",
        margin: "auto",
        position: "relative",
      }}
    >
      <InterTypography>{`Stage ${stage + 1}/6 - ${
        stageToHeader[stage]
      }`}</InterTypography>
      <Stage
        setStage={setStageInfo}
        prevStageParams={stageParams}
        stageInfo={stageInfo}
        account={account}
        chainId={chainId}
      />
    </div>
  );
}
