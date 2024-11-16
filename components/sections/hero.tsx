"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const reviewers = [
  { 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    alt: "John D." 
  },
  { 
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    alt: "Sarah M." 
  },
  { 
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    alt: "Mike R." 
  },
  { 
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    alt: "Emma L." 
  },
];

export function HeroSection() {
  return (
    <section className="relative pt-24 md:pt-32 pb-16">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)] dark:bg-grid-black/10" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-full rounded-full bg-primary/20 blur-[100px] dark:bg-primary/10" />
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left relative fade-in">
            {/* Small banner */}
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-background/50 backdrop-blur-xl px-2.5 py-0.5 text-xs text-muted-foreground shadow-sm dark:bg-background/20 hover-lift hover-glow">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                <Star className="h-3 w-3 fill-primary" />
                New
              </span>
              <span className="mx-2">Premium channels and sports available!</span>
            </div>

            <div className="space-y-6 slide-up">
              <h1 className="text-xl md:text-5xl lg:text-5xl font-bold leading-tight tracking-tight">
                <span className="relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                  Stream Thousands of
                  </span>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
                </span>
                <br />
                <span className="relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                  Channels, Movies, and Shows Instantly
                  </span>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
                </span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              Access 20,000+ live channels and 80,000+ movies & shows. Premium quality streaming on any device, anywhere.
              </p>
            </div>
            <div className="space-y-4 scale-in">
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="default" className="group hover-lift hover-glow" asChild>
                  <Link href="/#packages">
                    Get Started 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button 
                  size="default" 
                  variant="outline" 
                  className="border-primary/20 hover:border-primary/40 hover-lift" 
                  asChild
                >
                  <Link href="/#features">Learn More</Link>
                </Button>
              </div>
              
              {/* Reviews section */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2">
                  {reviewers.map((reviewer, i) => (
                    <div 
                      key={i} 
                      className="relative h-6 w-6 md:h-8 md:w-8 rounded-full border-2 border-background overflow-hidden hover:scale-110 transition-transform hover-glow"
                      style={{ 
                        transitionDelay: `${i * 100}ms`,
                        animation: `scaleIn 0.5s ease-out ${i * 100}ms backwards`
                      }}
                    >
                      <Image
                        src={reviewer.image}
                        alt={reviewer.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 24px, 32px"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-3 w-3 fill-primary text-primary"
                        style={{ 
                          animation: `scaleIn 0.3s ease-out ${i * 100}ms backwards`
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    from 10,000+ reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:ml-auto relative w-full h-[300px] md:h-[500px] fade-in">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-full h-full hover-lift">
                <Image
                  src="/devices-mockup.png"
                  alt="Multiple devices showing streaming content"
                  fill
                  className="object-contain scale-105 hover:scale-100 transition-transform duration-500"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}