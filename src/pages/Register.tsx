import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Registration form coming soon...</p>
          <div className="mt-4">
            <NavLink to="/login">
              <Button variant="outline">Back to Login</Button>
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
