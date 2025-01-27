import { MarkGameProvider } from "@/providers/MarkGameProvider";
import "./globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  // ここを変更する
  return <MarkGameProvider>
      <Component {...pageProps} />
  </MarkGameProvider>;
}