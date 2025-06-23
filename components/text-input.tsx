import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo } from "react";

interface TextInputProps {
  text: string;
  onChange: (text: string) => void;
  maxLength?: number;
}

export const TextInput = memo(function TextInput({
  text,
  onChange,
  maxLength = 500,
}: TextInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="text-input" className="text-sm font-medium">
          Text or URL
        </Label>
        <span
          className={`text-xs ${
            text.length > maxLength
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {text.length}/{maxLength} characters
        </span>
      </div>
      <Input
        id="text-input"
        type="text"
        placeholder="Enter text or URL to generate QR code (Esc to focus/clear)"
        value={text}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            onChange(e.target.value);
          }
        }}
        className="w-full"
        title="Press Escape to focus this field or clear if already focused"
        maxLength={maxLength}
      />
    </div>
  );
});
