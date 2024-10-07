import React from "react";
import { useEffect, useState, useRef } from "react";
import InterTypography from "./InterTypography";
import { useThemeParams } from "@tma.js/sdk-react";

interface TimedCircularProgressWithLabelProps {
  header: string;
  endTimestamp: number;
  startTimestamp: number;
}

function dateDiffToString(b: number, a: number) {
  let diff = a - b;

  if (diff < 0) return "00:00:00:00";

  const ms = diff % 1000;
  diff = (diff - ms) / 1000;
  const ss = diff % 60;
  diff = (diff - ss) / 60;
  const mm = diff % 60;
  diff = (diff - mm) / 60;
  const hh = diff % 24;
  const days = (diff - hh) / 24;

  return days + ":" + hh + ":" + mm + ":" + ss;
}

const endedTimestamp = "0:0:0:0";
function TimedCircularProgressWithLabel({
  header,
  endTimestamp,
  startTimestamp,
}: TimedCircularProgressWithLabelProps) {
  const intervalHandler = useRef<any>();
  const [todaysDate, setTodaysDate] = useState(0);

  useEffect(() => {
    intervalHandler.current = setInterval(() => {
      setTodaysDate(Date.now());
    }, 1000);
    return () => {
      if (intervalHandler.current) clearInterval(intervalHandler.current);
    };
  }, []);

  endTimestamp = endTimestamp * 1000;

  useEffect(() => {
    if (endTimestamp - todaysDate < 0) {
      setTodaysDate(endTimestamp);
      if (intervalHandler.current) clearInterval(intervalHandler.current);
    }
  }, [endTimestamp, todaysDate, intervalHandler]);

  const formattedTimestamp = dateDiffToString(todaysDate, endTimestamp);

  let progress = React.useMemo(() => {
    const msStartTimestamp = startTimestamp * 1000;
    let progress =
      ((endTimestamp - todaysDate) / (endTimestamp - msStartTimestamp)) * 100;

    if (progress < 0) progress = 0;

    return 100 - progress;
  }, [endTimestamp, todaysDate, startTimestamp]);

  const theme = useThemeParams();
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        color: theme.textColor as string,
      }}
    >
      <div style={{ position: "relative" }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <InterTypography style={{ fontWeight: 700 }}>
          {formattedTimestamp === endedTimestamp ? "Auction Ended" : header}
        </InterTypography>
        {formattedTimestamp === endedTimestamp ? (
          <></>
        ) : (
          <InterTypography style={{ fontWeight: 700 }}>
            {formattedTimestamp}
          </InterTypography>
        )}
      </div>
    </div>
  );
}

export default TimedCircularProgressWithLabel;
