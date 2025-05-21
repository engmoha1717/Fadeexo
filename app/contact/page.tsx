import { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInformation } from "@/components/contact/contact";
import { ContactMap } from "@/components/contact/contact-map";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Contact Us | Daily News",
  description: "Get in touch with the Daily News team. We're here to help with your questions, feedback, and news tips.",
  keywords: "contact, feedback, news tips, daily news, contact information",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                We're here to help with your questions, feedback, and news tips. 
                Our team is dedicated to delivering accurate news and addressing your concerns.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <ContactInformation />
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <ContactMap />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How can I submit a news tip?
                  </h3>
                  <p className="text-gray-600">
                    You can submit news tips through our contact form, or directly email our news desk at 
                    <a href="mailto:tips@dailynews.com" className="text-blue-600 hover:underline"> tips@dailynews.com</a>. 
                    All submissions are reviewed by our editorial team.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How do I report an error in an article?
                  </h3>
                  <p className="text-gray-600">
                    We strive for accuracy in all our reporting. Please contact our correction desk at 
                    <a href="mailto:corrections@dailynews.com" className="text-blue-600 hover:underline"> corrections@dailynews.com</a> 
                    with the article title, the error you've identified, and any supporting information.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How can I advertise with Daily News?
                  </h3>
                  <p className="text-gray-600">
                    For advertising inquiries, please contact our advertising department at 
                    <a href="mailto:advertising@dailynews.com" className="text-blue-600 hover:underline"> advertising@dailynews.com</a> 
                    or call us at (555) 123-4567. We offer both print and digital advertising opportunities.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Do you offer internships or job opportunities?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we regularly offer internships and job positions. Visit our Careers page for current openings, 
                    or send your resume to 
                    <a href="mailto:careers@dailynews.com" className="text-blue-600 hover:underline"> careers@dailynews.com</a> 
                    for future consideration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}