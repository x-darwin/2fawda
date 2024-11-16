"use client";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "The quality is phenomenal! I've never experienced such clear 4K content with zero buffering. The sports channels are particularly impressive.",
    author: "Mark Anderson",
    role: "Sports Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    quote: "Having access to over 20,000 channels is amazing. The international content selection is vast, and the VOD library keeps growing every week.",
    author: "Rachel Zhang",
    role: "Movie Buff",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    quote: "Setup was a breeze on all our devices. The customer support team is incredibly helpful and responsive. Best streaming service ever!",
    author: "Tom Martinez",
    role: "Tech Enthusiast",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-background/50 fade-in">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto slide-up">
            <h2 className="text-4xl font-bold">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Customer Stories
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
            Real experiences from our valued customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.author} 
                className="glassmorphism border-0 h-[300px] flex flex-col hover-lift hover-glow transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animation: `scaleIn 0.5s ease-out ${index * 200}ms backwards`
                }}
              >
                <CardContent className="pt-6 flex-grow">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-muted-foreground line-clamp-4">{testimonial.quote}</p>
                </CardContent>
                <CardFooter className="mt-auto border-t border-border/10 pt-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
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