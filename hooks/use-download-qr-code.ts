import { useCallback } from "react";

export function useDownloadQRCode() {
  const downloadQRCode = useCallback((text: string, size: number) => {
    if (!text.trim()) return;

    // Get the actual QR code SVG from the DOM
    const qrContainer = document.querySelector('[data-testid="qr-code-container"]');
    const svgElement = qrContainer?.querySelector('svg');
    
    if (!svgElement) {
      console.error('QR code SVG not found');
      return;
    }

    try {
      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true) as SVGElement;
      
      // Ensure proper sizing
      svgClone.setAttribute('width', size.toString());
      svgClone.setAttribute('height', size.toString());
      
      // Serialize the SVG
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create and trigger download
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `qrcode-${Date.now()}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Cleanup
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  }, []);

  return { downloadQRCode };
}
