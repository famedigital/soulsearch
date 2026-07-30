import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import Link from 'next/link';
import { getCompanyName } from '@/lib/brand';

export default async function PrivacyPage() {
  const company = await getCompanyName();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <div className="space-y-8">
                  {/* Introduction */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Information We Collect</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {company} collects personal information to provide and improve our services.
                      This includes:
                    </p>
                    <ul className="mt-3 space-y-2 text-foreground/80">
                      <li>• Name and contact details (email, phone, address)</li>
                      <li>• Passport information for visa processing</li>
                      <li>• Travel preferences and requirements</li>
                      <li>• Payment information for bookings</li>
                      <li>• Travel insurance details</li>
                    </ul>
                  </div>

                  {/* How We Use Information */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">How We Use Your Information</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We use your information to:
                    </p>
                    <ul className="mt-3 space-y-2 text-foreground/80">
                      <li>• Process bookings and travel arrangements</li>
                      <li>• Arrange Bhutan visas and permits</li>
                      <li>• Communicate about your tour and updates</li>
                      <li>• Provide customer support</li>
                      <li>• Improve our services and tailor experiences</li>
                    </ul>
                  </div>

                  {/* Data Protection */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Data Protection & Security</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We implement appropriate security measures to protect your personal information:
                    </p>
                    <ul className="mt-3 space-y-2 text-foreground/80">
                      <li>• Secure data storage and transmission</li>
                      <li>• Limited access to personal information</li>
                      <li>• Regular security assessments</li>
                      <li>• Compliance with data protection regulations</li>
                    </ul>
                  </div>

                  {/* Information Sharing */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Information Sharing</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We may share your information with:
                    </p>
                    <ul className="mt-3 space-y-2 text-foreground/80">
                      <li>• Bhutan tourism authorities for permits and visas</li>
                      <li>• Hotels and transport providers for bookings</li>
                      <li>• Travel insurance providers (if applicable)</li>
                      <li>• Payment processors for transactions</li>
                    </ul>
                    <p className="mt-3 text-foreground/80 leading-relaxed">
                      We never sell your personal information to third parties.
                    </p>
                  </div>

                  {/* Your Rights */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Your Rights</h2>
                    <p className="text-gray-700 leading-relaxed">
                      You have the right to:
                    </p>
                    <ul className="mt-3 space-y-2 text-foreground/80">
                      <li>• Access your personal information</li>
                      <li>• Correct inaccurate information</li>
                      <li>• Request deletion of your data</li>
                      <li>• Opt-out of marketing communications</li>
                      <li>• Withdraw consent where applicable</li>
                    </ul>
                  </div>

                  {/* Contact */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Contact Us</h2>
                    <p className="text-gray-700 leading-relaxed">
                      For privacy concerns or requests, please contact us at:
                    </p>
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-700">Phone: +975 17643416</p>
                      <p className="text-gray-700">Address: Thimphu, Bhutan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3 text-white">
              Plan Your Bhutan Adventure
            </h2>
            <p className="text-sm md:text-base text-white/80 mb-6 max-w-xl mx-auto">
              Your privacy matters to us. Book with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <MagneticButton
                  className="rounded-lg px-6 py-3 text-sm font-medium"
                  style={{
                    background: 'var(--primary)',
                    color: '#FFFFFF'
                  }}
                >
                  Contact Us
                </MagneticButton>
              </Link>
              <Link href="/tours">
                <MagneticButton
                  className="rounded-lg px-6 py-3 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                >
                  View Tours
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}