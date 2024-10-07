import React, { useEffect } from "react";
import InterTypography from "../../../InterTypography";
import { useThemeParams } from "@tma.js/sdk-react";
import { BigNumber } from "ethers";

export const validationFn = () => {
  return true;
};

interface DirectClaimProps {
  setStrategyData: React.Dispatch<React.SetStateAction<StrategyData>>;
}

interface StrategyData {
  completeData: boolean;
  initParams: any[];
  extraAuctioningTokenAmount: BigNumber;
}

export function DirectClaim({ setStrategyData }: DirectClaimProps) {
  const theme = useThemeParams();

  useEffect(() => {
    setStrategyData({
      completeData: true,
      initParams: [],
      extraAuctioningTokenAmount: BigNumber.from("0"),
    });
  }, [setStrategyData]);

  return (
    <>
      <InterTypography
        style={{
          color: theme.textColor as string,
        }}
      >
        This strategy enables users to direct claim their whole token amount
        after the auction
      </InterTypography>
    </>
  );
}
