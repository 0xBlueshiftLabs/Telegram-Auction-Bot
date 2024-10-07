import { useThemeParams } from "@tma.js/sdk-react";
import React, { PropsWithChildren } from "react";
import { pSBC } from "../utils";

interface MenuItem extends PropsWithChildren {
  onClick?: () => void;
}

export function MenuItem({ children, onClick }: MenuItem) {
  const theme = useThemeParams();

  return (
    <div
      onClick={onClick}
      style={{
        background: pSBC(-0.5, theme.backgroundColor as string) as string,
        width: "calc(50% - 30px)",
        minWidth: "calc(50% - 30px)",
        padding: "10px",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
        textAlign: "center",
        flex: 1,
      }}
    >
      {children}
    </div>
  );
}
