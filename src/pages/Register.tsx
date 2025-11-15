import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { NavLink } from "@/components/NavLink";
import { RegistrationProgress } from "@/components/registration/RegistrationProgress";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { FaceCapture } from "@/components/registration/FaceCapture";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const steps = [
  { id: 1, name: "Personal Info", description: "Basic details" },
  { id: 2, name: "Face Capture", description: "Biometric data" },
  { id: 3, name: "Complete", description: "Finish setup" },
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [faceImages, setFaceImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const termsAccepted = watch("termsAccepted");

  const onPersonalInfoSubmit = (data: RegisterFormData) => {
    setCurrentStep(2);
  };

  const handleFaceCapture = (images: string[]) => {
    setFaceImages(images);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    const formData = watch();
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            name: formData.name,
            roll_number: formData.rollNumber,
          }
        }
      });

      if (authError) throw authError;

      // In a real implementation, you would:
      // 1. Process face images with face-api.js
      // 2. Generate face embeddings
      // 3. Encrypt embeddings
      // 4. Store in Supabase storage/database

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>Create your account to get started with SFRAS</CardDescription>
          <RegistrationProgress currentStep={currentStep} steps={steps} />
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <form onSubmit={handleSubmit(onPersonalInfoSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input id="rollNumber" placeholder="2024001" {...register("rollNumber")} />
                  {errors.rollNumber && <p className="text-sm text-destructive">{errors.rollNumber.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="student@example.com" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput 
                  id="password" 
                  placeholder="Create a strong password" 
                  {...register("password")}
                  onChange={(e) => {
                    register("password").onChange(e);
                    setPassword(e.target.value);
                  }}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                <PasswordStrengthIndicator password={password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput id="confirmPassword" placeholder="Re-enter your password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setValue("termsAccepted", checked as boolean)}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I accept the{" "}
                    <button type="button" onClick={() => setShowTerms(true)} className="text-primary hover:underline">
                      terms and conditions
                    </button>
                  </label>
                  {errors.termsAccepted && <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <NavLink to="/login" className="flex-1">
                  <Button variant="outline" type="button" className="w-full">
                    Back to Login
                  </Button>
                </NavLink>
                <Button type="submit" className="flex-1">
                  Next: Face Capture
                </Button>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <FaceCapture 
              onCapture={handleFaceCapture}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-accent">Registration Complete!</h3>
                <p className="text-muted-foreground">
                  Your account has been created successfully. Click below to complete the process.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {faceImages.map((img, i) => (
                  <img key={i} src={img} alt={`Face ${i + 1}`} className="rounded-lg" />
                ))}
              </div>
              <Button onClick={handleFinalSubmit} size="lg" className="w-full">
                Complete Registration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Please read and accept our terms and conditions to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm max-h-96 overflow-y-auto">
            <p>By registering for the Smart Facial Recognition Attendance System (SFRAS), you agree to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide accurate personal information and biometric data</li>
              <li>Use the system only for legitimate attendance purposes</li>
              <li>Not attempt to manipulate or bypass facial recognition</li>
              <li>Maintain the confidentiality of your login credentials</li>
              <li>Allow the system to store encrypted facial embeddings for authentication</li>
              <li>Comply with institutional attendance policies</li>
            </ul>
            <p className="text-muted-foreground">
              Your biometric data is stored securely as encrypted embeddings. No raw images are retained after processing.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
