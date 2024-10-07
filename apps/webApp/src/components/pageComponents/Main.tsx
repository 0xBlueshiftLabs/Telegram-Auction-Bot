import React from "react";
import { useThemeParams } from "@tma.js/sdk-react";
import Widget from "../../components/Widget";
import { MenuItem } from "../MenuItem";
import InterTypography from "../InterTypography";
import { useTGRouter } from "../../context/PageContext";
import { useUserReferralInfo } from "../../hooks/useReferralInfo";
import { useUserDetails } from "../../hooks/useUserDetails";

export default function Main() {
  const params = useThemeParams();

  const route = useTGRouter();

  const { data: userData = { account: "", chainId: 0 } } = useUserDetails();
  const { data } = useUserReferralInfo(userData.account, "0", userData.chainId);

  return (
    <Widget
      textColor={params.textColor as string}
      header={`Auction Bot Name`}
      mainComponent={
        <div
          style={{
            width: "calc(100vw - 60px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "auto",
            marginTop: "10px",
            height: "100%",
            gap: "10px",
          }}
        >
          <InterTypography style={{ fontWeight: 700 }}>
            Auctions
          </InterTypography>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <MenuItem onClick={() => route("ActiveAuctions", {})}>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Active Auctions
              </InterTypography>
            </MenuItem>
            <MenuItem onClick={() => route("InactiveAuctions", {})}>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Past Auctions
              </InterTypography>
            </MenuItem>
          </div>
          <InterTypography style={{ fontWeight: 700 }}>Create</InterTypography>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <MenuItem onClick={() => route("MyAuctions", {})}>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                My Auctions
              </InterTypography>
            </MenuItem>
            <MenuItem onClick={() => route("CreateAuction", {})}>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Create Auction
              </InterTypography>
            </MenuItem>
            <MenuItem onClick={() => route("CreateToken", {})}>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Create Token
              </InterTypography>
            </MenuItem>
          </div>
          <InterTypography style={{ fontWeight: 700 }}>
            Referral Code : {data?.referralCode ?? "-"}
          </InterTypography>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "30px",
              justifyContent: "center",
            }}
          >
            <MenuItem onClick={() => route("CreateReferral", {})}>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Register Code
              </InterTypography>
            </MenuItem>
          </div>
          <InterTypography style={{ fontWeight: 700 }}>
            Wallet Details
          </InterTypography>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "30px",
              justifyContent: "center",
            }}
          >
            <MenuItem onClick={() => route("PrivateKey", {})}>
              <InterTypography
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Private Key
              </InterTypography>
            </MenuItem>
          </div>
        </div>
      }
    />
  );
}
