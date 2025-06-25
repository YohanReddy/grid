"use client";

import { useState } from "react";
import { QRGenerator } from "@/components/qr-generator";
import { ThemeToggle } from "@/components/theme-toggle";
import { AboutModal } from "@/components/ui/about-modal";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      {/* SEO-friendly structured content */}
      <div className="sr-only">
        <h1>GRID - Free QR Code Generator</h1>
        <p>
          Create custom QR codes with advanced styling options, logo
          integration, and support for WiFi, vCard, SMS, and URL formats. No
          registration required.
        </p>
        <ul>
          <li>Generate QR codes with custom colors and styling</li>
          <li>Add logos and branding to your QR codes</li>
          <li>Create WiFi QR codes for easy network sharing</li>
          <li>Generate vCard QR codes for business cards</li>
          <li>Built-in QR code scanner functionality</li>
          <li>Mobile-responsive design with dark/light themes</li>
          <li>Keyboard shortcuts for power users</li>
          <li>Free to use with no signup required</li>
        </ul>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="absolute top-4 left-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAbout(true)}
              className="h-9 w-9"
              title="About GRID QR Code Generator"
              aria-label="Learn more about GRID QR Code Generator"
            >
              ?
            </Button>
          </div>

          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-3">
              <img
                src="https://fed53aezhr.ufs.sh/f/yG32oqY5QX87tvuaulSM1qASUi4XhLFTGEwpgxfKNulzoYIP"
                alt="GRID QR Code Generator Logo"
                className="w-12 h-12 object-contain"
                width="48"
                height="48"
              />
              <h1 className="text-2xl font-bold tracking-wider">G R I D</h1>
            </div>
          </div>

          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <QRGenerator />
          </main>
        </div>

        <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      </div>
    </>
  );
}
