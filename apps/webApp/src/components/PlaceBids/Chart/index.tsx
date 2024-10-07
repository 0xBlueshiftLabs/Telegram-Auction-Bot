import React from "react";
import AuctionChart from "./AuctionChart";
import { ParentSize } from "@visx/responsive";
import { useMemo } from "react";
import { MinimalAuctionOrder } from "shared/types/auction";
import { utils } from "ethers";
import InterTypography from "../../InterTypography";
import { isNumber } from "../../../utils";
import { IoMdClose } from "react-icons/io";

type OrderbookProps = {
  sellAmount: string | undefined;
  pricePerToken: string | undefined;
  auctionId: string;
  chainId: number;
  biddingTokenDecimals?: number;
  auctioningTokenDecimals?: number;
  error: boolean;
};

function OrderBook({
  sellAmount,
  pricePerToken,
  auctionId,
  chainId,
  biddingTokenDecimals,
  auctioningTokenDecimals,
  error,
}: OrderbookProps) {
  const userPricePoint: MinimalAuctionOrder | undefined = useMemo(() => {
    if (!biddingTokenDecimals || !auctioningTokenDecimals || error) return;
    if (sellAmount && pricePerToken) {
      if (isNumber(sellAmount) && isNumber(pricePerToken)) {
        return {
          price: utils.parseEther(pricePerToken),
          sellAmount: utils.parseUnits(sellAmount, biddingTokenDecimals),
          buyAmount: utils
            .parseUnits(sellAmount, biddingTokenDecimals)
            .mul(utils.parseUnits("1", 18))
            .div(utils.parseUnits(pricePerToken, 18)),
          auctionUser: "0",
        };
      }
    }
  }, [
    sellAmount,
    pricePerToken,
    biddingTokenDecimals,
    auctioningTokenDecimals,
    error,
  ]);

  return (
    <>
      <ParentSize style={{ padding: "0", marginBottom: -40 }}>
        {(parent) => (
          <AuctionChart
            userPricePoint={userPricePoint}
            width={250}
            height={300}
            compact={false}
            auctionId={auctionId}
            chainId={chainId}
          />
        )}
      </ParentSize>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "12px",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <svg width={15} height={15}>
            <rect
              x={0}
              y={0}
              width={15}
              height={20}
              fill="white"
              opacity={0.25}
            />
            <line // vertical line
              x1={0}
              x2={15}
              y1={0}
              y2={0}
              stroke="white"
              strokeWidth={1.5}
              strokeDasharray={2}
            />
          </svg>
          <InterTypography>Clearing price</InterTypography>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <svg width={15} height={15}>
            <rect
              x={0}
              y={0}
              width={15}
              height={20}
              fill="red"
              opacity={0.25}
            />
            <line // vertical line
              x1={0}
              x2={15}
              y1={0}
              y2={0}
              stroke="red"
              strokeWidth={1.5}
              strokeDasharray={2}
            />
          </svg>
          <InterTypography>Losing Range</InterTypography>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <svg width={15} height={15}>
            <rect
              x={0}
              y={0}
              width={15}
              height={20}
              fill="green"
              opacity={0.25}
            />
            <line // vertical line
              x1={0}
              x2={15}
              y1={0}
              y2={0}
              stroke="green"
              strokeWidth={1.5}
              strokeDasharray={2}
            />
          </svg>
          <InterTypography>Winning Range</InterTypography>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <IoMdClose />
          <InterTypography>Your pending bid</InterTypography>
        </div>
      </div>
      <div style={{ padding: "10px" }}>
        <InterTypography>
          * Note : The chart shows bid information irrespective of the minimum
          threshold being reached
        </InterTypography>
        <br />
        <InterTypography>
          ** Note : The clearing price will change throughout the auction, so
          your order might not win even though it might currently be a winning
          bid
        </InterTypography>
      </div>
    </>
  );
}

export default OrderBook;
