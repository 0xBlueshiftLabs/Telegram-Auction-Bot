import React from "react";
import { useThemeParams } from "@tma.js/sdk-react";
import { pSBC } from "../utils";
import { styled } from "styled-components";

type Theme = {
  backgroundColor: string;
  textColor: string;
};

const Arrow = styled.div`
  position: absolute;
  right: 5px;

  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid red;
  top: 50%;
`;

type SelectProps = {
  displays: string[];
  setValueIndex: (value: number) => void;
};

export function Select({ displays, setValueIndex }: SelectProps) {
  const theme = useThemeParams();

  return (
    <div
      className="custom-select"
      style={{ width: "100%", position: "relative" }}
    >
      <Arrow style={{ borderTop: `5px solid ${theme.textColor as string}` }} />
      <select
        style={{
          backgroundColor: pSBC(
            -0.5,
            theme.backgroundColor as string
          ) as string,
          color: theme.textColor as string,
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          width: "100%",
          height: "40px",
          border: "none",
          cursor: "pointer",
          paddingLeft: "5px",
          paddingRight: "5px",
          fontSize: "14px",
        }}
        onChange={(e) => setValueIndex(e.target.value)}
      >
        {displays.map((_, index) => (
          <option key={index} value={index}>
            {displays[index]}
          </option>
        ))}
      </select>
    </div>
  );
}
