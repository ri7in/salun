import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            Welcome to ✨ <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Salun</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Experience luxury beauty services with seamless online booking, payment, and appointment management.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/services"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              Browse Services
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4">💇‍♀️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Services</h3>
              <p className="text-gray-600">
                Choose from a wide range of luxury salon services including haircuts, styling, coloring, and treatments.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Easy Booking</h3>
              <p className="text-gray-600">
                Book appointments instantly with our Calendly integration. Select your preferred staff and time slot.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Payment</h3>
              <p className="text-gray-600">
                Pay securely at the time of booking with Stripe. Receive instant email confirmations for your appointments.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Services</h3>
                <p className="text-gray-600">
                  Explore our comprehensive catalog of luxury salon services and choose what you need.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select Staff & Time</h3>
                <p className="text-gray-600">
                  Pick your preferred stylist and schedule an appointment using our integrated calendar system.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pay & Confirm</h3>
                <p className="text-gray-600">
                  Complete your booking with secure payment and receive instant email confirmation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Look?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who trust Salun for their beauty needs.
            </p>
            <Link
              href="/services"
              className="inline-block px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
