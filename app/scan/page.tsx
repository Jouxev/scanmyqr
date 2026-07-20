/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { TiptapLogo } from "@/components/brand/tiptap-logo";

export default function ScanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [scanResult, setScanResult] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const html5QrRef = useRef<Html5Qrcode | null>(null);

  // Camera functions
  const startCamera = async () => {
    setIsRequestingPermission(true);

    // Check if we're in a secure context (HTTPS or localhost)
    const isSecureContext =
      window.isSecureContext ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1";

    if (!isSecureContext) {
      alert(
        "Camera access requires a secure connection (HTTPS) or localhost. Please serve this app over HTTPS or run it on localhost."
      );
      setHasCameraPermission(false);
      setIsRequestingPermission(false);
      return;
    }

    setHasCameraPermission(true);

    try {
      // Stop any existing scanner
      if (html5QrRef.current) {
        try {
          await html5QrRef.current.stop();
        } catch (_) {
          // ignore
        }
        html5QrRef.current = null;
      }

      const html5Qr = new Html5Qrcode("video-container");
      html5QrRef.current = html5Qr;

      // Check for front/back camera
      const devices = await Html5Qrcode.getCameras();
      let cameraId = "";
      if (devices && devices.length > 0) {
        // Prefer back camera
        const backCamera = devices.find(
          (d) =>
            d.label.toLowerCase().includes("back") ||
            d.label.toLowerCase().includes("rear") ||
            d.label.toLowerCase().includes("environment")
        );
        cameraId = backCamera ? backCamera.id : devices[0].id;
      }

      await html5Qr.start(
        cameraId ? { deviceId: { exact: cameraId } } : { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          setScanResult(decodedText);
          stopCamera();
        },
        () => {
          // decode error — silently ignore (expected when no QR visible)
        }
      );
      setCameraActive(true);
    } catch (error: any) {
      console.error("Error starting QR scanner:", error);
      if (error?.message?.includes("permission")) {
        alert(
          "Camera permission denied. Please allow camera access in your browser settings."
        );
      } else if (error?.message?.includes("No camera")) {
        alert("No camera found. Please check if your device has a camera.");
      } else {
        alert("Unable to start camera. Please check your device permissions.");
      }
      setHasCameraPermission(false);
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const stopCamera = async () => {
    setCameraActive(false);
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
      } catch (_) {
        // ignore
      }
      html5QrRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const toggleFlash = async () => {
    if (!html5QrRef.current) return;
    try {
      const capabilities = html5QrRef.current.getRunningTrackCameraCapabilities();
      const torchFeature = capabilities?.torchFeature?.();
      if (torchFeature?.isSupported()) {
        const newState = !isFlashOn;
        await torchFeature.apply(newState);
        setIsFlashOn(newState);
      }
    } catch (error) {
      console.log("Flash/torch not supported:", error);
    }
  };

  const switchCamera = async () => {
    if (!html5QrRef.current) return;
    try {
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length < 2) return;

      const currentId = devices[0].id;
      const otherId = devices.find((d) => d.id !== currentId)?.id || devices[1].id;
      await stopCamera();
      // Re-init with the other camera
      const html5Qr = new Html5Qrcode("video-container");
      html5QrRef.current = html5Qr;
      await html5Qr.start(
        { deviceId: { exact: otherId } },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
        (decodedText) => {
          setScanResult(decodedText);
          stopCamera();
        },
        () => {}
      );
      setCameraActive(true);
      setIsFlashOn(false);
    } catch (error) {
      console.error("Error switching camera:", error);
    }
  };

  // File upload functions
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploadedImage(URL.createObjectURL(file));

    try {
      const html5Qr = new Html5Qrcode("uploaded-image-container");
      // Decode directly from the file
      const result = await html5Qr.scanFile(file, false);
      setScanResult(result);
    } catch (error: any) {
      if (error?.message?.includes("No MultiFormat Readers")) {
        alert("No QR code found in the image. Please try another image.");
      } else {
        console.error("QR decoding error:", error);
        alert("No QR code found in the image. Please try another image.");
      }
    } finally {
      setUploadedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (html5QrRef.current) {
        try {
          html5QrRef.current.stop().catch(() => {});
        } catch (_) {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.12),transparent_24%),linear-gradient(180deg,#ffffff_0%,#eff6ff_100%)] dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push("/")}
                className="group flex items-center space-x-2"
              >
                <TiptapLogo size="sm" />
              </button>
            </div>

            <button
              onClick={() => router.push("/")}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Scanning Section */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Scan QR Code
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose your preferred scanning method to decode QR codes instantly
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/30 dark:border-gray-700/30">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("camera")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === "camera"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  Camera Scan
                </button>
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === "upload"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          {/* Scanning Content */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/30 dark:border-gray-700/30">
            {activeTab === "camera" ? (
              <div className="text-center">
                {/* Camera Preview */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                  {cameraActive ? (
                    <>
                      {/* html5-qrcode renders its own video element into this div */}
                      <div
                        id="video-container"
                        ref={videoContainerRef}
                        className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
                      />
                      {/* Corner decorations */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-white/30 rounded-2xl pointer-events-none">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white" />
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse" />
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <div className="w-64 h-64 border-4 border-white/30 rounded-2xl relative">
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white" />
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white" />
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white" />
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white" />
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <svg
                          className="w-20 h-20 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={toggleFlash}
                    disabled={!cameraActive}
                    className={`px-6 py-3 rounded-full flex items-center space-x-2 transition-colors ${
                      cameraActive
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                    <span>{isFlashOn ? "Flash On" : "Flash Off"}</span>
                  </button>

                  <button
                    onClick={switchCamera}
                    disabled={!cameraActive}
                    className={`px-6 py-3 rounded-full flex items-center space-x-2 transition-colors ${
                      cameraActive
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Switch Camera</span>
                  </button>
                </div>

                {/* Camera Action Button */}
                {cameraActive ? (
                  <button
                    onClick={stopCamera}
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Stop Camera
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    disabled={isRequestingPermission}
                    className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      isRequestingPermission
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : hasCameraPermission === false
                        ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    }`}
                  >
                    {isRequestingPermission ? (
                      <span className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span>Requesting Access...</span>
                      </span>
                    ) : hasCameraPermission === false ? (
                      "Camera Access Denied"
                    ) : (
                      "Start Camera"
                    )}
                  </button>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  {hasCameraPermission === false
                    ? "Camera access denied. Please check browser permissions or try serving over HTTPS/localhost."
                    : "Position the QR code within the frame to scan automatically"}
                </p>
              </div>
            ) : (
              <div className="text-center">
                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 mb-6 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    {uploadedImage ? (
                      <>
                        {/* Hidden container for html5-qrcode to scan the file */}
                        <div
                          id="uploaded-image-container"
                          className="hidden"
                        />
                        <img
                          src={uploadedImage}
                          alt="Uploaded QR code"
                          className="w-32 h-32 object-contain rounded-lg"
                        />
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Image uploaded! Scanning...
                        </p>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-16 h-16 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>

                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            Drop your QR code image here
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            or click to browse files
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            Supports JPG, PNG, GIF up to 10MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
                >
                  Browse Files
                </button>

                {/* Clear button when image is uploaded */}
                {uploadedImage && (
                  <button
                    onClick={clearUploadedImage}
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4 ml-4"
                  >
                    Clear Image
                  </button>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a clear image of your QR code for instant decoding
                </p>
              </div>
            )}

            {/* Scan Result */}
            {scanResult && (
              <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
                  Scan Successful!
                </h3>
                <p className="text-green-700 dark:text-green-300 break-all mb-4">
                  {scanResult}
                </p>
                <div className="flex space-x-3 flex-wrap">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(scanResult);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => {
                      try {
                        if (
                          scanResult.startsWith("http://") ||
                          scanResult.startsWith("https://")
                        ) {
                          window.open(scanResult, "_blank");
                        } else {
                          window.open(`https://${scanResult}`, "_blank");
                        }
                      } catch (error) {
                        console.error("Error opening URL:", error);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span>Open</span>
                  </button>
                  <button
                    onClick={() => setScanResult("")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/generate")}
              className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span>Need to create a QR code instead?</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Scanning animation */}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(400%);
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
