export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Modern Card Design */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gold/20">
          
          {/* Enhanced Header with Gradient */}
          <div className="bg-gradient-to-r from-black via-gray-900 to-black p-8 border-b border-gold/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent"></div>
            <div className="relative">
              <h1 className="text-4xl font-serif font-bold text-white mb-3">
                Privacy Policy
              </h1>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-gold text-lg">Bellebyokien Ready-to-Wear</p>
                <div className="bg-gold border border-gold/20 rounded-lg px-4 py-2">
                  <p className="text-gold text-sm font-medium">
                    Effective: January 22, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8 bg-gray-900">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                At Bellebyokien, we are committed to protecting your privacy and personal style. This Privacy Policy explains how we collect, use, and protect the personal information you provide when visiting our boutique website, shopping our collections, or engaging with our brand.
              </p>

              <div className="space-y-10">
                {/* Section 1 */}
                <section className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">1</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-serif">
                      Style Information We Collect
                    </h2>
                  </div>
                  <div className="ml-11">
                    <p className="text-white/80 mb-4">
                      To enhance your shopping experience, we may collect:
                    </p>
                    <ul className="space-y-3 text-white/80">
                      {['Personal details: name, email, phone number for order processing', 'Shipping address and size preferences for perfect fit', 'Payment information (securely processed through trusted partners)', 'Style preferences and wishlist items to personalize recommendations', 'Social media interactions when you engage with our fashion content'].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Section 2 */}
                <section className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">2</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-serif">
                      How We Use Your Style Profile
                    </h2>
                  </div>
                  <div className="ml-11">
                    <p className="text-white/80 mb-4">
                      We use your information to create a seamless fashion experience:
                    </p>
                    <ul className="space-y-3 text-white/80">
                      {['Process orders and deliver your carefully curated pieces', 'Provide personalized styling advice and collection previews', 'Offer customer support for your fashion inquiries', 'Share new collection launches and exclusive events (with consent)', 'Improve our designs based on contemporary women\'s preferences'].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Section 3 */}
                <section className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">3</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-serif">
                      Data Security & Style Integrity
                    </h2>
                  </div>
                  <div className="ml-11 space-y-3 text-white/80">
                    <p>
                      We treat your personal information with the same care we put into our designs. We never sell or share your style preferences with third parties for marketing purposes.
                    </p>
                    <p>
                      Your data is shared only with essential partners (shipping carriers, payment processors) to fulfill your orders, protected by industry-standard security measures.
                    </p>
                  </div>
                </section>

                {/* Section 4 */}
                <section className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">4</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-serif">
                      Your Style Rights
                    </h2>
                  </div>
                  <div className="ml-11">
                    <p className="text-white/80 mb-4">
                      You have complete control over your fashion journey:
                    </p>
                    <ul className="space-y-3 text-white/80">
                      {['Access and update your personal style profile', 'Correct any information in your account', 'Request deletion of your data (where applicable)', 'Opt out of fashion communications at any time', 'Manage your size and preference settings'].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Section 5 & 6 Side by Side on Desktop */}
                <div className="grid md:grid-cols-2 gap-8">
                  <section className="group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">5</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white font-serif">
                        Boutique Experience
                      </h2>
                    </div>
                    <div className="ml-11">
                      <p className="text-white/80">
                        Our website uses cookies to enhance your digital boutique experience, remembering your preferences and helping us understand how contemporary women interact with our collections.
                      </p>
                    </div>
                  </section>

                  <section className="group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">6</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white font-serif">
                        Collection Updates
                      </h2>
                    </div>
                    <div className="ml-11">
                      <p className="text-white/80">
                        As our collections evolve, we may update this policy. Changes will be reflected here with updated effective dates, ensuring transparency in our relationship.
                      </p>
                    </div>
                  </section>
                </div>
              </div>

              {/* Contact Button */}
              <div className="mt-12 pt-8 border-t border-gold/20 text-center">
                <p className="text-gold/80 mb-4 font-serif italic">
                  For questions about your privacy or style preferences
                </p>
                <button className="bg-gradient-to-r from-gold to-yellow-600 text-black font-semibold py-3 px-8 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-gold/25">
                  Contact Our Style Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
