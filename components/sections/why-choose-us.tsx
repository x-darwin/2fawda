"use client";

import { Tv, Zap, Shield, Headphones, Globe2, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Tv,
    title: "Massive Content Library",
    description: "Access 20,000+ live channels and 80,000+ on-demand titles, including premium sports, movies, and shows.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Zap,
    title: "Ultra-Fast Streaming",
    description: "Experience buffer-free streaming with our optimized server network and adaptive quality.",
    gradient: "from-yellow-500/10 to-orange-500/10",
    iconColor: "text-yellow-500",
  },
  {
    icon: Shield,
    title: "99.9% Uptime",
    description: "Enjoy uninterrupted entertainment with our reliable and stable service infrastructure.",
    gradient: "from-pink-500/10 to-rose-500/10",
    iconColor: "text-pink-500",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description: "Get instant assistance from our dedicated technical support team whenever you need it.",
    gradient: "from-purple-500/10 to-violet-500/10",
    iconColor: "text-purple-500",
  },
  {
    icon: Globe2,
    title: "No VPN Required",
    description: "Access all content directly without any restrictions or additional software needed.",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: Wifi,
    title: "Works Everywhere",
    description: "Compatible with poor internet connections and all streaming devices.",
    gradient: "from-red-500/10 to-rose-500/10",
    iconColor: "text-red-500",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-24 relative overflow-hidden fade-in" id="why-choose-us">
      <div className="container mx-auto px-4 relative">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto slide-up">
            <h2 className="text-4xl font-bold">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                  Why Choose StreamVault?
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover why we're the leading choice for premium streaming
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-xl backdrop-blur-sm p-10 transition-all duration-300 hover:scale-[1.02] bg-background/50 hover:bg-background/80 border border-border/50 hover-lift hover-glow"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animation: `scaleIn 0.5s ease-out ${index * 200}ms backwards`
                }}
              >
                <div className="relative space-y-8">
                  <div className="h-16 w-16 rounded-xl flex items-center justify-center bg-background/50 transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className={cn("h-10 w-10", feature.iconColor)} />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}