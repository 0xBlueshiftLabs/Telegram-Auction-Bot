import React, { ReactNode } from "react";
import { Token } from "../types";
import { useThemeParams } from "@tma.js/sdk-react";
import { pSBC } from "../utils";
import InterTypography from "./InterTypography";

interface InputProps {
  value?: string;
  setValue: (val: string) => void;
  token?: Token;
  width?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  placeholder?: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  variant?: "input" | "textArea";
}

export default function Input({
  value,
  setValue,
  token,
  width,
  startAdornment,
  endAdornment,
  placeholder,
  label,
  type = "text",
  disabled = false,
  variant = "input",
  ...props
}: InputProps) {
  const params = useThemeParams();

  const inputBg = pSBC(-0.5, params.backgroundColor as string) as string;

  return (
    <div>
      {label && (
        <InterTypography
          style={{
            fontSize: "12px",
            width: "100%",
            marginBottom: "5px",
            display: "block",
          }}
        >
          {label}
        </InterTypography>
      )}
      <form
        style={{
          width: width ?? "calc(100vw - 60px)",
          background: inputBg,
          color: params.textColor as string,
          borderRadius: "5px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        {startAdornment}
        {variant === "input" ? (
          <input
            placeholder={placeholder}
            style={{
              outline: "none",
              width: "100%",
              height: "35px",
              borderRadius: "5px",
              background: inputBg,
              color: params.textColor as string,
              border: "none",
              fontSize: "15px",
              flex: "1",
              ...props,
            }}
            disabled={disabled}
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></input>
        ) : (
          <textarea
            placeholder={placeholder}
            style={{
              outline: "none",
              width: "100%",
              minHeight: "70px",
              borderRadius: "5px",
              background: inputBg,
              color: params.textColor as string,
              border: "none",
              fontSize: "15px",
              flex: "1",
              ...props,
            }}
            disabled={disabled}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
        )}
        {endAdornment}
      </form>
    </div>
  );
}
