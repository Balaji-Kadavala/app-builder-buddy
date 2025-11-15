import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function History() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Attendance History</h1>
        <p className="text-muted-foreground">View your attendance records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
          <CardDescription>Your attendance history for the past month</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">History records coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
