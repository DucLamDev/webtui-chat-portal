import type { Metadata } from "next";
import { portalPath, portalUrl, readPublicComplianceConfig } from "@/lib/public-config";
import "./globals.css";

export function generateMetadata(): Metadata {
  const config = readPublicComplianceConfig();
  return {
    applicationName: "WebTUI Chat",
    authors: [{ name: config.legalEntityName }],
    description: "Kết nối và tải client chính thức cho WebTUI Chat self-hosted.",
    icons: {
      apple: portalPath(config, "/brand/logo_webtui.png"),
      icon: portalPath(config, "/brand/logo_webtui.png")
    },
    metadataBase: new URL(config.portalOrigin),
    openGraph: {
      description: "Ứng dụng chat self-hosted dành cho tổ chức.",
      images: [{ alt: "WebTUI Chat", url: portalUrl(config, "/brand/logo_webtui.png") }],
      siteName: "WebTUI Chat",
      title: "WebTUI Chat Portal",
      type: "website",
      url: portalUrl(config, "/")
    },
    title: {
      default: "WebTUI Chat Portal",
      template: "%s | WebTUI Chat"
    }
  };
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
