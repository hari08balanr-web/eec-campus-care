import React, { useRef, useState, useEffect } from 'react';
import { FiCamera, FiVideo, FiRefreshCw, FiCheck, FiAlertCircle } from 'react-icons/fi';

const CameraCapture = ({ onPhotoCapture, onVideoCapture }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('live'); // 'live', 'photo', 'video'
  const [error, setError] = useState(null);

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startCamera = async () => {
    try {
      setError(null);
      let mediaStream = null;
      try {
        // Try requesting video + audio
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, 
          audio: true 
        });
      } catch (errWithAudio) {
        // Fallback to video only if microphone is unavailable or denied
        console.warn("Could not get audio track, falling back to video only:", errWithAudio);
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, 
          audio: false 
        });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access unavailable. Please ensure your camera is connected and browser permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Re-attach stream to video element when returning to live tab
  useEffect(() => {
    if (activeTab === 'live' && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [activeTab, stream]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPhotoPreview(url);
        onPhotoCapture(blob);
        setActiveTab('photo');
      }
    }, 'image/jpeg', 0.85);
  };

  const startRecording = () => {
    if (!stream) return;
    recordedChunksRef.current = [];
    
    const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? { mimeType: 'video/webm;codecs=vp9' }
      : { mimeType: 'video/webm' };
      
    try {
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoPreview(url);
        onVideoCapture(blob);
        setActiveTab('video');
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (e) {
      console.error("MediaRecorder start failed:", e);
      alert("Failed to start video recording. Your browser may not support WebM recording.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearPhoto = () => {
    setPhotoPreview(null);
    onPhotoCapture(null);
    setActiveTab('live');
  };

  const clearVideo = () => {
    setVideoPreview(null);
    onVideoCapture(null);
    setActiveTab('live');
  };

  return (
    <div className="glass-card p-6 border border-white/60">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            Live Evidence Camera
          </h3>
          <p className="text-xs opacity-70">
            For security, photos and videos must be captured live through your browser camera.
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          {photoPreview && (
            <button 
              type="button"
              onClick={() => setActiveTab('photo')}
              className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
                activeTab === 'photo' ? 'bg-primary text-white shadow-sm' : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <FiCheck /> Photo Saved
            </button>
          )}
          {videoPreview && (
            <button 
              type="button"
              onClick={() => setActiveTab('video')}
              className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
                activeTab === 'video' ? 'bg-primary text-white shadow-sm' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              <FiCheck /> Video Saved
            </button>
          )}
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-red-50/80 border border-red-200 rounded-xl text-center space-y-3">
          <FiAlertCircle className="text-red-500 text-3xl mx-auto" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
          <button 
            type="button" 
            onClick={startCamera} 
            className="btn-outline text-xs !py-1.5 !px-3"
          >
            <FiRefreshCw /> Retry Camera Access
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main Viewport */}
          <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-700/30 flex items-center justify-center">
            
            {activeTab === 'live' && (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse shadow-lg">
                    <span className="w-2.5 h-2.5 bg-white rounded-full" />
                    REC 00:{recordingTime.toString().padStart(2, '0')} / 00:30
                  </div>
                )}

                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-md">
                  Live View
                </div>
              </>
            )}

            {activeTab === 'photo' && photoPreview && (
              <div className="relative w-full h-full">
                <img src={photoPreview} alt="Live Captured" className="w-full h-full object-contain" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-md transition-colors"
                  >
                    Retake Photo
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'video' && videoPreview && (
              <div className="relative w-full h-full">
                <video src={videoPreview} controls className="w-full h-full object-contain" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    type="button"
                    onClick={clearVideo}
                    className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-md transition-colors"
                  >
                    Retake Video
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {activeTab !== 'live' && (
              <button 
                type="button"
                onClick={() => setActiveTab('live')}
                className="btn-outline text-xs !py-2 !px-4"
              >
                <FiCamera /> Back to Live Camera
              </button>
            )}

            <button 
              type="button"
              onClick={() => {
                setActiveTab('live');
                capturePhoto();
              }}
              disabled={isRecording}
              className="btn-primary"
            >
              <FiCamera className="text-lg" /> 
              {photoPreview ? 'Recapture Photo' : 'Capture Live Photo'}
            </button>
            
            {isRecording ? (
              <button 
                type="button"
                onClick={stopRecording} 
                className="btn-primary !bg-red-600 hover:!bg-red-700 animate-pulse"
              >
                Stop Recording ({30 - recordingTime}s left)
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => {
                  setActiveTab('live');
                  startRecording();
                }} 
                className="btn-outline"
              >
                <FiVideo className="text-lg" /> 
                {videoPreview ? 'Record Again (Max 30s)' : 'Record Live Video (Max 30s)'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
