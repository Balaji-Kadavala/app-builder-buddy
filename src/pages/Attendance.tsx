import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, MapPin, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Attendance() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [locationStatus, setLocationStatus] = useState<"checking" | "verified" | "failed">("checking");
  const [timeWindowStatus, setTimeWindowStatus] = useState<"active" | "inactive">("inactive");
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkTimeWindow();
    checkLocation();
  }, []);

  const checkTimeWindow = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Morning: 9:45 - 10:45, Evening: 15:45 - 17:30
    const isMorning = (hour === 9 && minute >= 45) || (hour === 10 && minute <= 45);
    const isEvening = (hour === 15 && minute >= 45) || (hour === 16) || (hour === 17 && minute <= 30);
    
    setTimeWindowStatus(isMorning || isEvening ? "active" : "inactive");
  };

  const checkLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real implementation, check if within 5-meter radius
          setLocationStatus("verified");
        },
        (error) => {
          setLocationStatus("failed");
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Unable to verify your location. Please enable location services.",
          });
        }
      );
    } else {
      setLocationStatus("failed");
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access camera. Please grant camera permissions.",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startFaceScan = async () => {
    if (timeWindowStatus !== "active") {
      toast({
        variant: "destructive",
        title: "Not Allowed",
        description: "Attendance can only be marked during active windows.",
      });
      return;
    }

    if (locationStatus !== "verified") {
      toast({
        variant: "destructive",
        title: "Location Not Verified",
        description: "You must be within the classroom area.",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    // Simulate face scanning with progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setAttendanceMarked(true);
            stopCamera();
            toast({
              title: "Attendance Marked",
              description: "Your attendance has been successfully recorded.",
            });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground">Use facial recognition to mark your attendance</p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className={`h-8 w-8 ${timeWindowStatus === "active" ? "text-accent" : "text-muted-foreground"}`} />
              <div>
                <p className="text-sm font-medium">Time Window</p>
                <Badge variant={timeWindowStatus === "active" ? "default" : "secondary"}>
                  {timeWindowStatus === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MapPin className={`h-8 w-8 ${locationStatus === "verified" ? "text-accent" : "text-muted-foreground"}`} />
              <div>
                <p className="text-sm font-medium">Location</p>
                <Badge variant={locationStatus === "verified" ? "default" : locationStatus === "failed" ? "destructive" : "secondary"}>
                  {locationStatus === "verified" ? "Verified" : locationStatus === "failed" ? "Failed" : "Checking..."}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {attendanceMarked ? (
                <CheckCircle className="h-8 w-8 text-accent" />
              ) : (
                <XCircle className="h-8 w-8 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant={attendanceMarked ? "default" : "secondary"}>
                  {attendanceMarked ? "Marked" : "Not Marked"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guidance Message */}
      {!attendanceMarked && timeWindowStatus === "active" && locationStatus === "verified" && (
        <Alert>
          <AlertDescription>
            Position your face clearly within the camera frame. Look straight ahead and ensure good lighting.
          </AlertDescription>
        </Alert>
      )}

      {/* Camera Feed */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Face Recognition</CardTitle>
          <CardDescription>
            {!isCameraActive ? "Start your camera to begin" : "Position your face in the frame"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            {!isCameraActive ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={startCamera} size="lg" disabled={attendanceMarked}>
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
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-80 border-4 border-primary rounded-lg" />
                </div>
                {isScanning && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-background/90 p-6 rounded-lg space-y-3">
                      <p className="font-medium text-center">Scanning face...</p>
                      <Progress value={scanProgress} className="w-48" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {isCameraActive && !attendanceMarked && (
            <div className="flex gap-4">
              <Button variant="outline" onClick={stopCamera} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={startFaceScan} 
                className="flex-1"
                disabled={isScanning || timeWindowStatus !== "active" || locationStatus !== "verified"}
              >
                {isScanning ? "Scanning..." : "Start Face Scan"}
              </Button>
            </div>
          )}

          {attendanceMarked && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-accent mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-accent">Attendance Marked Successfully!</h3>
                <p className="text-muted-foreground">Your attendance has been recorded.</p>
              </div>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Mark Another Session
              </Button>
            </div>
          )}

          {locationStatus === "failed" && (
            <Button variant="outline" onClick={checkLocation} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Location
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
