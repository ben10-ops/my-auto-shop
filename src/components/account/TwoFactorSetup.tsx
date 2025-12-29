import { useState } from "react";
import { Shield, ShieldCheck, ShieldOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TwoFactorSetupProps {
  isEnabled: boolean;
  onUpdate: () => void;
}

export const TwoFactorSetup = ({ isEnabled, onUpdate }: TwoFactorSetupProps) => {
  const [step, setStep] = useState<"idle" | "setup" | "verify">("idle");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const startSetup = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Authenticator App",
      });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setStep("setup");
    } catch (error: any) {
      toast.error(error.message || "Failed to start 2FA setup");
    }
    setIsLoading(false);
  };

  const verifyAndEnable = async () => {
    if (verifyCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];

      if (!totpFactor) {
        toast.error("No TOTP factor found");
        return;
      }

      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId: totpFactor.id });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;

      toast.success("Two-factor authentication enabled!");
      setStep("idle");
      setVerifyCode("");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    }
    setIsLoading(false);
  };

  const disable2FA = async () => {
    setIsLoading(true);
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];

      if (totpFactor) {
        const { error } = await supabase.auth.mfa.unenroll({
          factorId: totpFactor.id,
        });
        if (error) throw error;
      }

      toast.success("Two-factor authentication disabled");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to disable 2FA");
    }
    setIsLoading(false);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEnabled) {
    return (
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <h3 className="font-medium text-green-400">2FA Enabled</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Your account is protected with two-factor authentication.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={disable2FA}
          disabled={isLoading}
          className="text-destructive border-destructive/50 hover:bg-destructive/10"
        >
          <ShieldOff className="w-4 h-4 mr-2" />
          {isLoading ? "Disabling..." : "Disable 2FA"}
        </Button>
      </div>
    );
  }

  if (step === "idle") {
    return (
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-medium">Two-Factor Authentication</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Add an extra layer of security using an authenticator app.
        </p>
        <Button onClick={startSetup} disabled={isLoading} size="sm">
          {isLoading ? "Setting up..." : "Enable 2FA"}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <h3 className="font-medium mb-4">Set Up Two-Factor Authentication</h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            1. Scan this QR code with your authenticator app:
          </p>
          <div className="w-40 h-40 bg-white rounded-lg p-2 mx-auto">
            <img src={qrCode} alt="QR Code" className="w-full h-full" />
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Or enter this code manually:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded bg-muted text-sm font-mono break-all">
              {secret}
            </code>
            <Button variant="ghost" size="icon" onClick={copySecret}>
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">
            2. Enter the 6-digit code from your app:
          </p>
          <input
            type="text"
            value={verifyCode}
            onChange={(e) =>
              setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            className="w-full h-12 px-4 text-center text-2xl font-mono tracking-widest rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setStep("idle");
              setVerifyCode("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={verifyAndEnable} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify & Enable"}
          </Button>
        </div>
      </div>
    </div>
  );
};
