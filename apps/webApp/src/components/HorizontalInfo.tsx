import React from "react";
import { ReactNode } from "react";
import InterTypography from "./InterTypography";
import { ClipLoader } from "react-spinners";
import { useThemeParams } from "@tma.js/sdk-react";

type HorizontalInfoProps = {
  header: ReactNode;
  value: ReactNode;
  isLoading?: boolean;
};

export default function HorizontalInfo({
  header,
  value,
  isLoading = false,
}: HorizontalInfoProps) {
  const theme = useThemeParams();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          color: theme.textColor as string,
          flexDirection: "row",
          gap: "3px",
          alignItems: "center",
        }}
      >
        <InterTypography
          style={{ fontSize: "14px", color: theme.hintColor as string }}
        >
          {header}
        </InterTypography>
      </div>
      {isLoading ? (
        <ClipLoader
          color={theme.textColor as string}
          loading={true}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <InterTypography
          style={{ fontSize: "14px", color: theme.textColor as string }}
        >
          {value}
        </InterTypography>
      )}
    </div>
  );
}
