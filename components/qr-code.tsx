import { getQRData, QRCodeSVG } from "@/lib/qr";
import { DEFAULT_MARGIN } from "@/lib/qr/constants";
import { memo, useMemo } from "react";

export const QRCode = memo(
  ({
    url,
    fgColor,
    hideLogo,
    logo,
    scale = 1,
    margin = DEFAULT_MARGIN,
  }: {
    url: string;
    fgColor?: string;
    hideLogo?: boolean;
    logo?: string;
    scale?: number;
    margin?: number;
  }) => {
    const qrData = useMemo(
      () => getQRData({ url, fgColor, hideLogo, logo, margin }),
      [url, fgColor, hideLogo, logo, margin]
    );
    return (
      <QRCodeSVG
        value={qrData.value}
        size={(qrData.size / 8) * scale}
        bgColor={qrData.bgColor}
        fgColor={qrData.fgColor}
        level={qrData.level}
        margin={qrData.margin}
        {...(qrData.imageSettings &&
          qrData.imageSettings.src && {
            imageSettings: {
              ...qrData.imageSettings,
              src: qrData.imageSettings.src,
              height: (qrData.imageSettings.height / 8) * scale,
              width: (qrData.imageSettings.width / 8) * scale,
            },
          })}
      />
    );
  }
);

QRCode.displayName = "QRCode";
