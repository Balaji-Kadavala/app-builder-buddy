import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavLink } from "@/components/NavLink";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">SF</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome to SFRAS</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="student" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="student-email">Email</Label>
                <Input id="student-email" type="email" placeholder="student@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password">Password</Label>
                <PasswordInput id="student-password" placeholder="Enter your password" />
              </div>
              <Button className="w-full" disabled={isLoading}>
                Sign In as Student
              </Button>
            </TabsContent>
            <TabsContent value="admin" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" placeholder="admin@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <PasswordInput id="admin-password" placeholder="Enter your password" />
              </div>
              <Button className="w-full" disabled={isLoading}>
                Sign In as Admin
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <NavLink to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot Password?
          </NavLink>
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <NavLink to="/register" className="text-primary hover:underline">
              Register here
            </NavLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
