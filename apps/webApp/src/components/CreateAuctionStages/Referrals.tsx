import React, { useState } from "react";
import Input from "../Input";
import { Button } from "../Button";
import { BigNumber } from "ethers";
import InterTypography from "../InterTypography";
import { useThemeParams } from "@tma.js/sdk-react";
import { StageProps } from "../../types";

export function Referrals({
  chainId,
  account,
  setStage,
  stageInfo,
}: StageProps) {
  const theme = useThemeParams();

  const [referralAmt, setReferralAmt] = useState<string | undefined>("0");

  const isNan =
    isNaN(parseInt(referralAmt + "")) ||
    (referralAmt + "").split(".").length > 1 ||
    (referralAmt + "").split("e").length > 1;

  const referralAmtBn = !isNan ? BigNumber.from(referralAmt).mul("10") : false;

  const disabled = isNan || referralAmtBn === false;

  const error =
    referralAmtBn !== false
      ? referralAmtBn.gt("100")
        ? "Referral amount cannot exceed 10%"
        : undefined
      : undefined;

  return (
    <>
      <Input
        label="Set referral fee"
        value={referralAmt}
        setValue={(val) => setReferralAmt(val)}
        placeholder="0.0%"
        type="number"
      />

      <InterTypography style={{ color: theme.textColor as string }}>
        {
          "Note: If you don't want to enable referrals on your auction, set the fee to 0"
        }
      </InterTypography>

      {error && (
        <InterTypography style={{ color: theme.linkColor as string }}>
          {error}
        </InterTypography>
      )}

      <Button
        disabled={disabled || Boolean(error)}
        height="40px"
        fontSize="16px"
        variant="primary"
        onClickFn={() =>
          setStage({
            stage: 4,
            stageParams: {
              ...stageInfo?.stageParams,
              referralAmt: referralAmtBn as BigNumber,
            },
          })
        }
      >
        {"Next"}
      </Button>
      <Button
        height="40px"
        fontSize="16px"
        variant="secondary"
        onClickFn={() => setStage({ ...stageInfo, stage: 2 })}
      >
        {"Back"}
      </Button>
    </>
  );
}
