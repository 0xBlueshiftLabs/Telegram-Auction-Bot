import React, { CSSProperties } from "react";
import { Open_Sans } from "next/font/google";
import { PropsWithChildren } from "react";

const openSans = Open_Sans({ subsets: ["latin"] });

interface InterTypographyProps extends PropsWithChildren {
  style?: CSSProperties;
}

export default function InterTypography({
  children,
  style,
  ...props
}: InterTypographyProps) {
  return (
    <span className={openSans.className} style={style} {...props}>
      {children}
    </span>
  );
}
