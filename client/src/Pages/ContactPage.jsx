const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10">

        <h1 className="text-3xl font-bold mb-6 text-center">📞 Contact Us</h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
          Have questions, feedback, or issues? We'd love to hear from you!
        </p>

        {/* Contact Info */}
        <div className="space-y-6 text-lg">
          <div>
            <h2 className="font-semibold text-xl">📧 Email</h2>
            <p className="text-gray-600 dark:text-gray-300">support@moviemark.com</p>
          </div>

          <div>
            <h2 className="font-semibold text-xl">📱 Phone</h2>
            <p className="text-gray-600 dark:text-gray-300">+91 98765 43210</p>
          </div>

          <div>
            <h2 className="font-semibold text-xl">📍 Address</h2>
            <p className="text-gray-600 dark:text-gray-300">
              MovieMark Headquarters,<br />
              Kochi, Kerala, India.
            </p>
          </div>
        </div>

        {/* Optional Contact Form */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">💬 Send us a message</h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 outline-none"
            />

            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 outline-none"
            ></textarea>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold shadow"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
