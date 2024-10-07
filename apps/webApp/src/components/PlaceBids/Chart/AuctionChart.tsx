import React from "react";
import { AnimatedAreaSeries, XYChart, Tooltip } from "@visx/xychart";
import { GradientTealBlue } from "@visx/gradient";
import { scaleLinear } from "@visx/scale";
import { max } from "d3-array";
import { PatternLines } from "@visx/pattern";
import { GlyphCross } from "@visx/glyph";
import InterTypography from "../../InterTypography";
import HorizontalInfo from "../../HorizontalInfo";
import { MinimalAuctionOrder } from "shared/types/auction";
import { useAuctionChartingData } from "../../../functions/orderBookUtils";
import { compactCurrency, pSBC } from "../../../utils";
import { utils } from "ethers";
import { useThemeParams } from "@tma.js/sdk-react";

const chartSeparation = 30;
export const accentColor = "#f6acc8";
export const background = "#584153";
export const background2 = "#af8baf";

const accessors = {
  xAccessor: (d: any): number => d.x,
  yAccessor: (d: any): number => d.y,
};

const tooltipAccessors = {
  numBidsAccessor: (d: any): number => d.numBids,
  volumeAccessor: (d: any): number => d.volume,
  labelAccessor: (d: any): number => d.label,
};

type AuctionChartProps = {
  width: number;
  height: number;
  compact: boolean;
  userPricePoint?: MinimalAuctionOrder;
  chainId: number;
  auctionId: string;
};

const AuctionChart = ({
  width,
  height,
  compact,
  userPricePoint,
  chainId,
  auctionId,
}: AuctionChartProps) => {
  const theme = useThemeParams();

  width = width + 100;
  height = height;
  const innerHeight = height;
  const topChartBottomMargin = compact
    ? chartSeparation / 2
    : chartSeparation + 10;
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;

  // bounds
  const xMax = Math.max(width, 0);
  const yMax = Math.max(topChartHeight, 0);

  const { clearingPriceX, accumulatedBids, clearingPrice } =
    useAuctionChartingData(chainId, auctionId, userPricePoint);

  console.log(clearingPrice.toString());

  const xScale = scaleLinear<number>({
    range: [0, xMax],
    domain: [0, max(accumulatedBids, (d) => d.x) || 0],
    nice: true,
  });

  return (
    <div
    // sx={{ margin: -100, position: 'relative', left: '-50px' }}
    >
      <XYChart
        height={height}
        width={width}
        xScale={{ type: "linear" }}
        yScale={{ type: "linear" }}
      >
        <GradientTealBlue id="stacked-area-blued" />

        <line // vertical line
          x1={xScale(clearingPriceX)}
          x2={xScale(clearingPriceX)}
          y1={yMax + 50}
          y2={0}
          stroke="white"
          strokeWidth={1.5}
          strokeDasharray={4}
        />
        <PatternLines
          id={"checkedGreen"}
          height={10}
          width={10}
          stroke={"#2f9e49"}
          strokeWidth={1}
          orientation={["vertical", "horizontal"]}
        />
        <rect
          fill={`url(#checkedGreen)`}
          x={width / 2 + 5}
          y={-50}
          width={width / 2 - 50}
          height={height}
          rx={14}
          opacity={0.125}
          color="green"
        />

        <PatternLines
          id={"checkedRed"}
          height={10}
          width={10}
          stroke={"#9e2f3d"}
          strokeWidth={1}
          orientation={["vertical", "horizontal"]}
        />
        <rect
          fill={`url(#checkedRed)`}
          x={45}
          y={-50}
          width={width / 2 - 50}
          height={height}
          rx={14}
          opacity={0.25}
          //   color="green"
        />

        <AnimatedAreaSeries
          dataKey="Asks"
          data={accumulatedBids}
          fill="url(#stacked-area-blued)"
          opacity={0.5}
          {...accessors}
        />
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          showVerticalCrosshair
          showSeriesGlyphs
          renderTooltip={({ tooltipData, colorScale }) => (
            <div
              style={{
                background: pSBC(
                  -0.5,
                  theme.backgroundColor as string
                ) as string,
              }}
            >
              <InterTypography style={{ color: "white" }}>
                {tooltipAccessors.labelAccessor(
                  tooltipData?.nearestDatum?.datum
                )}
              </InterTypography>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <HorizontalInfo
                  header="Num. Bids"
                  value={compactCurrency(
                    tooltipAccessors.numBidsAccessor(
                      tooltipData?.nearestDatum?.datum
                    ),
                    0
                  )}
                />
                <HorizontalInfo
                  header="Total Volume"
                  value={`${compactCurrency(
                    tooltipAccessors.volumeAccessor(
                      tooltipData?.nearestDatum?.datum
                    )
                  )} ETH`}
                />
              </div>
            </div>
          )}
        />
        {userPricePoint && (
          <>
            <GlyphCross
              key={`user-point`}
              className="dot"
              left={xScale(
                userPricePoint.price.gte(clearingPrice) ? 0.75 : 0.25
              )}
              top={height / 2}
              style={{ transform: "rotate(45deg)" }}
              r={2}
              fill={userPricePoint.price.gte(clearingPrice) ? "green" : "red"}
              stroke="black"
            />
          </>
        )}
      </XYChart>
    </div>
  );
};

export default AuctionChart;
