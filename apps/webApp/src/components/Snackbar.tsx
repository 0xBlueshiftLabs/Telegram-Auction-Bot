import React, { useEffect } from "react";
import {
  useCloseSnackbarDispatch,
  useSnackbarInfo,
} from "../context/SnackbarContext";
import InterTypography from "./InterTypography";
import { useThemeParams } from "@tma.js/sdk-react";
import { pSBC } from "../utils";
import { IoMdClose } from "react-icons/io";

const snackbarStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "0px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#333",
  color: "white",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  transition: "opacity 0.3s ease-in-out",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  borderRadius: "5px",
  padding: "10px",
  width: "calc(100% - 20px)",
  opacity: "1",
};

const Snackbar = () => {
  const theme = useThemeParams();

  const snackbarData = useSnackbarInfo();

  const open = snackbarData.open;
  const header = snackbarData.type;
  const message = snackbarData.message;
  const duration = snackbarData.duration;
  const onClose = useCloseSnackbarDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        ...snackbarStyle,
        backgroundColor: pSBC(-0.8, theme.backgroundColor as string) as string,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <InterTypography
          style={{
            color: theme.buttonColor,
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {header ?? "Info"}
        </InterTypography>
        <IoMdClose
          onClick={onClose}
          style={{ color: theme.hintColor as string, cursor: "pointer" }}
        />
      </div>
      <InterTypography style={{ color: theme.textColor, fontSize: "12px" }}>
        {message ?? "Success"}
      </InterTypography>
    </div>
  );
};

export default Snackbar;
