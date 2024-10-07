"use client";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      lang="en"
      style={{
        padding: 0,
        margin: 0,
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      <Head></Head>
      <body
        style={{
          padding: 0,
          margin: 0,
          overflowX: "hidden",
          overflowY: "hidden",
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
