"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const reviews = [
  {
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    review: "Crystal clear 4K quality and zero buffering. The channel selection is incredible!",
    verified: true,
  },
  {
    name: "Sarah Miller",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    review: "Works perfectly on all our devices. The kids love the cartoon channels!",
    verified: true,
  },
  {
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    review: "Best IPTV service I've tried. The sports channels are amazing.",
    verified: true,
  },
  {
    name: "Emma Thompson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    review: "Huge movie library and great international channels. Worth every penny!",
    verified: true,
  },
  {
    name: "Michael Lee",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    review: "The EPG works flawlessly. Customer support is always helpful.",
    verified: true,
  },
  {
    name: "Lisa Garcia",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 4,
    review: "Great selection of premium channels. Setup was super easy.",
    verified: true,
  },
  {
    name: "Robert Taylor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    review: "No more cable bills! This service has everything I need.",
    verified: true,
  },
  {
    name: "Anna Martinez",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    review: "The VOD library is massive. New content added regularly!",
    verified: true,
  },
];

export function ReviewsSection() {
  return (
    <section className="py-16 fade-in" id="reviews">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto slide-up">
            <h2 className="text-4xl font-bold">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Customer Reviews
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
            See what our satisfied customers have to say
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <Card 
                key={index} 
                className="glassmorphism border-0 h-[250px] flex flex-col hover-lift hover-glow transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: `scaleIn 0.5s ease-out ${index * 100}ms backwards`
                }}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src={review.avatar} alt={review.name} />
                      <AvatarFallback>{review.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {review.name}
                        {review.verified && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-primary text-primary"
                            style={{ 
                              animationDelay: `${i * 100}ms`,
                              animation: `scaleIn 0.3s ease-out ${i * 100}ms backwards`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-3 flex-grow">{review.review}</p>
                  {review.verified && (
                    <Badge variant="secondary" className="mt-4 w-fit">
                      Verified Customer
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}