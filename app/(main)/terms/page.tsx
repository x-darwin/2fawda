export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glassmorphism p-8 space-y-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using StreamVault, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. User Accounts</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Subscription and Billing</h2>
            <p className="text-muted-foreground">
              Subscription fees are billed in advance. You agree to pay all fees associated with your chosen subscription plan.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Content Usage</h2>
            <p className="text-muted-foreground">
              All content provided through StreamVault is protected by copyright and other intellectual property rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Service Modifications</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify or discontinue the service at any time, with or without notice.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}