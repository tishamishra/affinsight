import ContactForm from "@/components/ContactForm";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our affiliate networks or need support? 
              We're here to help you succeed in your affiliate marketing journey.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                We're committed to providing excellent support to our affiliate partners. 
                Reach out to us through any of the channels below.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                  <p className="text-gray-600 mb-2">support@affinsight.com</p>
                  <p className="text-sm text-gray-500">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                  <p className="text-gray-600 mb-2">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">
                    Available Monday-Friday, 9AM-6PM EST
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
                  <p className="text-gray-600 mb-2">
                    123 Affiliate Street<br />
                    Marketing City, MC 12345<br />
                    United States
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                  <p className="text-gray-600 mb-2">
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                    Saturday: 10:00 AM - 4:00 PM EST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 rounded-2xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    How do I join an affiliate network?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Simply browse our networks, click on one that interests you, and follow their registration process.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    What commission rates can I expect?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Commission rates vary by network and offer type, typically ranging from $5 to $50 per conversion.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    How often do you add new networks?
                  </h4>
                  <p className="text-sm text-gray-600">
                    We regularly review and add new affiliate networks to ensure you have access to the best opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 