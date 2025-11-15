import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage students and monitor attendance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
            <CardDescription>Registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">250</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
            <CardDescription>Present today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">215</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Attendance</CardTitle>
            <CardDescription>Below 80%</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">12</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate</CardTitle>
            <CardDescription>Overall average</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">86%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
