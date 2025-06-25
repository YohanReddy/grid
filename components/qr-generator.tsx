"use client";

import { useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { QRCode } from "@/components/qr-code";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdvancedOptions } from "@/components/advanced-options";
import { ActionButtons } from "@/components/action-buttons";
import { TextInput } from "@/components/text-input";
import { KeyboardShortcutsModal } from "@/components/ui/keyboard-shortcuts-modal";
import { QRTemplates } from "@/components/qr-templates";
import { QRScanner } from "@/components/qr-scanner";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useDownloadQRCode } from "@/hooks/use-download-qr-code";
import type { QRScanResult } from "@/hooks/use-qr-scanner";
import { COLOR_PRESETS, DEFAULT_QR_SETTINGS } from "@/constants/qr-settings";

export function QRGenerator() {
  const [text, setText] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [darkColor, setDarkColor] = useState<string>(
    DEFAULT_QR_SETTINGS.darkColor
  );
  const [lightColor, setLightColor] = useState<string>(
    DEFAULT_QR_SETTINGS.lightColor
  );
  const [size, setSize] = useState<number>(DEFAULT_QR_SETTINGS.size);
  const [margin, setMargin] = useState<number>(DEFAULT_QR_SETTINGS.margin);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [hideLogo, setHideLogo] = useState<boolean>(true);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);

  const { setTheme, theme } = useTheme();
  const { downloadQRCode } = useDownloadQRCode();

  const handleDownload = useCallback(() => {
    downloadQRCode(text, size);
  }, [downloadQRCode, text, size]);

  const handleClear = useCallback(() => {
    setText("");
    setLogoUrl("");
  }, []);

  const handleToggleAdvanced = useCallback(() => {
    setShowAdvanced((prev) => !prev);
  }, []);

  const handleToggleShortcuts = useCallback(() => {
    setShowShortcuts((prev) => !prev);
  }, []);
  const handleCloseShortcuts = useCallback(() => {
    setShowShortcuts(false);
  }, []);

  const handleToggleTemplates = useCallback(() => {
    setShowTemplates((prev) => !prev);
  }, []);
  const handleCloseTemplates = useCallback(() => {
    setShowTemplates(false);
  }, []);

  const handleToggleScanner = useCallback(() => {
    setShowScanner((prev) => !prev);
  }, []);
  const handleCloseScanner = useCallback(() => {
    setShowScanner(false);
  }, []);

  const handleScanResult = useCallback((result: QRScanResult) => {
    // Set the scanned content as text
    setText(result.data);

    // If it's a recognized format with parsed data, we could potentially
    // auto-fill templates in the future
    if (result.parsed) {
      // For now, just use the raw data
      // Future enhancement: auto-open appropriate template with parsed data
    }

    setShowScanner(false);
  }, []);

  const handleTemplateGenerate = useCallback((content: string) => {
    setText(content);
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const handleLogoUrlChange = useCallback((url: string) => {
    setLogoUrl(url);
    setHideLogo(!url.trim());
  }, []);
  useKeyboardShortcuts({
    text,
    showAdvanced,
    showShortcuts,
    onToggleAdvanced: handleToggleAdvanced,
    onDownload: handleDownload,
    onClear: handleClear,
    onToggleShortcuts: handleToggleShortcuts,
    onCloseShortcuts: handleCloseShortcuts,
    onToggleTheme: handleToggleTheme,
    onToggleScanner: handleToggleScanner,
  });
  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardDescription className="text-base">
            Enter text or URL to generate a customizable QR code
            <br />
            <span className="text-xs text-muted-foreground mt-1 block">
              Press Ctrl+/ to view keyboard shortcuts
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextInput
            text={text}
            onChange={setText}
            maxLength={DEFAULT_QR_SETTINGS.maxTextLength}
          />
          {text.trim() && (
            <div
              className="flex justify-center p-4 bg-gray-50 rounded-lg"
              data-testid="qr-code-container"
            >
              <QRCode
                url={text}
                fgColor={showAdvanced ? darkColor : undefined}
                bgColor={showAdvanced ? lightColor : undefined}
                hideLogo={hideLogo}
                logo={logoUrl || undefined}
                scale={showAdvanced ? size / 128 : 2}
                margin={showAdvanced ? margin : undefined}
              />
            </div>
          )}

          <ActionButtons
            hasText={!!text.trim()}
            showAdvanced={showAdvanced}
            onToggleAdvanced={handleToggleAdvanced}
            onDownload={handleDownload}
            onClear={handleClear}
            onToggleTemplates={handleToggleTemplates}
            onToggleScanner={handleToggleScanner}
          />

          {showAdvanced && (
            <AdvancedOptions
              darkColor={darkColor}
              lightColor={lightColor}
              size={size}
              margin={margin}
              logoUrl={logoUrl}
              onDarkColorChange={setDarkColor}
              onLightColorChange={setLightColor}
              onSizeChange={setSize}
              onMarginChange={setMargin}
              onLogoUrlChange={handleLogoUrlChange}
              presetColors={COLOR_PRESETS}
            />
          )}
        </CardContent>
      </Card>

      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={handleCloseShortcuts}
      />

      <QRTemplates
        isOpen={showTemplates}
        onClose={handleCloseTemplates}
        onTemplateGenerate={handleTemplateGenerate}
      />

      <QRScanner
        isOpen={showScanner}
        onClose={handleCloseScanner}
        onScanResult={handleScanResult}
      />
    </>
  );
}
