import React from "react";
import { useThemeParams } from "@tma.js/sdk-react";
import Widget from "../../components/Widget";
import { useTGRouter } from "../../context/PageContext";
import InterTypography from "../InterTypography";
import { usePrivateKey } from "../../hooks/usePrivateKey";

export default function PrivateKey() {
  const params = useThemeParams();

  const route = useTGRouter();

  const { data, isValidating } = usePrivateKey();

  return (
    <Widget
      backFunction={() => route("Main", {})}
      textColor={params.textColor as string}
      header={`Create New Auction`}
      mainComponent={
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
          <InterTypography
            style={{
              overflowWrap: "break-word",
              inlineSize: "calc(100vw - 60px)",
            }}
          >
            {isValidating
              ? "Loading..."
              : data
              ? data
              : "Error fetching private key"}
          </InterTypography>
        </div>
      }
    />
  );
}
