import { Button } from "@/components/ui/button";
import { memo } from "react";

export interface ColorPreset {
  name: string;
  dark: string;
  light: string;
}

interface ColorPresetsProps {
  presets: ColorPreset[];
  onSelect: (dark: string, light: string) => void;
}

export const ColorPresets = memo(function ColorPresets({
  presets,
  onSelect,
}: ColorPresetsProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-muted-foreground">Color Presets</label>
      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => onSelect(preset.dark, preset.light)}
            className="h-8 text-xs"
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
});
