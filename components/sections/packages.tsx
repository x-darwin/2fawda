"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Shield, CreditCard, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PaymentCardIcons } from "@/components/payment/payment-card-icons";
import { usePostHog } from 'posthog-js/react'

const packages = [
  {
    name: "1-Year Plan",
    price: "$89.99",
    period: "/year",
    description: "Best value for serious streamers",
    features: [
      "Full HD & 4K streaming",
      "20,000+ Live Channels",
      "80,000+ Movies & Shows",
      "PPV Events Included",
      "Cancel anytime",
      "No Contract Required",
      "24/7 support",
    ],
    popular: false,
  },
  {
    name: "2-Year Plan",
    price: "$149.99",
    period: "/2 years",
    description: "Extended entertainment package",
    features: [
      "Everything in 1-Year Plan",
      "Watch on 4 devices",
      "Premium Support Priority",
      "Early access to new features",
      "40,000+ Live Channels",
      "80,000+ Movies & Shows",
      "Exclusive content",
    ],
    popular: true,
  },
];

const securityFeatures = [
  {
    icon: CreditCard,
    title: "Accepted Cards",
    description: "All major cards accepted",
  },
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "256-bit SSL encryption",
  },
  {
    icon: ThumbsUp,
    title: "Satisfaction Guaranteed",
    description: "30-day money back guarantee",
  },
];

export function PackagesSection() {
  const posthog = usePostHog()

  const handlePackageSelect = (packageName: string, price: string) => {
    posthog.capture('package_selected', {
      package_name: packageName,
      package_price: price,
      currency: 'USD'
    })
  }

  return (
    <section className="py-20 fade-in" id="packages">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto slide-up">
            <h2 className="text-4xl font-bold">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Choose Your Plan
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
            Select your perfect streaming package with no hidden fees
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={pkg.name}
                className={`glassmorphism border-0 relative hover-lift hover-glow transition-all duration-300 ${
                  pkg.popular ? "ring-2 ring-primary" : ""
                }`}
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animation: `scaleIn 0.5s ease-out ${index * 200}ms backwards`
                }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-6 py-1.5 text-sm">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="space-y-4 pb-8">
                  <h3 className="text-3xl font-bold">{pkg.name}</h3>
                  <p className="text-lg text-muted-foreground">{pkg.description}</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="mb-8">
                    <span className="text-5xl font-bold">{pkg.price}</span>
                    <span className="text-xl text-muted-foreground ml-2">{pkg.period}</span>
                  </div>
                  <ul className="space-y-4">
                    {pkg.features.map((feature, i) => (
                      <li 
                        key={feature} 
                        className="flex items-center gap-4"
                        style={{ 
                          animationDelay: `${i * 100}ms`,
                          animation: `slideUp 0.5s ease-out ${i * 100}ms backwards`
                        }}
                      >
                        <Check className="h-6 w-6 text-primary shrink-0" />
                        <span className="text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col space-y-8 pt-8">
                  <Button 
                    asChild 
                    className="w-full h-14 text-lg hover-lift hover-glow" 
                    size="lg"
                    onClick={() => handlePackageSelect(pkg.name, pkg.price)}
                  >
                    <Link href={`/payment?plan=${pkg.name.toLowerCase().replace(' ', '-')}`}>
                      Choose Plan
                    </Link>
                  </Button>
                  <div className="w-full space-y-6">
                    <PaymentCardIcons />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {securityFeatures.map((feature, i) => (
                        <div 
                          key={feature.title} 
                          className="flex flex-col items-center space-y-2"
                          style={{ 
                            animationDelay: `${i * 100}ms`,
                            animation: `fadeIn 0.5s ease-out ${i * 100}ms backwards`
                          }}
                        >
                          <feature.icon className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{feature.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}