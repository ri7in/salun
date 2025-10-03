export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">✨ Salun</h3>
            <p className="text-gray-400">
              Premium luxury salon services with the best stylists in town.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/services" className="hover:text-white transition">
                  Services
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition">
                  Book Now
                </a>
              </li>
              <li>
                <a href="/dashboard/client" className="hover:text-white transition">
                  My Bookings
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: hello@salun.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Hours: Mon-Sat 9AM-8PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Salun. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
