import { useState, useRef, useCallback } from "react";
import { Camera, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FaceCaptureProps {
  onCapture: (images: string[]) => void;
  onBack: () => void;
}

export function FaceCapture({ onCapture, onBack }: FaceCaptureProps) {
  const [currentAngle, setCurrentAngle] = useState<"front" | "left" | "right">("front");
  const [capturedImages, setCapturedImages] = useState<Record<string, string>>({});
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const angles = [
    { key: "front", label: "Front View", instruction: "Look straight at the camera" },
    { key: "left", label: "Left Profile", instruction: "Turn your head slightly to the left" },
    { key: "right", label: "Right Profile", instruction: "Turn your head slightly to the right" },
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setError("");
      }
    } catch (err) {
      setError("Unable to access camera. Please grant camera permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImages(prev => ({ ...prev, [currentAngle]: imageData }));
        
        // Move to next angle or finish
        const currentIndex = angles.findIndex(a => a.key === currentAngle);
        if (currentIndex < angles.length - 1) {
          setCurrentAngle(angles[currentIndex + 1].key as any);
        }
      }
    }
  }, [currentAngle]);

  const handleComplete = () => {
    stopCamera();
    onCapture(Object.values(capturedImages));
  };

  const retakeImage = (angle: string) => {
    setCapturedImages(prev => {
      const updated = { ...prev };
      delete updated[angle];
      return updated;
    });
    setCurrentAngle(angle as any);
  };

  const allCaptured = angles.every(a => capturedImages[a.key]);
  const currentAngleData = angles.find(a => a.key === currentAngle);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Face Capture</h3>
        <p className="text-muted-foreground text-sm">
          {currentAngleData?.instruction}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
        {!isCameraActive ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button onClick={startCamera} size="lg">
              <Camera className="mr-2 h-5 w-5" />
              Start Camera
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-4 border-primary/50 rounded-lg pointer-events-none" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Button onClick={captureImage} size="lg" disabled={!!capturedImages[currentAngle]}>
                <Camera className="mr-2 h-5 w-5" />
                Capture
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {angles.map((angle) => (
          <div key={angle.key} className="space-y-2">
            <div className={`aspect-square bg-muted rounded-lg relative overflow-hidden ${
              capturedImages[angle.key] ? "ring-2 ring-primary" : ""
            }`}>
              {capturedImages[angle.key] ? (
                <>
                  <img src={capturedImages[angle.key]} alt={angle.label} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-primary bg-background rounded-full p-0.5" />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => retakeImage(angle.key)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  {angle.label}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleComplete} disabled={!allCaptured} className="flex-1">
          Complete Registration
        </Button>
      </div>
    </div>
  );
}
