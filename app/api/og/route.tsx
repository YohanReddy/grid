import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#252525", // --background dark
        }}
      >
        <div tw="flex" style={{ backgroundColor: "#1a1a1a" }}>
          <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
            {/* Left side - Main content */}
            <div tw="flex flex-col">
              {/* Logo/Brand Section */}
              <div tw="flex items-center mb-6">
                <img
                  tw="w-12 h-12 rounded-lg mr-3"
                  src="https://fed53aezhr.ufs.sh/f/yG32oqY5QX87tvuaulSM1qASUi4XhLFTGEwpgxfKNulzoYIP"
                  alt="GRID Logo"
                />
                <h1 tw="text-3xl font-bold" style={{ color: "#fafafa" }}>
                  GRID
                </h1>
              </div>

              {/* Main Heading */}
              <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-left">
                <span style={{ color: "#fafafa" }}>Advanced QR Code</span>
                <span style={{ color: "#8e8e8e" }}>Generator & Scanner</span>
              </h2>

              {/* Subtitle */}
              <p tw="text-lg mt-4 max-w-lg" style={{ color: "#b5b5b5" }}>
                Create stunning QR codes with logos, custom colors, and
                templates. Generate WiFi, vCard, SMS QR codes and more -
                completely free!
              </p>
            </div>

            {/* Right side - CTA Buttons */}
            <div tw="mt-8 flex md:mt-0">
              <div tw="flex rounded-md shadow">
                <a
                  href="#"
                  tw="flex items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium"
                  style={{ backgroundColor: "#8e8e8e", color: "#252525" }}
                >
                  Generate QR Code
                </a>
              </div>
              <div tw="ml-3 flex rounded-md shadow">
                <a
                  href="#"
                  tw="flex items-center justify-center rounded-md px-5 py-3 text-base font-medium"
                  style={{
                    backgroundColor: "#434343",
                    color: "#fafafa",
                    border: "1px solid #8e8e8e",
                  }}
                >
                  Scan QR Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
