import React, { PropsWithChildren, ReactNode } from "react";
import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import { pSBC } from "../utils";
import { useThemeParams } from "@tma.js/sdk-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ListItemLoader } from "../components/Loaders/ListItemLoader";
import InterTypography from "./InterTypography";
interface ListProps {
  data: any[];
  renderVirtualItem: (virtualItem: VirtualItem) => ReactNode;
  onClickFn: (item: any) => void;
  isLoading: boolean;
  emptyText?: string;
}

const LoaderWrapper = ({ children }: PropsWithChildren) => {
  const params = useThemeParams();

  return (
    <div
      style={{
        backgroundColor: pSBC(-0.5, params.backgroundColor as string) as string,
        marginTop: "10px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        position: "relative",
        width: "calc(100%)",
        zIndex: 5,
        height: "300px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default function List({
  data,
  renderVirtualItem,
  onClickFn,
  isLoading = false,
  emptyText = "No records found",
}: ListProps) {
  const params = useThemeParams();

  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    estimateSize: () => 100,
    getScrollElement: () => parentRef.current,
  });

  const items = rowVirtualizer.getVirtualItems();

  return (
    <SkeletonTheme baseColor="red" highlightColor="red">
      <div
        ref={(ref) => (parentRef.current = ref)}
        style={{
          width: "calc(100vw)",
          position: "relative",
          height: "calc(100%)",
          overflowY: "auto",
          contain: "strict",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            top: 0,
            left: "0px",
            width: "calc(100% - 45px)",
            transform: `translateY(${items?.[0] ? items?.[0].start : 0}px)`,
            height: "max-content",
          }}
        >
          {isLoading ? (
            <>
              {[1, 2].map((virtualItem, index) => (
                <LoaderWrapper key={index}>
                  <ListItemLoader width={1000} height={300} />
                </LoaderWrapper>
              ))}
            </>
          ) : data.length === 0 ? (
            <div
              style={{
                height: "calc(100vh - 100px)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <InterTypography style={{ margin: "auto" }}>
                {emptyText}
              </InterTypography>
            </div>
          ) : (
            items.map((virtualItem) => (
              <div
                onClick={() => onClickFn(virtualItem.index)}
                ref={rowVirtualizer.measureElement}
                data-index={virtualItem.index}
                key={virtualItem.key}
                style={{
                  padding: "10px",
                  backgroundColor: pSBC(
                    -0.5,
                    params.backgroundColor as string
                  ) as string,
                  marginTop: "10px",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "10px",
                  position: "relative",
                  width: "calc(100% - 20px)",
                  zIndex: 5,
                }}
              >
                {renderVirtualItem(virtualItem)}
              </div>
            ))
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
}
