import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TikTok Downloader",
  description: "Download TikTok videos without watermark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="SThwZ3_rmNIOfPvsJ1ZFb3iDf0qh6mtr3o0KjN24eL0"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}