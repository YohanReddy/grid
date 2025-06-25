"use client";

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
import { useQRScanner, type QRScanResult } from "@/hooks/use-qr-scanner";
import { Camera, Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { memo, useCallback, useRef, useEffect } from "react";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (result: QRScanResult) => void;
}

export const QRScanner = memo(function QRScanner({
  isOpen,
  onClose,
  onScanResult,
}: QRScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isScanning,
    scanResult,
    error,
    videoRef,
    canvasRef,
    scanFromFile,
    startCameraScanning,
    stopCameraScanning,
    clearResult,
  } = useQRScanner();

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const result = await scanFromFile(file);
        onScanResult(result);
      } catch (err) {
        console.error("Scan error:", err);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [scanFromFile, onScanResult]
  );

  const handleUseScanResult = useCallback(() => {
    if (scanResult) {
      onScanResult(scanResult);
      onClose();
    }
  }, [scanResult, onScanResult, onClose]);

  const handleClose = useCallback(() => {
    stopCameraScanning();
    clearResult();
    onClose();
  }, [stopCameraScanning, clearResult, onClose]);

  // Cleanup when component unmounts or closes
  useEffect(() => {
    return () => {
      if (isScanning) {
        stopCameraScanning();
      }
    };
  }, [isScanning, stopCameraScanning]);

  // Stop scanning when modal closes
  useEffect(() => {
    if (!isOpen && isScanning) {
      stopCameraScanning();
    }
  }, [isOpen, isScanning, stopCameraScanning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-medium">
                Scan QR Code
              </CardTitle>
              <CardDescription>
                Upload an image or use your camera to scan a QR code
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <Label className="text-sm font-medium">
                Upload QR Code Image
              </Label>
            </div>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="qr-file-upload"
              />
              <Label
                htmlFor="qr-file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm">Click to upload an image</span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </span>
              </Label>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          {/* Camera Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <Label className="text-sm font-medium">Use Camera</Label>
            </div>

            {!isScanning && !scanResult && (
              <Button
                onClick={startCameraScanning}
                className="w-full"
                variant="outline"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Camera Scanning
              </Button>
            )}

            {isScanning && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden min-h-[16rem]">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    playsInline
                    muted
                    autoPlay
                    style={{ transform: "scaleX(-1)" }} // Mirror for user-facing camera
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Scanning overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                      {/* Scanning frame */}
                      <div className="border-2 border-white/80 w-48 h-48 rounded-lg">
                        {/* Corner indicators */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg"></div>
                      </div>

                      {/* Scanning animation */}
                      <div className="absolute inset-0 border-2 border-white/30 rounded-lg animate-pulse"></div>
                    </div>
                  </div>

                  {/* Loading indicator if video not ready */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white text-sm">Starting camera...</div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Position the QR code within the frame
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Make sure the QR code is well-lit and clearly visible
                  </p>
                  <Button
                    onClick={stopCameraScanning}
                    variant="outline"
                    size="sm"
                  >
                    Stop Scanning
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-lg">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Scan Result */}
          {scanResult && (
            <div className="space-y-4 p-4 bg-muted/30 border border-border rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">QR Code Detected!</span>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Type: </span>
                  <span className="capitalize">{scanResult.type}</span>
                </div>

                <div className="text-sm">
                  <span className="font-medium">Content: </span>
                  <div className="mt-1 p-2 bg-muted rounded border font-mono text-xs break-all">
                    {scanResult.data.length > 200
                      ? `${scanResult.data.substring(0, 200)}...`
                      : scanResult.data}
                  </div>
                </div>

                {/* Parsed Content Preview */}
                {scanResult.parsed && (
                  <div className="text-sm">
                    <span className="font-medium">Parsed Data:</span>
                    <div className="mt-1 p-2 bg-muted rounded border text-xs">
                      {scanResult.type === "wifi" && scanResult.parsed.wifi && (
                        <div>
                          <div>
                            <strong>Network:</strong>{" "}
                            {scanResult.parsed.wifi.ssid}
                          </div>
                          <div>
                            <strong>Security:</strong>{" "}
                            {scanResult.parsed.wifi.security}
                          </div>
                          <div>
                            <strong>Hidden:</strong>{" "}
                            {scanResult.parsed.wifi.hidden ? "Yes" : "No"}
                          </div>
                        </div>
                      )}

                      {scanResult.type === "email" &&
                        scanResult.parsed.email && (
                          <div>
                            <div>
                              <strong>To:</strong> {scanResult.parsed.email.to}
                            </div>
                            {scanResult.parsed.email.subject && (
                              <div>
                                <strong>Subject:</strong>{" "}
                                {scanResult.parsed.email.subject}
                              </div>
                            )}
                          </div>
                        )}

                      {scanResult.type === "vcard" &&
                        scanResult.parsed.contact && (
                          <div>
                            <div>
                              <strong>Name:</strong>{" "}
                              {scanResult.parsed.contact.firstName}{" "}
                              {scanResult.parsed.contact.lastName}
                            </div>
                            {scanResult.parsed.contact.phone && (
                              <div>
                                <strong>Phone:</strong>{" "}
                                {scanResult.parsed.contact.phone}
                              </div>
                            )}
                            {scanResult.parsed.contact.email && (
                              <div>
                                <strong>Email:</strong>{" "}
                                {scanResult.parsed.contact.email}
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleUseScanResult}
                  size="sm"
                  className="flex-1"
                >
                  Use This Content
                </Button>
                <Button onClick={clearResult} variant="outline" size="sm">
                  Scan Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
