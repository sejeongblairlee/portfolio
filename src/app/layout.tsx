import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blair Lee — Portfolio",
  description: "Spatial Interactive Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-pretendard">{children}</body>
    </html>
  );
}
