"use client";

import Image from "next/image";

const brands = [
  { name: "Netflix", logo: "/images/brands/netflix.svg" },
  { name: "Disney+", logo: "/images/brands/disney.svg" },
  { name: "HBO", logo: "/images/brands/hbo.svg" },
  { name: "Prime", logo: "/images/brands/prime.svg" },
  { name: "Hulu", logo: "/images/brands/hulu.svg" },
  { name: "Laliga", logo: "/images/brands/LaLiga.svg" },
  { name: "Premiere League", logo: "/images/brands/Premier_League.svg" },
  { name: "UEFA", logo: "/images/brands/UEFA_Champions_League.svg" },
  { name: "BEIN Sport", logo: "/images/brands/Bein_sport.svg" },
  { name: "ESPN", logo: "/images/brands/ESPN.svg" },  
];

export function TrustedBySection() {
  return (
    <section className="py-12 md:py-20 fade-in">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <div className="text-center space-y-4 slide-up">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                  Trusted by Top Global Media Platforms
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access content from the world's leading providers and live sports channels.
            </p>
          </div>
          
          <div className="relative overflow-hidden scale-in">
            {/* Gradient fade edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
            
            {/* Scrolling brands */}
            <div className="overflow-hidden">
              <div className="flex space-x-16 animate-infinite-scroll">
                {[...brands, ...brands].map((brand, index) => (
                  <div
                    key={`${brand.name}-${index}`}
                    className="relative w-32 md:w-40 h-16 md:h-20 flex-shrink-0 transition-all duration-300"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: `fadeIn 0.5s ease-out ${index * 100}ms backwards`
                    }}
                  >
                    <div className="relative w-full h-full p-2">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain brand-logo transition-transform duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}