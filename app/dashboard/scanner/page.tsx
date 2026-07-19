"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Camera,
  Upload,
  Copy,
  ExternalLink,
  Share2,
  Check,
  X,
  History,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface ScanResult {
  id: string;
  content: string;
  timestamp: Date;
  type?: string;
}

export default function ScannerPage() {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isCameraMode, setIsCameraMode] = useState(true);
  const [fileInputKey, setFileInputKey] = useState(0);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startCameraScan = async () => {
    try {
      scannerRef.current = new Html5Qrcode("qr-reader");
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      );
      setScanning(true);
    } catch (err) {
      console.error("Error starting camera:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCameraScan = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const scanner = new Html5Qrcode("qr-reader-file");
      const result = await scanner.scanFile(file, false);
      handleScanSuccess(result);
    } catch (err) {
      console.error("Error scanning file:", err);
      toast({
        title: "Scan Error",
        description: "Could not find a QR code in this image.",
        variant: "destructive",
      });
    }
  };

  const onScanSuccess = (decodedText: string) => {
    handleScanSuccess(decodedText);
  };

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    
    const newScan: ScanResult = {
      id: Math.random().toString(36).substring(7),
      content: decodedText,
      timestamp: new Date(),
    };
    
    setScanHistory((prev) => [newScan, ...prev.slice(0, 19)]);
    
    if (scanning) {
      stopCameraScan();
    }

    toast({
      title: "QR Code Scanned!",
      description: "Content has been copied to clipboard",
    });
  };

  const onScanFailure = (error: string) => {
    // Silent failure - continuous scanning
  };

  const copyToClipboard = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    }
  };

  const openLink = () => {
    if (scanResult) {
      let url = scanResult;
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      window.open(url, "_blank");
    }
  };

  const shareContent = async () => {
    if (scanResult && navigator.share) {
      try {
        await navigator.share({
          title: "Scanned QR Code",
          text: scanResult,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">QR Scanner</h1>
        <p className="text-muted-foreground mt-1">
          Scan QR codes using your camera or upload an image
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scanner Section */}
        <div className="space-y-6">
          {/* Mode Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={isCameraMode ? "default" : "outline"}
                  onClick={() => {
                    setIsCameraMode(true);
                    setScanResult(null);
                  }}
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Camera
                </Button>
                <Button
                  variant={!isCameraMode ? "default" : "outline"}
                  onClick={() => {
                    setIsCameraMode(false);
                    setScanResult(null);
                  }}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>

              {isCameraMode ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
                    <div id="qr-reader" className="w-full h-full" />
                  </div>
                  {!scanning ? (
                    <Button onClick={startCameraScan} className="w-full" size="lg">
                      <Camera className="h-4 w-4 mr-2" />
                      Start Scanning
                    </Button>
                  ) : (
                    <Button
                      onClick={stopCameraScan}
                      variant="destructive"
                      className="w-full"
                      size="lg"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Stop Scanning
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      key={fileInputKey}
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="qr-file-input"
                    />
                    <label
                      htmlFor="qr-file-input"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Upload className="h-12 w-12 mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload QR code image
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG or GIF
                      </p>
                    </label>
                  </div>
                  <div id="qr-reader-file" className="hidden" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Scan Result */}
          {scanResult && (
            <Card>
              <CardHeader>
                <CardTitle>Scan Result</CardTitle>
                <CardDescription>QR code content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm break-all">{scanResult}</p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  {isUrl(scanResult) && (
                    <Button onClick={openLink} className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Link
                    </Button>
                  )}
                  <Button onClick={shareContent} variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scan History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scan History</CardTitle>
                  <CardDescription>Recent scans</CardDescription>
                </div>
                {scanHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {scanHistory.length > 0 ? (
                <div className="space-y-2">
                  {scanHistory.map((scan) => (
                    <div
                      key={scan.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setScanResult(scan.content)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {scan.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(scan.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No scans yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scan a QR code to see it here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
