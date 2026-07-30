import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import Link from 'next/link';

export default function PolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Booking Policy
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
                  {/* Booking Process */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Booking Process</h2>
                    <ol className="space-y-3 text-gray-700">
                      <li>1. Submit booking inquiry via website, email, or phone</li>
                      <li>2. Receive detailed tour proposal and quotation within 24-48 hours</li>
                      <li>3. Confirm itinerary and provide traveler details</li>
                      <li>4. Pay deposit to secure booking</li>
                      <li>5. Receive booking confirmation and invoice</li>
                      <li>6. Pay final balance 30 days before departure</li>
                      <li>7. Receive travel documents and pre-departure information</li>
                    </ol>
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Payment Terms</h2>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Deposit & Final Payment</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• <strong>Deposit:</strong> 30% of total tour cost (non-refundable)</li>
                        <li>• <strong>Final Payment:</strong> Due 30 days before departure</li>
                        <li>• <strong>Late Bookings:</strong> Full payment required if booking within 30 days</li>
                      </ul>
                    </div>

                    <div className="mt-4 bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Payment Methods</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Wire Transfer (preferred)</li>
                        <li>• Credit/Debit Card (Visa, MasterCard)</li>
                        <li>• Online Payment Platforms</li>
                        <li>• All payments in USD or equivalent</li>
                      </ul>
                    </div>

                    <div className="mt-4 bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Included in Price</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Accommodation (3-4 star hotels)</li>
                        <li>• All meals (breakfast, lunch, dinner)</li>
                        <li>• Transportation within Bhutan</li>
                        <li>• Licensed English-speaking guide</li>
                        <li>• All permits and entrance fees</li>
                        <li>• Sustainable Development Fee (SDF)</li>
                      </ul>
                    </div>

                    <div className="mt-4 bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Not Included in Price</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• International airfare to/from Bhutan</li>
                        <li>• Travel insurance (mandatory)</li>
                        <li>• Personal expenses (shopping, drinks, tips)</li>
                        <li>• Visa fees (minimal cost)</li>
                        <li>• Optional activities not specified in itinerary</li>
                      </ul>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Cancellation Policy</h2>
                    <div className="bg-red-50 border-l-4 border-red-600 rounded-r-xl p-6">
                      <ul className="space-y-2 text-gray-700">
                        <li>• <strong>30+ days before departure:</strong> Full refund minus deposit</li>
                        <li>• <strong>15-30 days before departure:</strong> 50% refund of total cost</li>
                        <li>• <strong>7-14 days before departure:</strong> 25% refund of total cost</li>
                        <li>• <strong>Less than 7 days:</strong> No refund</li>
                        <li>• <strong>No-show:</strong> No refund or rescheduling</li>
                      </ul>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                      Refunds are processed within 14 business days. All cancellations must be in writing via email.
                    </p>
                  </div>

                  {/* Changes & Modifications */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Changes & Modifications</h2>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Itinerary changes requested more than 30 days prior: No extra charge</li>
                      <li>• Changes 15-30 days prior: Small administrative fee may apply</li>
                      <li>• Changes less than 15 days: Subject to availability and cancellation policies</li>
                      <li>• Force majeure events may require itinerary adjustments at no extra cost</li>
                    </ul>
                  </div>

                  {/* Travel Insurance */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Travel Insurance (Mandatory)</h2>
                    <p className="text-gray-700 leading-relaxed">
                      All travelers must have comprehensive travel insurance covering:
                    </p>
                    <ul className="mt-3 space-y-2 text-gray-700">
                      <li>• Medical emergencies and hospitalization</li>
                      <li>• Emergency evacuation and repatriation</li>
                      <li>• Trip cancellation and interruption</li>
                      <li>• Lost or delayed baggage</li>
                      <li>• Flight delays and cancellations</li>
                    </ul>
                    <p className="mt-3 text-sm text-gray-600">
                      Proof of insurance required before departure.
                    </p>
                  </div>

                  {/* Contact */}
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Questions About Booking?</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Our team is happy to assist with any booking-related questions:
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
                  Book Now
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