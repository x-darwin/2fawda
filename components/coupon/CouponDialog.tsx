"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { CouponForm } from "./CouponForm";
import { Timer, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export function CouponDialog() {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenCouponPopup");
    const neverShow = localStorage.getItem("neverShowCouponPopup");
    
    if (!hasSeenPopup && !neverShow) {
      const timer = setTimeout(() => setOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSuccess = (data: { couponCode: string; validUntil: string; discount: number }) => {
    localStorage.setItem("hasSeenCouponPopup", "true");
    if (dontShowAgain) {
      localStorage.setItem("neverShowCouponPopup", "true");
    }
    
    const validUntil = new Date(data.validUntil).toLocaleDateString();
    toast({
      title: "Special Offer Claimed! 🎉",
      description: `Your $${data.discount} discount code: ${data.couponCode}\nValid until: ${validUntil}`,
    });
  };

  const handleError = (message: string) => {
    toast({
      title: "Unable to claim offer",
      description: message,
      variant: "destructive",
    });
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("neverShowCouponPopup", "true");
    }
    setOpen(false);
  };

  const progressPercentage = (timeLeft / 900) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-md">
        <div className="relative p-6 space-y-6">
          <div className="relative space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm border border-white/10">
                  <Gift className="w-6 h-6 text-primary animate-bounce" />
                </div>
              </div>
              <h2 className="text-2xl font-bold  text-center">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Limited Time Offer
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
              </span>
            </h2>
            <p className="text-muted-foreground  text-center">
            Claim your exclusive $5 discount now.
            </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-center items-center space-x-2">
                <Timer className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">{formatTime(timeLeft)}</span>
              </div>
              <Progress value={progressPercentage} className="h-1" />
            </div>

            <CouponForm onSuccess={handleSuccess} onError={handleError} />

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="dontShowAgain"
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                className="border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="dontShowAgain"
                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
              >
                Don't show this popup again
              </label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}