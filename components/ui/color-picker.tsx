import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo } from "react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

export const ColorPicker = memo(function ColorPicker({
  color,
  onChange,
  label,
}: ColorPickerProps) {
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
});
