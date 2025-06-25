import { useEffect, useCallback } from "react";

interface UseKeyboardShortcutsProps {
  text: string;
  showAdvanced: boolean;
  showShortcuts: boolean;
  onToggleAdvanced: () => void;
  onDownload: () => void;
  onClear: () => void;
  onToggleShortcuts: () => void;
  onCloseShortcuts: () => void;
  onToggleTheme: () => void;
  onToggleScanner?: () => void;
}

export function useKeyboardShortcuts({
  text,
  showAdvanced,
  showShortcuts,
  onToggleAdvanced,
  onDownload,
  onClear,
  onToggleShortcuts,
  onCloseShortcuts,
  onToggleTheme,
  onToggleScanner,
}: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      const isTyping = event.target instanceof HTMLInputElement;

      // Ctrl/Cmd + Enter: Download QR code
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "Enter" &&
        text.trim()
      ) {
        event.preventDefault();
        onDownload();
        return;
      }      // Ctrl/Cmd + Shift + A: Toggle advanced options
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "A"
      ) {
        event.preventDefault();
        onToggleAdvanced();
        return;
      }

      // Ctrl/Cmd + T: Toggle theme
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "t" &&
        !isTyping
      ) {
        event.preventDefault();
        onToggleTheme();
        return;
      }

      // Ctrl/Cmd + S: Toggle scanner
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "s" &&
        !isTyping &&
        onToggleScanner
      ) {
        event.preventDefault();
        onToggleScanner();
        return;
      }

      // Ctrl/Cmd + K: Clear QR code
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "k" &&
        text.trim()
      ) {
        event.preventDefault();
        onClear();
        return;
      }

      // Escape: Focus on text input or clear if already focused, or close modal
      if (event.key === "Escape") {
        if (showShortcuts) {
          onCloseShortcuts();
        } else {
          const textInput = document.getElementById("text-input") as HTMLInputElement;
          if (textInput) {
            if (document.activeElement === textInput && text.trim()) {
              onClear();
            } else {
              textInput.focus();
            }
          }
        }
        return;
      }

      // Ctrl/Cmd + /: Toggle keyboard shortcuts help modal
      if ((event.ctrlKey || event.metaKey) && event.key === "/" && !isTyping) {
        event.preventDefault();
        onToggleShortcuts();
        return;
      }
    },    [
      text,
      showAdvanced,
      showShortcuts,
      onToggleAdvanced,
      onDownload,
      onClear,
      onToggleShortcuts,
      onCloseShortcuts,
      onToggleTheme,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
