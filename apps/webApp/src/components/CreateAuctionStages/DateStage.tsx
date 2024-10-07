import React, { useState } from "react";
import Input from "../Input";
import { Button } from "../Button";
import "react-datepicker/dist/react-datepicker.css";
import { useThemeParams } from "@tma.js/sdk-react";
import { CustomDatePicker } from "../DatePicker";
import InterTypography from "../InterTypography";
import { StageProps } from "../../types";

const getTmrw = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow;
};

export function DateStage({
  chainId,
  account,
  setStage,
  stageInfo,
}: StageProps) {
  const theme = useThemeParams();

  const [auctionEndDate, setAuctionEndDate] = useState<Date>(getTmrw());
  const [orderCancellationEndDate, setOrderCancellationEndDate] =
    useState<Date>(new Date());

  const auctionEndTimestamp = auctionEndDate.getTime() / 1000;
  const orderCancellationEndTimestamp =
    orderCancellationEndDate.getTime() / 1000;

  const invalidParams =
    auctionEndTimestamp <= orderCancellationEndTimestamp
      ? "Auction cannot end before order cancellation end"
      : undefined;
  const invalidEnd =
    auctionEndTimestamp <= new Date().getTime() / 1000
      ? "Auction cannot end on the same day"
      : undefined;

  const error = invalidParams || invalidEnd;

  return (
    <>
      <CustomDatePicker
        header="Auction End Date"
        date={auctionEndDate}
        setDate={setAuctionEndDate}
      />
      <CustomDatePicker
        header="Order Cancellation End Date"
        date={orderCancellationEndDate}
        setDate={setOrderCancellationEndDate}
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
          disabled={Boolean(error)}
          height="40px"
          fontSize="16px"
          variant="primary"
          onClickFn={() =>
            setStage({
              stage: 3,
              stageParams: {
                ...stageInfo?.stageParams,
                auctionEndTimestamp,
                orderCancellationEndTimestamp,
              },
            })
          }
        >
          {!Boolean(error) ? "Next" : "Invalid Params"}
        </Button>
        <Button
          height="40px"
          fontSize="16px"
          variant="secondary"
          onClickFn={() => setStage({ ...stageInfo, stage: 1 })}
        >
          {"Back"}
        </Button>
      </div>
    </>
  );
}
