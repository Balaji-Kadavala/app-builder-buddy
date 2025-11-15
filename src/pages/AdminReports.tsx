import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download attendance reports</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Generator</CardTitle>
          <CardDescription>Create custom attendance reports</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Report generation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
