import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Notifications() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with alerts and reminders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>You have no new notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">All notifications will appear here</p>
        </CardContent>
      </Card>
    </div>
  );
}
