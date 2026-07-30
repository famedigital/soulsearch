import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import Link from 'next/link';
import { getCompanyName } from '@/lib/brand';

export default async function TermsPage() {
  const company = await getCompanyName();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Terms & Conditions
              </h1>
              <p className="text-lg text-gray-600">
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
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Introduction</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Welcome to {company}. By using our services and booking our tours,
                      you agree to these Terms & Conditions. Please read them carefully before making a booking.
                    </p>
                  </div>

                  {/* Booking Terms */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Booking & Payment</h2>
                    <ul className="space-y-3 text-gray-700">
                      <li>• All bookings require a non-refundable deposit of 30% to confirm reservation</li>
                      <li>• Full payment must be received 30 days before tour commencement</li>
                      <li>• Payments can be made via bank transfer, credit card, or online payment</li>
                      <li>• Prices are quoted in US Dollars and are valid for the dates specified</li>
                    </ul>
                  </div>

                  {/* Cancellation Policy */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Cancellation Policy</h2>
                    <ul className="space-y-3 text-gray-700">
                      <li>• 30+ days before departure: Full refund minus deposit</li>
                      <li>• 15-30 days before departure: 50% refund</li>
                      <li>• 7-14 days before departure: 25% refund</li>
                      <li>• Less than 7 days: No refund</li>
                    </ul>
                  </div>

                  {/* Travel Requirements */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Travel Requirements</h2>
                    <ul className="space-y-3 text-gray-700">
                      <li>• Valid passport with at least 6 months remaining validity</li>
                      <li>• Bhutan visa (arranged by us with booking details)</li>
                      <li>• Travel insurance (mandatory for all tours)</li>
                      <li>• Medical certificate for high-altitude treks</li>
                    </ul>
                  </div>

                  {/* Liability */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Limitation of Liability</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {company} acts as an intermediary for travel services. We cannot be held
                      responsible for circumstances beyond our control including weather conditions, political
                      unrest, or airline disruptions. We recommend comprehensive travel insurance.
                    </p>
                  </div>

                  {/* Contact */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Contact Us</h2>
                    <p className="text-gray-700 leading-relaxed">
                      For questions about these Terms & Conditions, please contact us at:
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
              Ready to Book Your Tour?
            </h2>
            <p className="text-sm md:text-base text-white/80 mb-6 max-w-xl mx-auto">
              Contact us today to start planning your Bhutan adventure
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <MagneticButton
                  className="rounded-lg px-6 py-3 text-sm font-medium"
                  style={{
                    background: 'var(--color-crimson, #DC143C)',
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