import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Camera, Smartphone, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { profileUpdateSchema, passwordChangeSchema, type ProfileUpdateFormData, type PasswordChangeFormData } from "@/lib/validations/auth";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Profile() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [deviceSwitchRequests, setDeviceSwitchRequests] = useState(1); // Out of 3
  const { toast } = useToast();

  const profileForm = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      rollNumber: "2024001",
    }
  });

  const passwordForm = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onProfileSubmit = (data: ProfileUpdateFormData) => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditingProfile(false);
  };

  const onPasswordSubmit = (data: PasswordChangeFormData) => {
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    });
    passwordForm.reset();
  };

  const handleDeviceSwitchRequest = () => {
    if (deviceSwitchRequests >= 3) {
      toast({
        variant: "destructive",
        title: "Limit Reached",
        description: "You have reached the maximum device switches for this month.",
      });
      return;
    }

    toast({
      title: "Request Submitted",
      description: "Your device switch request has been sent to admin for approval.",
    });
    setDeviceSwitchRequests(prev => prev + 1);
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Your profile picture used across the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=student" 
              alt="Profile" 
              className="h-24 w-24 rounded-full border-2 border-primary"
            />
            <div className="space-y-2">
              <Button variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Update Photo
              </Button>
              <p className="text-sm text-muted-foreground">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
            >
              {isEditingProfile ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  {...profileForm.register("name")} 
                  disabled={!isEditingProfile}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input 
                  id="rollNumber" 
                  {...profileForm.register("rollNumber")} 
                  disabled={!isEditingProfile}
                />
                {profileForm.formState.errors.rollNumber && (
                  <p className="text-sm text-destructive">{profileForm.formState.errors.rollNumber.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                {...profileForm.register("email")} 
                disabled={!isEditingProfile}
              />
              {profileForm.formState.errors.email && (
                <p className="text-sm text-destructive">{profileForm.formState.errors.email.message}</p>
              )}
            </div>

            {isEditingProfile && (
              <Button type="submit">Save Changes</Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Device Information */}
      <Card>
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
          <CardDescription>Manage your registered device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Current Device</p>
                <p className="text-sm text-muted-foreground">Chrome on Windows • Registered 15 days ago</p>
              </div>
            </div>
            <Badge>Active</Badge>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Device switches remaining this month: <strong>{3 - deviceSwitchRequests}/3</strong>
            </AlertDescription>
          </Alert>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={deviceSwitchRequests >= 3}>
                Request Device Switch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Device Switch</DialogTitle>
                <DialogDescription>
                  Submit a request to switch to a new device. This requires admin approval.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You can switch devices up to 3 times per month. Current usage: {deviceSwitchRequests}/3
                </p>
                <Button onClick={handleDeviceSwitchRequest} className="w-full">
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your password and security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <PasswordInput id="currentPassword" {...passwordForm.register("currentPassword")} />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput id="newPassword" {...passwordForm.register("newPassword")} />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <PasswordInput id="confirmNewPassword" {...passwordForm.register("confirmPassword")} />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit">Change Password</Button>
          </form>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Face Recognition Data</p>
                  <p className="text-sm text-muted-foreground">Re-register your facial biometrics</p>
                </div>
              </div>
              <Button variant="outline">Re-register Face</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
