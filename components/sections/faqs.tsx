"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What devices are compatible with your service?",
    answer: "Our service works with all major devices including Smart TVs (Samsung, LG, etc.), Android/iOS devices, Amazon Fire Stick, Android TV Box, MAG devices, computers, and more. Any device that supports IPTV can be used.",
  },
  {
    question: "Do I need a VPN to use your service?",
    answer: "No, our service works without a VPN. You can access all content directly without any additional software or services.",
  },
  {
    question: "What's your uptime guarantee?",
    answer: "We maintain a 99.9% uptime guarantee through our redundant server infrastructure, ensuring minimal service interruptions.",
  },
  {
    question: "How many devices can I use simultaneously?",
    answer: "Our plans support multiple concurrent connections, allowing you to watch on different devices simultaneously. Check our pricing plans for specific details.",
  },
  {
    question: "What's the streaming quality like?",
    answer: "We offer various quality options up to 4K Ultra HD, depending on the channel and your internet connection. Our adaptive streaming technology ensures the best possible quality for your connection speed.",
  },
  {
    question: "Is there a long-term contract?",
    answer: "No, we don't require any long-term commitments. You can choose between our flexible subscription plans with no hidden fees or contracts.",
  },
  {
    question: "How do I get support if I need help?",
    answer: "We provide 24/7 customer support through various channels including live chat, email, and ticket system. Our technical team is always ready to assist you.",
  },
  {
    question: "What content is included in the VOD library?",
    answer: "Our VOD library includes 80,000+ movies and TV shows, from latest releases to classics, international content, and exclusive series.",
  },
];

export function FAQsSection() {
  return (
    <section className="py-16 fade-in" id="faqs">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto slide-up">
            <h2 className="text-4xl font-bold">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Frequently Asked Questions
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
            Find answers to common questions about our IPTV service
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto scale-in">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="glassmorphism border-0 hover-lift hover-glow transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: `scaleIn 0.5s ease-out ${index * 100}ms backwards`
                  }}
                >
                  <AccordionTrigger className="text-left px-6 hover:text-primary transition-colors duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}