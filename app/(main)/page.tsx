import { Suspense } from "react";
import { HeroSection } from "@/components/sections/hero";
import { TrustedBySection } from "@/components/sections/trusted-by";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FeaturesSection } from "@/components/sections/features";
import { FAQsSection } from "@/components/sections/faqs";
import { ReviewsSection } from "@/components/sections/reviews";
import { PackagesSection } from "@/components/sections/packages";
import { ContactSection } from "@/components/sections/contact";
import { ComparisonSection } from "@/components/sections/comparison";
import { HomeAnalytics } from "@/components/analytics/home-analytics";
import { CouponDialog } from "@/components/coupon/CouponDialog";
import { Skeleton } from "@/components/ui/skeleton";

// Loading skeletons for each section
const SectionSkeleton = () => (
  <div className="space-y-4 p-8">
    <Skeleton className="h-8 w-1/3 mx-auto" />
    <Skeleton className="h-4 w-2/3 mx-auto" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-lg" />
      ))}
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="relative">
      <HomeAnalytics />
      <CouponDialog />
      
      <Suspense fallback={<SectionSkeleton />}>
        <HeroSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <TrustedBySection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturesSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <WhyChooseUsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <ComparisonSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <ReviewsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <PackagesSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <FAQsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <ContactSection />
      </Suspense>
    </div>
  );
}