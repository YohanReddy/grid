import { type ColorPreset } from "@/components/ui/color-presets";

export const COLOR_PRESETS: ColorPreset[] = [
  { name: "Classic", dark: "#000000", light: "#FFFFFF" },
  { name: "Blue", dark: "#1E40AF", light: "#EFF6FF" },
  { name: "Green", dark: "#166534", light: "#F0FDF4" },
  { name: "Red", dark: "#DC2626", light: "#FEF2F2" },
  { name: "Purple", dark: "#7C2D92", light: "#FAF5FF" },
  { name: "Orange", dark: "#EA580C", light: "#FFF7ED" },
] as const;

export const DEFAULT_QR_SETTINGS = {
  size: 256,
  margin: 2,
  darkColor: "#000000",
  lightColor: "#FFFFFF",
  maxTextLength: 500,
} as const;
