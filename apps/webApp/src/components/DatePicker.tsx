import React, { forwardRef, useMemo, useState, ChangeEvent } from "react";
import DatePicker, {
  CalendarContainer,
  ReactDatePickerProps,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createGlobalStyle, styled } from "styled-components";
import { useThemeParams } from "@tma.js/sdk-react";
import InterTypography from "./InterTypography";
import _ from "lodash";
import { pSBC } from "../utils";

// Define the type for your theme object
type Theme = {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type MyContainerProps = {
  className: string;
  children: React.ReactNode;
  theme: Theme;
};

type CustomHeaderProps = {
  date: Date;
  changeYear(date: Date): void;
  changeMonth(date: Date): void;
  decreaseMonth(): void;
  increaseMonth(): void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  theme: Theme;
};

type CustomInputProps = {
  value: string;
  onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  theme: Theme;
};

type CustomDatePickerProps = {
  date: Date;
  setDate(date: Date): void;
  header?: string;
};

const MyContainer = ({ className, children, theme }: MyContainerProps) => {
  return (
    <div
      style={{
        background: pSBC(-0.2, theme.backgroundColor) as string,
        borderRadius: "5px",
      }}
    >
      <CalendarContainer
        className={className}
        style={{ background: "transparent" }}
      >
        <div style={{ position: "relative", background: "#f0f0f0" }}>
          {children}
        </div>
      </CalendarContainer>
    </div>
  );
};

const renderDayContents = (day: Date, date: Date, theme: Theme) => {
  return (
    <InterTypography style={{ color: theme.textColor }}>
      {new Date(date).getDate()}
    </InterTypography>
  );
};

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  theme,
}: CustomHeaderProps) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      color: theme.textColor,
    }}
  >
    <button
      className="react-datepicker__navigation react-datepicker__navigation--previous"
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
    >
      <span
        className={
          "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
        }
      >
        {"<"}
      </span>
    </button>

    <div style={{ display: "flex", gap: "5px" }}>
      <InterTypography>{new Date(date).getFullYear()}</InterTypography>
      <InterTypography>{months[new Date(date).getMonth()]}</InterTypography>
    </div>

    <button
      className="react-datepicker__navigation react-datepicker__navigation--next"
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
    >
      <span
        className={
          "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
        }
      >
        {">"}
      </span>
    </button>
  </div>
);

const CustomInput = forwardRef(
  (
    { value, onClick, theme }: CustomInputProps,
    ref: React.Ref<HTMLButtonElement>
  ) => (
    <button
      style={{
        width: "100%",
        height: "40px",
        borderRadius: "5px",
        border: "none",
        background: pSBC(-0.5, theme.backgroundColor as string) as string,
        color: theme.textColor,
        textAlign: "left",
        cursor: "pointer",
      }}
      onClick={onClick}
      ref={ref}
    >
      {value}
    </button>
  )
);

CustomInput.displayName = "CustomInput";

export function CustomDatePicker({
  date,
  setDate,
  header,
}: CustomDatePickerProps) {
  const theme = useThemeParams();

  const DatePickerWrapperStyles = createGlobalStyle`
  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  .react-datepicker__input-container input {
      display: block;
      width: 100%;
      border:none;
  }
  .react-datepicker{
      background-color: transparent;
      border:none;
  }
  .react-datepicker__header{
      background-color: ${pSBC(-0.5, theme.backgroundColor as string)};
      border:none;
      color:inherit;
  }
  .react-datepicker__day-name{
    color:${theme.textColor};
  }
  .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    border-radius: 0.3rem;
    background-color: ${theme.buttonColor};
    color: ${theme.buttonTextColor};
  }
  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__quarter-text:hover,
  .react-datepicker__year-text:hover {
    border-radius: 0.3rem;
    background-color: ${theme.buttonColor};
    color: ${theme.buttonTextColor};
  }
  `;

  return (
    <div style={{ width: "100%" }}>
      {header && (
        <InterTypography
          style={{
            fontSize: "12px",
            width: "100%",
            marginBottom: "5px",
            display: "block",
          }}
        >
          {header}
        </InterTypography>
      )}
      <DatePicker
        selected={date}
        onChange={(date: any) => setDate(date)}
        calendarContainer={(props: any) => (
          <MyContainer {...props} theme={theme} />
        )}
        renderDayContents={(day: any, date: any) =>
          renderDayContents(day, date, theme)
        }
        renderCustomHeader={(props: any) => (
          <CustomHeader {...props} theme={theme} />
        )}
        customInput={<CustomInput theme={theme} />}
      />
      <DatePickerWrapperStyles />
    </div>
  );
}
