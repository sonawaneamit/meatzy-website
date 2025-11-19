import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col w-full overflow-x-hidden bg-meatzy-tallow font-sans -mt-[140px]">

      {/* Hero Section */}
      <section className="relative bg-meatzy-olive text-white pt-56 pb-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <span className="text-meatzy-rare font-marker text-3xl md:text-4xl mb-4 block transform -rotate-1">Get In Touch</span>
          <h1 className="text-5xl md:text-7xl font-black font-slab uppercase mb-6 leading-none">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl font-light leading-relaxed">
            We're here to help with any questions about our premium meat boxes
          </p>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Information */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-8 leading-none">
                Let's Talk
              </h2>
              <p className="text-meatzy-olive/80 text-lg leading-relaxed mb-12">
                Have questions about our products, subscription plans, or need help with your order? Our team is ready to assist you.
              </p>

              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-meatzy-rare rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-2">Email Us</h3>
                    <a href="mailto:support@getmeatzy.com" className="text-meatzy-olive/80 hover:text-meatzy-rare transition-colors text-lg">
                      support@getmeatzy.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-meatzy-welldone rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-2">Call Us</h3>
                    <a href="tel:+18883016328" className="text-meatzy-olive/80 hover:text-meatzy-rare transition-colors text-lg">
                      +1 888-301-MEAT (6328)
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-meatzy-dill rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-2">Visit Us</h3>
                    <p className="text-meatzy-olive/80 text-lg leading-relaxed">
                      16690 Collins Ave Suite 1102<br />
                      Sunny Isles Beach, FL 33160
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-meatzy-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-2">Business Hours</h3>
                    <p className="text-meatzy-olive/80 text-lg leading-relaxed">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday - Sunday: 10:00 AM - 4:00 PM EST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-meatzy-tallow p-8 md:p-12 rounded-xl border border-meatzy-mint/50 shadow-lg">
              <h2 className="text-3xl md:text-4xl font-black font-slab text-meatzy-olive uppercase mb-6 leading-none">
                Send Us A Message
              </h2>
              <form className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-display font-bold uppercase tracking-widest text-meatzy-olive mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-meatzy-rare focus:outline-none transition-colors font-sans"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-display font-bold uppercase tracking-widest text-meatzy-olive mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-meatzy-rare focus:outline-none transition-colors font-sans"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-display font-bold uppercase tracking-widest text-meatzy-olive mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-meatzy-rare focus:outline-none transition-colors font-sans"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-display font-bold uppercase tracking-widest text-meatzy-olive mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-meatzy-rare focus:outline-none transition-colors font-sans"
                    placeholder="How can we help?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-display font-bold uppercase tracking-widest text-meatzy-olive mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-meatzy-rare focus:outline-none transition-colors font-sans resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-meatzy-rare text-white py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-24 bg-meatzy-tallow">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-8 leading-none">
            Quick Answers
          </h2>
          <p className="text-meatzy-olive/80 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Looking for quick answers? Check out our most frequently asked questions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/products/keto-box" className="bg-white p-6 rounded-xl border border-meatzy-mint/50 shadow-lg hover:shadow-2xl transition-all group">
              <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-2 group-hover:text-meatzy-rare transition-colors">
                Product Info
              </h3>
              <p className="text-meatzy-olive/70">Learn about our boxes</p>
            </a>
            <a href="/affiliate" className="bg-white p-6 rounded-xl border border-meatzy-mint/50 shadow-lg hover:shadow-2xl transition-all group">
              <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-2 group-hover:text-meatzy-rare transition-colors">
                Referral Program
              </h3>
              <p className="text-meatzy-olive/70">Earn cash for sharing</p>
            </a>
            <a href="/#how-it-works" className="bg-white p-6 rounded-xl border border-meatzy-mint/50 shadow-lg hover:shadow-2xl transition-all group">
              <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-2 group-hover:text-meatzy-rare transition-colors">
                How It Works
              </h3>
              <p className="text-meatzy-olive/70">See our process</p>
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
