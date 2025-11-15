import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Attendance() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground">Use facial recognition to mark your attendance</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Face Recognition</CardTitle>
          <CardDescription>Position your face in the camera view</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Camera preview will appear here</p>
          </div>
          <Button className="w-full" size="lg">Start Face Scan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
