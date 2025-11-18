import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 mt-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            🎬 MovieMark
          </h2>
          <p className="text-sm leading-relaxed">
            Discover, review, and rate your favorite movies. Stay updated on
            trending releases and share your opinions with the world.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Movies
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Reviews
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Connect With Us
          </h3>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
              <Facebook size={22} />
            </a>
            <a href="#" className="hover:text-pink-600 dark:hover:text-pink-400">
              <Instagram size={22} />
            </a>
            <a href="#" className="hover:text-sky-600 dark:hover:text-sky-400">
              <Twitter size={22} />
            </a>
            <a href="#" className="hover:text-red-600 dark:hover:text-red-400">
              <Youtube size={22} />
            </a>
          </div>
          <p className="text-sm">Email: support@moviemark.com</p>
          <p className="text-sm">Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-gray-700"></div>

      <div className="text-center py-4 text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} MovieMark. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
