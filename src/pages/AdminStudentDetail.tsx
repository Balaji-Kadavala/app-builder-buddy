import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export default function AdminStudentDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <NavLink to="/admin-students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </NavLink>
        <div>
          <h1 className="text-3xl font-heading font-bold">Student Details</h1>
          <p className="text-muted-foreground">Viewing student ID: {id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>Comprehensive student profile and attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Student details coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
