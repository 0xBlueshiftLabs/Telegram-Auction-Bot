import { useThemeParams } from "@tma.js/sdk-react";
import React, { ReactNode, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";

interface ButtonProps {
  variant?: "primary" | "secondary";
  children: ReactNode;
  onClickFn?: () => void;
  disabled?: boolean;
  showLoader?: boolean;
  height?: string;
  fontSize?: string;
}

export function Button({
  children,
  variant = "primary",
  onClickFn,
  disabled = false,
  showLoader = false,
  height = "30px",
  fontSize = "12px",
}: ButtonProps) {
  const theme = useThemeParams();

  const [hover, setHover] = useState(false);

  const { color, bg, border } = useMemo(() => {
    return hover
      ? {
          color:
            variant === "primary" ? theme.buttonColor : theme.buttonTextColor,
          bg: variant === "primary" ? theme.buttonTextColor : theme.buttonColor,
          border: `2px ${theme.buttonColor} solid`,
        }
      : {
          color:
            variant === "primary" ? theme.buttonTextColor : theme.buttonColor,
          bg: variant === "primary" ? theme.buttonColor : "transparent",
          border: `2px ${theme.buttonColor} solid`,
        };
  }, [variant, theme, hover, disabled, showLoader]);

  return (
    <button
      disabled={disabled || showLoader}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      onClick={onClickFn}
      style={{
        width: "100%",
        fontWeight: 800,
        fontSize: fontSize,
        height: height,
        border: border,
        borderRadius: "5px",
        color: color as string,
        background: bg as string,
        cursor: disabled || showLoader ? "initial" : "pointer",
        position: "relative",
      }}
    >
      {(disabled || showLoader) && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.2)",
            position: "absolute",
            top: "-2px",
            left: "-2px",
            borderRadius: "3px",
            border: "2px rgba(255,255,255,0.2) solid",
          }}
        ></div>
      )}
      {showLoader ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ClipLoader
            color={color as string}
            loading={true}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
