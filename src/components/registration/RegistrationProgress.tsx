import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  name: string;
  description: string;
}

interface RegistrationProgressProps {
  currentStep: number;
  steps: Step[];
}

export function RegistrationProgress({ currentStep, steps }: RegistrationProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
              currentStep > step.id ? "bg-primary border-primary text-primary-foreground" :
              currentStep === step.id ? "border-primary text-primary" :
              "border-muted-foreground/30 text-muted-foreground"
            )}>
              {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
            </div>
            <div className="text-center mt-2">
              <p className={cn(
                "text-sm font-medium",
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "absolute top-5 left-1/2 w-full h-0.5 -z-10",
                currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
