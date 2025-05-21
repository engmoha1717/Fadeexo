import { MapPin, Phone, Mail, Clock, Globe, Building } from "lucide-react";

export function ContactInformation() {
  const contactInfo = [
    {
      icon: Building,
      title: "Main Office",
      details: ["123 Media Avenue", "New York, NY 10001", "United States"],
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "Main Line: (555) 123-4567",
        "News Desk: (555) 123-4568",
        "Advertising: (555) 123-4569",
      ],
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "General Inquiries: info@dailynews.com",
        "News Tips: tips@dailynews.com",
        "Careers: careers@dailynews.com",
      ],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Monday - Friday: 8:00 AM - 8:00 PM",
        "Saturday: 9:00 AM - 5:00 PM",
        "Sunday: Closed",
      ],
    },
    {
      icon: Globe,
      title: "Follow Us",
      details: [
        "Twitter: @DailyNewsOfficial",
        "Facebook: /DailyNewsMedia",
        "Instagram: @dailynews",
      ],
    },
  ];

  const departments = [
    {
      name: "Editorial Department",
      contact: "editorial@dailynews.com",
      phone: "(555) 123-4570"
    },
    {
      name: "Marketing Department",
      contact: "marketing@dailynews.com",
      phone: "(555) 123-4571"
    },
    {
      name: "Technical Support",
      contact: "support@dailynews.com",
      phone: "(555) 123-4572"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
        
        <div className="space-y-6">
          {contactInfo.map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                <ul className="mt-2 space-y-1">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="text-gray-600">{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Departments</h2>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="space-y-4">
            {departments.map((dept, index) => (
              <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                <p className="text-gray-600 mt-1">
                  <a href={`mailto:${dept.contact}`} className="text-blue-600 hover:underline">
                    {dept.contact}
                  </a>
                  {" • "}
                  <span>{dept.phone}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-3">Breaking News?</h3>
        <p className="text-blue-700 mb-4">
          Have an urgent news tip or breaking story? Contact our 24/7 News Desk directly.
        </p>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            <a href="tel:5551234577" className="font-bold">
              (555) 123-4577
            </a>
          </div>
          <span className="text-blue-700">or</span>
          <div>
            <a href="mailto:breaking@dailynews.com" className="text-blue-600 font-bold hover:underline">
              breaking@dailynews.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}