export default function RefundPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glassmorphism p-8 space-y-8">
          <h1 className="text-3xl font-bold">Refund Policy</h1>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Refund Eligibility</h2>
            <p className="text-muted-foreground">
              We offer a 30-day money-back guarantee on all new subscriptions. If you're not satisfied with our service, you can request a full refund within this period.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Refund Process</h2>
            <p className="text-muted-foreground">
              To request a refund, contact our support team through the WhatsApp button or email. Refunds are typically processed within 5-7 business days.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Non-Refundable Items</h2>
            <p className="text-muted-foreground">
              Partial months of service and any additional services or add-ons are non-refundable.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Cancellation Policy</h2>
            <p className="text-muted-foreground">
              You can cancel your subscription at any time. After cancellation, you'll continue to have access until the end of your current billing period.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about our refund policy, please don't hesitate to contact our support team.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}