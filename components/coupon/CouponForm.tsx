"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

interface CouponFormProps {
  onSuccess: (data: { couponCode: string; validUntil: string; discount: number }) => void;
  onError: (message: string) => void;
}

export function CouponForm({ onSuccess, onError }: CouponFormProps) {
  const [couponData, setCouponData] = useState<{
    couponCode: string;
    validUntil: string;
    discount: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/coupons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate coupon");
      }

      setCouponData({
        couponCode: data.couponCode,
        validUntil: data.validUntil,
        discount: data.discount,
      });
      onSuccess({
        couponCode: data.couponCode,
        validUntil: data.validUntil,
        discount: data.discount,
      });
    } catch (error) {
      onError(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  }

  const copyToClipboard = async () => {
    if (couponData?.couponCode) {
      await navigator.clipboard.writeText(couponData.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (couponData) {
    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-b from-background/80 to-background p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          <div className="relative space-y-4">
            <div className="space-y-1.5">
              <div className="text-sm text-muted-foreground">Your Discount Code:</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xl font-medium tracking-wider bg-background/40 p-3 rounded-md border border-border/50">
                  {couponData.couponCode}
                </code>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={copyToClipboard}
                  className="h-12 w-12 shrink-0"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Valid until: {new Date(couponData.validUntil).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="Email address" 
                  {...field}
                  className="bg-background/40 border-border/50 focus:border-primary/50 focus:ring-primary/20" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="Phone number" 
                  {...field}
                  className="bg-background/40 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-primary/90 hover:bg-primary text-primary-foreground transition-all duration-200"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : (
            "Claim Your $5 Discount"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By claiming this offer, you agree to receive promotional emails. You can unsubscribe at any time.
        </p>
      </form>
    </Form>
  );
}