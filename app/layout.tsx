import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "GRID - OSS QR Code Generator | Custom QR Codes with Logo & Advanced Styling",
  description:
    "Create stunning QR codes instantly with GRID - the most advanced free QR code generator. Customize colors, add logos, scan QR codes, and generate WiFi, vCard, SMS, and URL QR codes. No signup required!",
  keywords: [
    "QR code generator",
    "free QR code maker",
    "custom QR codes",
    "QR code with logo",
    "WiFi QR code",
    "vCard QR code",
    "QR code scanner",
    "bulk QR codes",
    "QR code API",
    "branded QR codes",
    "business QR codes",
    "dynamic QR codes",
    "QR code templates",
    "mobile QR generator",
  ].join(", "),
  authors: [{ name: "GRID Team" }],
  creator: "GRID",
  publisher: "GRID",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://grid-qr.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GRID - Free QR Code Generator | Create Custom QR Codes Instantly",
    description:
      "Generate beautiful, customizable QR codes for free. Add logos, customize colors, create WiFi QR codes, business cards, and more. Advanced features with no signup required.",
    url: "https://grid-qr.vercel.app",
    siteName: "GRID QR Code Generator",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "GRID QR Code Generator - Create Custom QR Codes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GRID - Free QR Code Generator with Advanced Customization",
    description:
      "Create stunning QR codes with logos, custom colors, and templates. Generate WiFi, vCard, SMS QR codes and more. Try GRID's free QR generator now!",
    images: ["/api/og"],
    creator: "@gridqr",
    site: "@gridqr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Business Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "GRID QR Code Generator",
    description:
      "Advanced free QR code generator with custom styling, logo integration, and multiple QR code formats including WiFi, vCard, SMS, and URL codes.",
    url: "https://grid-qr.vercel.app",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    permissions: "https://grid-qr.vercel.app/privacy",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    creator: {
      "@type": "Organization",
      name: "GRID Team",
      url: "https://grid-qr.vercel.app",
    },
    featureList: [
      "Custom QR code colors and styling",
      "Logo integration in QR codes",
      "WiFi QR code generation",
      "vCard/Business card QR codes",
      "QR code scanner functionality",
      "Bulk QR code generation",
      "No registration required",
      "Mobile-responsive design",
      "Dark/Light theme support",
      "Keyboard shortcuts",
    ],
    browserRequirements: "Requires JavaScript. Modern browser required.",
    screenshot: "https://grid-qr.vercel.app/screenshot.png",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="GRID QR" />
        <meta name="application-name" content="GRID QR Generator" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
