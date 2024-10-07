import React, { useState } from "react";
import { TokenInfoStage } from "./TokenInfoStage";
import { Summary } from "./Summary";
import InterTypography from "../InterTypography";

interface StageInfo {
  stage: number;
  stageParams: Record<string, any>;
}

const stageToComp: { [key: number]: React.ComponentType<any> } = {
  0: TokenInfoStage,
  1: Summary,
};

const stageToHeader: { [key: number]: string } = {
  0: "Select token info",
  1: "Summary",
};

interface CreateTokenStagesProps {
  account: string;
  chainId: number;
}

export function CreateTokenStages({
  account,
  chainId,
}: CreateTokenStagesProps) {
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
      <InterTypography>{`Stage ${stage + 1}/2 - ${
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
