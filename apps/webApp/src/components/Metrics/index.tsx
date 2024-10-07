import React, { useState } from "react";
import { pSBC } from "../../utils";
import { useThemeParams } from "@tma.js/sdk-react";
import InterTypography from "../InterTypography";
import { ItemSelect } from "../ItemSelect";
import OrderBook from "./Chart";
import { Table } from "./Table";
import { AuctionInfo } from "shared/types/auction";
import { useUserDetails } from "../../hooks/useUserDetails";

interface MetricProps {
  auctionId: string;
  sellAmount?: string;
  pricePerToken?: string;
  auctionInfo?: AuctionInfo;
  errorString?: string;
}

export function Metrics({
  auctionId,
  sellAmount,
  pricePerToken,
  auctionInfo,
  errorString,
}: MetricProps) {
  const [selectedMetric, setSelectedMetric] = useState("Chart");

  const theme = useThemeParams();

  const { data } = useUserDetails();

  return (
    <div
      style={{
        background: pSBC(-0.5, theme.backgroundColor as string) as string,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "calc(100vw - 80px)",
        padding: "10px",
        position: "relative",
        borderRadius: "5px",
        gap: "10px",
      }}
    >
      <InterTypography style={{ fontSize: "16px", fontWeight: 700 }}>
        Auction metrics
      </InterTypography>
      <ItemSelect
        selectedItem={selectedMetric}
        setSelectedItem={setSelectedMetric}
        items={["Chart", "Orderbook"]}
      />
      {selectedMetric === "Chart" ? (
        <OrderBook
          sellAmount={sellAmount}
          pricePerToken={pricePerToken}
          auctionId={auctionId}
          chainId={data?.chainId as number}
          biddingTokenDecimals={auctionInfo?.biddingToken?.decimals}
          auctioningTokenDecimals={auctionInfo?.auctioningToken?.decimals}
          error={errorString !== undefined}
        />
      ) : (
        <Table
          auctionId={auctionId}
          account={data?.account as string}
          chainId={data?.chainId as number}
        />
      )}
    </div>
  );
}
