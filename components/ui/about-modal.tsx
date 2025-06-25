import { Button } from "@/components/ui/button";
import { memo } from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = memo(function AboutModal({
  isOpen,
  onClose,
}: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-lg w-full mx-4 shadow-2xl border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">About QRaft</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">What is QRaft?</h4>
            <p className="text-muted-foreground">
              QRaft is a powerful and user-friendly QR code generator that lets
              you create customizable QR codes for any text, URL, or data you
              need to share.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Key Features:</h4>
            <ul className="text-muted-foreground space-y-1 ml-4">
              <li>• Generate QR codes from any text or URL</li>
              <li>• Customize colors, size, and margins</li>
              <li>• Add logos to your QR codes</li>
              <li>• Scan existing QR codes with your camera</li>
              <li>• Quick templates for common use cases</li>
              <li>• Download QR codes as PNG images</li>
              <li>• Keyboard shortcuts for power users</li>
              <li>• Dark and light theme support</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">How to Use:</h4>
            <ol className="text-muted-foreground space-y-1 ml-4">
              <li>1. Enter your text or URL in the input field</li>
              <li>2. Your QR code will appear automatically</li>
              <li>3. Click "Advanced Options" to customize appearance</li>
              <li>4. Use "Templates" for quick common formats</li>
              <li>5. Download or scan QR codes as needed</li>
            </ol>
          </div>

          <div className="pt-2 border-t text-xs text-muted-foreground">
            <p>
              Press{" "}
              <kbd className="px-1 py-0.5 rounded text-xs font-mono border">
                Ctrl+/
              </kbd>{" "}
              to view keyboard shortcuts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
