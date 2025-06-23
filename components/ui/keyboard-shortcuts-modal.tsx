import { Button } from "@/components/ui/button";
import { memo } from "react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { action: "Download QR code", key: "⌘ ↵" },
  { action: "Toggle advanced options", key: "⌘ ⇧ A" },
  { action: "Toggle theme", key: "⌘ T" },
  { action: "Clear QR code", key: "⌘ K" },
  { action: "Focus input / Clear if focused", key: "Esc" },
  { action: "Show shortcuts", key: "⌘ /" },
] as const;

export const KeyboardShortcutsModal = memo(function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Keyboard Shortcuts</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0"
          >
            ✕
          </Button>
        </div>
        <div className="space-y-4">
          {shortcuts.map(({ action, key }) => (
            <div key={action} className="flex justify-between items-center">
              <span className="text-sm">{action}</span>
              <kbd className="px-2 py-1 rounded text-xs font-mono border">
                {key}
              </kbd>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t text-xs">
          <p>Use Ctrl instead of ⌘ on Windows/Linux</p>
        </div>
      </div>
    </div>
  );
});
