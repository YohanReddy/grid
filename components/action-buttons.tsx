import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { memo } from "react";

interface ActionButtonsProps {
  hasText: boolean;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  onDownload: () => void;
  onClear: () => void;
  onToggleTemplates: () => void;
}

export const ActionButtons = memo(function ActionButtons({
  hasText,
  showAdvanced,
  onToggleAdvanced,
  onDownload,
  onClear,
  onToggleTemplates,
}: ActionButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Button
          onClick={onToggleTemplates}
          variant="outline"
          className="flex-1"
          title="QR Code Templates"
        >
          <FileText className="h-4 w-4 mr-2" />
          Templates
        </Button>
        <Button
          onClick={onToggleAdvanced}
          variant="outline"
          className="flex-1"
          title="Ctrl+Shift+A"
        >
          {showAdvanced ? "Hide" : "Show"} Advanced
          <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
            ⌘⇧A
          </span>
        </Button>
      </div>
      {hasText && (
        <div className="flex gap-3">
          <Button onClick={onDownload} className="flex-1" title="Ctrl+Enter">
            Download
            <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
              ⌘↵
            </span>
          </Button>
          <Button
            onClick={onClear}
            variant="outline"
            className="flex-1"
            title="Ctrl+K"
          >
            Clear
            <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
              ⌘K
            </span>
          </Button>
        </div>
      )}
    </div>
  );
});
