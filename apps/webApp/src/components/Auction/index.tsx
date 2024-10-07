import React from "react";
import InterTypography from "../InterTypography";
import { MenuItem } from "../MenuItem";
import { Metrics } from "../Metrics";
import { AuctionHeader } from "./AuctionHeader";
import { useTGRouter } from "../../context/PageContext";
import { useAuctionInfo } from "../../hooks/useAuctionInfo";
import { useUserDetails } from "../../hooks/useUserDetails";
import { BounceLoader } from "react-spinners";
import { useThemeParams } from "@tma.js/sdk-react";

interface AuctionProps {
  auctionId: string;
}

export function Auction({ auctionId }: AuctionProps) {
  const tgRouter = useTGRouter();

  const { data } = useUserDetails();

  const params = useThemeParams();

  const { data: auctionInfo, isValidating } = useAuctionInfo(
    auctionId,
    data?.chainId as number
  );

  const owner =
    auctionInfo.createdBy.toLowerCase() ===
    (data?.account ?? "-").toLowerCase();

  const onClickView = () => {
    tgRouter(`Bids`, { auctionId });
  };

  const onClickPlace = () => {
    tgRouter(`PlaceBid`, { auctionId });
  };

  const onClickRef = () => {
    tgRouter(`ReferralRewards`, { auctionId });
  };

  const onClickNotify = () => {
    tgRouter(`NotifyService`, { auctionId });
  };

  return (
    <div
      style={{
        width: "calc(100vw - 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        paddingBottom: "20px",
        gap: "10px",
        margin: "auto",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {isValidating ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 140px)",
          }}
        >
          <BounceLoader
            color={params.buttonColor as string}
            loading={true}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <InterTypography>Loading Auction Details</InterTypography>
        </div>
      ) : auctionInfo.auctionEndDate === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 140px)",
          }}
        >
          <InterTypography>Invalid Auction</InterTypography>
        </div>
      ) : (
        <>
          <AuctionHeader auctionId={auctionId} />
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <MenuItem onClick={onClickView}>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                View Bids
              </InterTypography>
            </MenuItem>
            <MenuItem onClick={onClickPlace}>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Place Bids
              </InterTypography>
            </MenuItem>
            <MenuItem onClick={onClickRef}>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Referral Rewards
              </InterTypography>
            </MenuItem>
            <MenuItem>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Auction Claim
              </InterTypography>
            </MenuItem>
            {owner && (
              <MenuItem onClick={onClickNotify}>
                <InterTypography
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Notify Service
                </InterTypography>
              </MenuItem>
            )}
          </div>
          <Metrics auctionId={auctionId} />
        </>
      )}
    </div>
  );
}
