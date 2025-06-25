import { useCallback, useRef, useState } from "react";
import jsQR from "jsqr";

export interface QRScanResult {
  data: string;
  type: 'url' | 'wifi' | 'email' | 'sms' | 'tel' | 'geo' | 'vcard' | 'text';
  parsed?: {
    wifi?: {
      ssid: string;
      password: string;
      security: string;
      hidden: boolean;
    };
    email?: {
      to: string;
      subject?: string;
      body?: string;
    };
    sms?: {
      phone: string;
      message?: string;
    };
    contact?: {
      firstName: string;
      lastName: string;
      phone?: string;
      email?: string;
      organization?: string;
      url?: string;
    };
    geo?: {
      latitude: string;
      longitude: string;
    };
  };
}

export function useQRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const parseQRContent = useCallback((data: string): QRScanResult => {
    // WiFi QR Code: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
    if (data.startsWith('WIFI:')) {
      const parts = data.slice(5, -2).split(';');
      const wifi = {
        ssid: '',
        password: '',
        security: 'WPA',
        hidden: false,
      };
      
      parts.forEach(part => {
        const [key, value] = part.split(':', 2);
        if (key === 'S') wifi.ssid = value || '';
        if (key === 'P') wifi.password = value || '';
        if (key === 'T') wifi.security = value || 'WPA';
        if (key === 'H') wifi.hidden = value === 'true';
      });

      return { data, type: 'wifi', parsed: { wifi } };
    }

    // Email: mailto:user@example.com?subject=Subject&body=Body
    if (data.startsWith('mailto:')) {
      const url = new URL(data);
      const email = {
        to: url.pathname,
        subject: url.searchParams.get('subject') || undefined,
        body: url.searchParams.get('body') || undefined,
      };
      return { data, type: 'email', parsed: { email } };
    }

    // SMS: sms:+1234567890?body=Message
    if (data.startsWith('sms:')) {
      const [phonePart, queryPart] = data.slice(4).split('?');
      const sms = {
        phone: phonePart,
        message: queryPart ? new URLSearchParams(queryPart).get('body') || undefined : undefined,
      };
      return { data, type: 'sms', parsed: { sms } };
    }

    // Phone: tel:+1234567890
    if (data.startsWith('tel:')) {
      return { data, type: 'tel' };
    }

    // Geo location: geo:37.7749,-122.4194
    if (data.startsWith('geo:')) {
      const coords = data.slice(4).split(',');
      if (coords.length >= 2) {
        const geo = {
          latitude: coords[0],
          longitude: coords[1],
        };
        return { data, type: 'geo', parsed: { geo } };
      }
    }

    // vCard contact
    if (data.startsWith('BEGIN:VCARD')) {
      const lines = data.split('\n');
      const contact = {
        firstName: '',
        lastName: '',
        phone: undefined as string | undefined,
        email: undefined as string | undefined,
        organization: undefined as string | undefined,
        url: undefined as string | undefined,
      };

      lines.forEach(line => {
        if (line.startsWith('FN:')) {
          const fullName = line.slice(3).trim();
          const nameParts = fullName.split(' ');
          contact.firstName = nameParts[0] || '';
          contact.lastName = nameParts.slice(1).join(' ') || '';
        }
        if (line.startsWith('N:')) {
          const nameParts = line.slice(2).split(';');
          contact.lastName = nameParts[0] || '';
          contact.firstName = nameParts[1] || '';
        }
        if (line.startsWith('TEL:')) contact.phone = line.slice(4);
        if (line.startsWith('EMAIL:')) contact.email = line.slice(6);
        if (line.startsWith('ORG:')) contact.organization = line.slice(4);
        if (line.startsWith('URL:')) contact.url = line.slice(4);
      });

      return { data, type: 'vcard', parsed: { contact } };
    }

    // URL
    try {
      new URL(data);
      return { data, type: 'url' };
    } catch {
      // Not a valid URL
    }

    // Default to text
    return { data, type: 'text' };
  }, []);

  const scanFromFile = useCallback((file: File): Promise<QRScanResult> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select an image file'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            const result = parseQRContent(code.data);
            resolve(result);
          } else {
            reject(new Error('No QR code found in the image'));
          }
        };
        img.onerror = () => reject(new Error('Could not load the image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Could not read the file'));
      reader.readAsDataURL(file);
    });
  }, [parseQRContent]);

  const startCameraScanning = useCallback(async () => {
    try {
      setIsScanning(true);
      setError(null);
      setScanResult(null);

      // Check for camera support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Handle video loading
        const video = videoRef.current;
        
        const onLoadedMetadata = () => {
          video.play().then(() => {
            // Start scanning once video is playing
            scanFrame();
          }).catch(() => {
            setError('Could not start video playback');
            setIsScanning(false);
          });
        };

        const scanFrame = () => {
          if (!videoRef.current || !canvasRef.current) {
            return;
          }

          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            return;
          }

          if (video.readyState !== video.HAVE_ENOUGH_DATA) {
            animationRef.current = requestAnimationFrame(scanFrame);
            return;
          }

          // Set canvas size to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Get image data and scan for QR code
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            const result = parseQRContent(code.data);
            setScanResult(result);
            stopCameraScanning();
          } else {
            // Continue scanning if no QR code found
            animationRef.current = requestAnimationFrame(scanFrame);
          }
        };

        // Add event listener and start scanning when metadata loads
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        
        // Cleanup function for this specific video element
        video.addEventListener('error', () => {
          setError('Video loading failed');
          setIsScanning(false);
        });
      }

    } catch (err) {
      let errorMessage = 'Camera access failed';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found on this device.';
        } else if (err.name === 'NotSupportedError') {
          errorMessage = 'Camera not supported by this browser.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsScanning(false);
    }
  }, [parseQRContent]);

  const stopCameraScanning = useCallback(() => {
    setIsScanning(false);
    
    // Cancel animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    // Clean up video element
    if (videoRef.current) {
      const video = videoRef.current;
      video.pause();
      video.srcObject = null;
      
      // Remove any event listeners that might have been added
      video.removeEventListener('loadedmetadata', () => {});
      video.removeEventListener('error', () => {});
    }
  }, []);

  const clearResult = useCallback(() => {
    setScanResult(null);
    setError(null);
  }, []);

  return {
    isScanning,
    scanResult,
    error,
    videoRef,
    canvasRef,
    scanFromFile,
    startCameraScanning,
    stopCameraScanning,
    clearResult,
  };
}
