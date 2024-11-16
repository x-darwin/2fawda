export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glassmorphism p-8 space-y-8">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Information Collection</h2>
            <p className="text-muted-foreground">
              We collect information that you provide directly to us, including personal information such as name, email address, and payment details.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Use of Information</h2>
            <p className="text-muted-foreground">
              We use collected information to provide, maintain, and improve our services, process transactions, and send communications.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Cookie Policy</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to enhance your browsing experience and analyze usage patterns.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
            <p className="text-muted-foreground">
              Our service may contain links to third-party websites. We are not responsible for their privacy practices.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}