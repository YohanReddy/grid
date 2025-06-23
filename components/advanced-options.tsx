import { ColorPicker } from "@/components/ui/color-picker";
import { ColorPresets, type ColorPreset } from "@/components/ui/color-presets";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo } from "react";

interface AdvancedOptionsProps {
  darkColor: string;
  lightColor: string;
  size: number;
  margin: number;
  logoUrl: string;
  onDarkColorChange: (color: string) => void;
  onLightColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onMarginChange: (margin: number) => void;
  onLogoUrlChange: (url: string) => void;
  presetColors: ColorPreset[];
}

export const AdvancedOptions = memo(function AdvancedOptions({
  darkColor,
  lightColor,
  size,
  margin,
  logoUrl,
  onDarkColorChange,
  onLightColorChange,
  onSizeChange,
  onMarginChange,
  onLogoUrlChange,
  presetColors,
}: AdvancedOptionsProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <div className="grid grid-cols-2 gap-4">
        <ColorPicker
          color={darkColor}
          onChange={onDarkColorChange}
          label="Foreground Color"
        />
        <ColorPicker
          color={lightColor}
          onChange={onLightColorChange}
          label="Background Color"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Size</Label>
          <Input
            type="number"
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
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
            onChange={(e) => onMarginChange(Number(e.target.value))}
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
          onChange={(e) => onLogoUrlChange(e.target.value)}
          className="h-8"
        />
      </div>

      <ColorPresets
        presets={presetColors}
        onSelect={(dark, light) => {
          onDarkColorChange(dark);
          onLightColorChange(light);
        }}
      />
    </div>
  );
});
