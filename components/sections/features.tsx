"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tv, Wifi, Globe2, Shield, Zap, Monitor, Film, Clock, Gamepad2, Smartphone } from "lucide-react";

const features = [
  {
    icon: Tv,
    title: "20,000+ Live Channels",
    description: "Access thousands of international channels in HD and 4K quality.",
  },
  {
    icon: Film,
    title: "80,000+ VOD Content",
    description: "Massive library of movies and TV shows available on demand.",
  },
  {
    icon: Wifi,
    title: "Works with Poor Internet",
    description: "Optimized streaming even with low bandwidth connections.",
  },
  {
    icon: Globe2,
    title: "No VPN Required",
    description: "Access international content without any restrictions.",
  },
  {
    icon: Monitor,
    title: "Multi-Device Support",
    description: "Stream on TVs, phones, computers, and streaming devices.",
  },
  {
    icon: Shield,
    title: "99.9% Uptime",
    description: "Reliable service with minimal interruptions.",
  },
  {
    icon: Zap,
    title: "Ultra-Fast Servers",
    description: "Buffer-free streaming with optimized server network.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer assistance when you need it.",
  },
  {
    icon: Gamepad2,
    title: "Easy Setup",
    description: "Quick and simple setup on all supported devices.",
  },
  {
    icon: Smartphone,
    title: "Smart EPG",
    description: "Interactive program guide for all channels.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 fade-in" id="features">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto slide-up">
            <h2 className="text-4xl font-bold">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Premium Features
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
            Experience the ultimate streaming service with our comprehensive features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="glassmorphism border-0 hover-lift hover-glow transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: `scaleIn 0.5s ease-out ${index * 100}ms backwards`
                }}
              >
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}