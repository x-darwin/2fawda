"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentForm } from "@/components/payment/payment-form";
import { PaymentCardIcons } from "@/components/payment/payment-card-icons";
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan');
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('checkout_page_view', {
      selected_plan: selectedPlan
    });
  }, [selectedPlan, posthog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    posthog.capture('checkout_completed', {
      selected_plan: selectedPlan
    });
    
    router.push("/success");
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="glassmorphism border-0">
            <CardHeader>
              <h2 className="text-3xl font-bold  text-center">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Complete Your Order
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
              </span>
            </h2>
            <p className="text-muted-foreground  text-center">
            Enter your payment details to continue
            </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <PaymentCardIcons />
              <PaymentForm 
                onSubmit={handleSubmit} 
                initialPackage={selectedPlan === '2-year-plan' ? '2year' : '1year'}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}