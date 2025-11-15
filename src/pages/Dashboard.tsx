import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Track your attendance here.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
            <CardDescription>Attendance marked</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">Present</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance %</CardTitle>
            <CardDescription>Overall attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
            <CardDescription>Days present</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4/5</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
