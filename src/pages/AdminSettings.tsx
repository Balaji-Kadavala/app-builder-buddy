import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">System Settings</h1>
        <p className="text-muted-foreground">Configure attendance windows and locations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Configuration</CardTitle>
          <CardDescription>Manage attendance windows and geofencing</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings configuration coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
