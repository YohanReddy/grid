"use client";

import { useState } from "react";
import { QRCode } from "@/components/qr-code";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-md border border-input cursor-pointer shadow-sm"
          />
        </div>
        <Input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-8 font-mono text-xs"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

export function QRGenerator() {
  const [text, setText] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#FFFFFF");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(2);
  const [logoUrl, setLogoUrl] = useState("");
  const [hideLogo, setHideLogo] = useState(true);

  const downloadQRCode = () => {
    if (!text.trim()) return;

    // Create a temporary div to render the QRCode
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    // Create the QR code SVG
    const qrElement = document.createElement("div");
    qrElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <!-- This would need actual QR generation logic -->
      </svg>
    `;

    // Simple download implementation - you might want to enhance this
    const svgData = new XMLSerializer().serializeToString(
      qrElement.firstElementChild!
    );
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "qrcode.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    document.body.removeChild(tempDiv);
  };

  const clearQRCode = () => {
    setText("");
    setLogoUrl("");
  };

  const presetColors = [
    { name: "Classic", dark: "#000000", light: "#FFFFFF" },
    { name: "Blue", dark: "#1E40AF", light: "#EFF6FF" },
    { name: "Green", dark: "#166534", light: "#F0FDF4" },
    { name: "Red", dark: "#DC2626", light: "#FEF2F2" },
    { name: "Purple", dark: "#7C2D92", light: "#FAF5FF" },
    { name: "Orange", dark: "#EA580C", light: "#FFF7ED" },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold">QR Code Generator</CardTitle>
        <CardDescription className="text-base">
          Enter text or URL to generate a customizable QR code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="text-input" className="text-sm font-medium">
            Text or URL
          </Label>
          <Input
            id="text-input"
            type="text"
            placeholder="Enter text or URL to generate QR code"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full"
          />
        </div>

        {text.trim() && (
          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <QRCode
              url={text}
              fgColor={showAdvanced ? darkColor : undefined}
              hideLogo={hideLogo}
              logo={logoUrl || undefined}
              scale={showAdvanced ? size / 128 : 2}
              margin={showAdvanced ? margin : undefined}
            />
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            className="flex-1"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>
          {text.trim() && (
            <>
              <Button onClick={downloadQRCode} className="flex-1">
                Download
              </Button>
              <Button onClick={clearQRCode} variant="outline">
                Clear
              </Button>
            </>
          )}
        </div>

        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                color={darkColor}
                onChange={setDarkColor}
                label="Foreground Color"
              />
              <ColorPicker
                color={lightColor}
                onChange={setLightColor}
                label="Background Color"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Size</Label>
                <Input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  min={128}
                  max={512}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Margin</Label>
                <Input
                  type="number"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  min={0}
                  max={10}
                  className="h-8"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Logo URL</Label>
              <Input
                type="text"
                placeholder="Enter logo URL (optional)"
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setHideLogo(!e.target.value.trim());
                }}
                className="h-8"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Color Presets
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {presetColors.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDarkColor(preset.dark);
                      setLightColor(preset.light);
                    }}
                    className="h-8 text-xs"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
