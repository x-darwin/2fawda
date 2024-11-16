"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const comparisonData = {
  features: [
    "Number of Channels",
    "VOD Library",
    "4K Quality",
    "No VPN Required",
    "Multiple Devices",
    "24/7 Support",
    "Easy Setup",
    "No Contract",
    "Catch-up TV",
    "EPG Support",
  ],
  providers: [
    {
      name: "StreamVault",
      values: [
        "20,000+",
        "80,000+",
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      highlight: true,
    },
    {
      name: "Traditional Cable",
      values: [
        "200+",
        "Limited",
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        true,
      ],
    },
    {
      name: "Basic IPTV",
      values: [
        "5,000+",
        "10,000+",
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
      ],
    },
  ],
};

export function ComparisonSection() {
  return (
    <section className="py-24 relative fade-in" id="comparison">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto slide-up">
            <h2 className="text-4xl font-bold">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                  Why We're Better
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See how StreamVault compares to other streaming services
            </p>
          </div>

          <Card className="glassmorphism border-0 overflow-hidden scale-in">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/10">
                      <th className="text-left p-4">Features</th>
                      {comparisonData.providers.map((provider, index) => (
                        <th
                          key={provider.name}
                          className={cn(
                            "p-4 text-center",
                            provider.highlight && "text-primary"
                          )}
                        >
                          {provider.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.features.map((feature, rowIndex) => (
                      <tr
                        key={feature}
                        className="border-b border-border/10 hover:bg-primary/5 transition-colors"
                      >
                        <td className="p-4 text-muted-foreground">{feature}</td>
                        {comparisonData.providers.map((provider, colIndex) => (
                          <td
                            key={`${feature}-${provider.name}`}
                            className={cn(
                              "p-4 text-center",
                              provider.highlight && "text-primary"
                            )}
                          >
                            {typeof provider.values[rowIndex] === "boolean" ? (
                              provider.values[rowIndex] ? (
                                <Check className="h-5 w-5 mx-auto text-green-500" />
                              ) : (
                                <X className="h-5 w-5 mx-auto text-red-500" />
                              )
                            ) : (
                              provider.values[rowIndex]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}