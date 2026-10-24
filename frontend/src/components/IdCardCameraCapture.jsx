import React, { useRef, useState, useEffect } from 'react';
import { FiCamera, FiRefreshCw, FiCheck, FiAlertCircle, FiShield } from 'react-icons/fi';

const IdCardCameraCapture = ({ onIdCardCapture, isCaptured = false }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      let mediaStream = null;
      try {
        // Prefer back camera for scanning physical card on mobile, fallback to user webcam
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 }, 
            facingMode: { ideal: 'environment' } 
          },
          audio: false
        });
      } catch (errEnvironment) {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      }

      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied or unavailable. Please enable browser camera permissions.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream && !previewUrl) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, previewUrl]);

  const captureIdCard = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        if (onIdCardCapture) {
          onIdCardCapture(blob);
        }
      }
    }, 'image/jpeg', 0.9);
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    if (onIdCardCapture) {
      onIdCardCapture(null);
    }
    startCamera();
  };

  return (
    <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 shadow-sm">
      {/* Header Label */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <FiShield className="text-primary text-sm" />
          <span>Student ID Card Verification</span>
          <span className="text-red-500 font-bold">*</span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
          Live Camera Only
        </span>
      </div>

      <p className="text-[11px] text-slate-500 mb-3 leading-normal">
        Hold your physical college ID card up to the camera. Live photo capture is mandatory to prevent unauthorized accounts.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-2.5 rounded-xl text-xs flex items-center gap-2 mb-3">
          <FiAlertCircle className="flex-shrink-0 text-base" />
          <span>{error}</span>
        </div>
      )}

      {/* Viewfinder / Preview Box */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-[16/10] flex items-center justify-center border border-slate-300/80 shadow-inner">
        {previewUrl ? (
          // Captured Snapshot
          <div className="relative w-full h-full">
            <img 
              src={previewUrl} 
              alt="Live Captured ID" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow backdrop-blur-sm">
              <FiCheck /> Captured
            </div>
          </div>
        ) : (
          // Live Video Stream with ID Framing Box
          <div className="relative w-full h-full flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            {/* ID Card Overlay Guideline */}
            <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-white/80 rounded-lg pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <span className="text-[10px] font-bold tracking-wider text-white/90 uppercase drop-shadow">
                EEC Student ID Card
              </span>
              <span className="text-[10px] font-semibold text-center text-white/80 bg-black/40 px-2 py-0.5 rounded self-center backdrop-blur-xs">
                Align ID card within frame
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex gap-2">
        {previewUrl ? (
          <button
            type="button"
            onClick={handleRetake}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <FiRefreshCw className="text-sm" /> Recapture ID Card
          </button>
        ) : (
          <button
            type="button"
            onClick={captureIdCard}
            className="flex-1 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98]"
          >
            <FiCamera className="text-base" /> Capture Live ID Card
          </button>
        )}
      </div>

      {previewUrl && (
        <div className="mt-2 text-center text-[11px] font-semibold text-emerald-600 flex items-center justify-center gap-1">
          <FiCheck className="text-sm" /> Live ID Card attached and ready for verification
        </div>
      )}
    </div>
  );
};

export default IdCardCameraCapture;
