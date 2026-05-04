import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">

        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
             Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground border-none">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
            Last updated: March 2026
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 prose prose-invert max-w-none space-y-8">

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-none">1. Data Collection</h2>
            <p className="text-muted-foreground leading-relaxed">
              TaskMate collects information that you provide directly to us, including your name, email address, password, phone number, university details, and profile information. When you use our platform, we automatically collect data about your interactions, ip address, browser type, and device details.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-none">2. User Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement state-of-the-art security measures to maintain the safety of your personal information. Your sensitive information, such as passwords, are encrypted. All financial transactions run through secure gateway providers. We do NOT sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-none">3. Cookies Usage</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track the activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform (like persistent logins).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-none">4. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may employ third-party companies and individuals to facilitate our platform, provide the platform on our behalf, perform related services, or assist us in analyzing how our platform is used. These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-none">5. GDPR Compliance</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you are a resident of the European Economic Area (EEA), you have certain data protection rights. TaskMate aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please <Link to="/contact" className="text-primary hover:underline">contact us</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
