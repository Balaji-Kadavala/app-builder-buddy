import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const getStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;

    if (score < 40) return { score, label: "Weak", color: "bg-destructive" };
    if (score < 70) return { score, label: "Medium", color: "bg-yellow-500" };
    return { score, label: "Strong", color: "bg-accent" };
  };

  const strength = getStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Password strength:</span>
        <span className={cn("font-medium", 
          strength.label === "Weak" && "text-destructive",
          strength.label === "Medium" && "text-yellow-500",
          strength.label === "Strong" && "text-accent"
        )}>
          {strength.label}
        </span>
      </div>
      <Progress value={strength.score} className="h-2" />
    </div>
  );
}
