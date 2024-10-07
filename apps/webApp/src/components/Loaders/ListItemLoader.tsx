import { useThemeParams } from "@tma.js/sdk-react";
import React from "react";
import ContentLoader from "react-content-loader";
import { pSBC } from "../../utils";

interface ListItemLoaderProps {
  width: number;
  height: number;
  [key: string]: any;
}

export const ListItemLoader: React.FC<ListItemLoaderProps> = ({
  width,
  height,
  ...props
}) => {
  const theme = useThemeParams();

  return (
    <ContentLoader
      backgroundColor={pSBC(-0.5, theme.backgroundColor as string) as string}
      foregroundColor={theme.backgroundColor as string}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      {...props}
    >
      <rect x="0" y="0" rx="5" ry="5" width={width} height={height} />
    </ContentLoader>
  );
};
