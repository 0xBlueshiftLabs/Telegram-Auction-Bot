import React from "react";
import { ReactNode } from "react";
import InterTypography from "../InterTypography";
import { useUserDetails } from "../../hooks/useUserDetails";
import { BounceLoader } from "react-spinners";
import { AccountBar } from "./AccountBar";
import { useThemeParams } from "@tma.js/sdk-react";
import { AiOutlineArrowLeft } from "react-icons/ai";

interface WidgetProps {
  header: string;
  subHeaderComponent?: ReactNode;
  mainComponent: ReactNode;
  textColor: string;
  backFunction?: () => void;
}

export default function Widget({
  header,
  subHeaderComponent,
  mainComponent,
  textColor,
  backFunction,
}: WidgetProps) {
  const params = useThemeParams();
  const { isValidating, error } = useUserDetails();

  return (
    <div
      style={{
        width: "100vw",
        height: "calc(100vh - 5px)",
        color: textColor,
        paddingTop: "5px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          height: "fit-content",
          textAlign: "center",
          width: "100vw",
          boxShadow: "0px 9px 15px -12px black",
          zIndex: "1",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
          alignItems: "center",
          paddingBottom: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "calc(100% - 20px)",
            alignItems: "center",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          {backFunction && (
            <AiOutlineArrowLeft
              onClick={backFunction}
              style={{ cursor: "pointer" }}
              size={20}
            />
          )}
          <InterTypography
            style={{
              fontSize: "16px",
              textAlign: "center",
              width: "100%",
            }}
          >
            {header}
          </InterTypography>
          {backFunction && (
            <AiOutlineArrowLeft size={20} style={{ visibility: "hidden" }} />
          )}
        </div>
        {subHeaderComponent}
      </div>
      <AccountBar />
      <div style={{ flex: "1", overflowX: "hidden" }}>
        {isValidating ? (
          <>
            <div
              style={{
                height: "calc(100vh - 80px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BounceLoader
                color={params.buttonColor as string}
                loading={true}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <InterTypography>Initializing</InterTypography>
            </div>
          </>
        ) : error ? (
          <div
            style={{
              minHeight: "calc(100vh - 120px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <InterTypography>
              An error occured, please restart the app
            </InterTypography>
          </div>
        ) : (
          mainComponent
        )}
      </div>
    </div>
  );
}
