import { Button } from "@/components/ui/button";
import { memo } from "react";

interface ActionButtonsProps {
  hasText: boolean;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  onDownload: () => void;
  onClear: () => void;
}

export const ActionButtons = memo(function ActionButtons({
  hasText,
  showAdvanced,
  onToggleAdvanced,
  onDownload,
  onClear,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onToggleAdvanced}
        variant="outline"
        className="flex-1"
        title="Ctrl+Shift+A"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Options
        <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
          ⌘⇧A
        </span>
      </Button>
      {hasText && (
        <>
          <Button onClick={onDownload} className="flex-1" title="Ctrl+Enter">
            Download
            <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
              ⌘↵
            </span>
          </Button>
          <Button onClick={onClear} variant="outline" title="Ctrl+K">
            Clear
            <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
              ⌘K
            </span>
          </Button>
        </>
      )}
    </div>
  );
});
