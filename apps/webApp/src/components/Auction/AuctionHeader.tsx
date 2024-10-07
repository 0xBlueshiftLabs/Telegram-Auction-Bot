import React, { useEffect } from "react";

import TimedCircularProgressWithLabel from "../TimedCircularProgressWithLabel";
import { useAuctionInfo } from "../../hooks/useAuctionInfo";
import { useUserDetails } from "../../hooks/useUserDetails";
import { useClearingPrice } from "../../functions/orderBookUtils";
import InterTypography from "../InterTypography";
import { BigNumber, utils } from "ethers";
import { compactCurrency, pSBC } from "../../utils";
import { useThemeParams } from "@tma.js/sdk-react";

interface AuctionHeaderProps {
  auctionId: string;
}

export function AuctionHeader({ auctionId }: AuctionHeaderProps) {
  const { data } = useUserDetails();

  const theme = useThemeParams();

  const { data: auctionInfo } = useAuctionInfo(
    auctionId,
    data?.chainId as number
  );
  const { data: clearingPrice } = useClearingPrice(
    undefined,
    data?.chainId as number,
    auctionId
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "0",
        background: pSBC(-0.5, theme.backgroundColor as string) as string,
        borderRadius: "5px",
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
    >
      <div style={{ position: "relative", height: "10px" }}>
        <TimedCircularProgressWithLabel
          header={"Ends in"}
          endTimestamp={auctionInfo.auctionEndDate}
          startTimestamp={auctionInfo.auctionStartDate}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "calc(100% - 48px)",
          alignItems: "center",
          marginTop: "40px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", width: "110px" }}
        >
          <InterTypography style={{ fontWeight: 800, fontSize: "14px" }}>
            Total {auctionInfo.auctioningToken?.symbol}
          </InterTypography>
          <InterTypography style={{ fontSize: "12px" }}>
            {`${compactCurrency(
              utils.formatUnits(
                auctionInfo.initialAuctionOrder?.sellAmount ?? "0",
                auctionInfo.auctioningToken?.decimals
              )
            )}`}
          </InterTypography>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", width: "110px" }}
        >
          <InterTypography style={{ fontWeight: 800, fontSize: "14px" }}>
            Bidding with
          </InterTypography>
          <InterTypography style={{ fontSize: "12px" }}>
            {auctionInfo.biddingToken?.symbol}
          </InterTypography>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", width: "110px" }}
        >
          <InterTypography style={{ fontWeight: 800, fontSize: "14px" }}>
            Current Price
          </InterTypography>
          <InterTypography style={{ fontSize: "12px" }}>
            {`${compactCurrency(
              utils.formatUnits(
                clearingPrice,
                auctionInfo.biddingToken?.decimals
              )
            )} ${auctionInfo.biddingToken?.symbol}`}
          </InterTypography>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", width: "110px" }}
        >
          <InterTypography style={{ fontWeight: 800, fontSize: "14px" }}>
            Min. sell price
          </InterTypography>
          <InterTypography style={{ fontSize: "12px" }}>
            {`${compactCurrency(
              utils.formatUnits(
                BigNumber.from(auctionInfo.initialAuctionOrder?.price ?? "0"),
                auctionInfo.biddingToken?.decimals
              )
            )} ${auctionInfo.biddingToken?.symbol}`}
          </InterTypography>
        </div>
      </div>
    </div>
  );
}
