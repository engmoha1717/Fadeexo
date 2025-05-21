"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

export function ContactMap() {
  const [activeOffice, setActiveOffice] = useState("new-york");

  const offices = {
    "new-york": {
      name: "New York Headquarters",
      address: "123 Media Avenue, New York, NY 10001",
      coordinates: { lat: 40.7484, lng: -73.9857 },
      phone: "(555) 123-4567",
      email: "nyc@dailynews.com"
    },
    "los-angeles": {
      name: "Los Angeles Office",
      address: "456 Press Blvd, Los Angeles, CA 90001",
      coordinates: { lat: 34.0522, lng: -118.2437 },
      phone: "(555) 987-6543",
      email: "la@dailynews.com"
    },
    "chicago": {
      name: "Chicago Bureau",
      address: "789 News Street, Chicago, IL 60601",
      coordinates: { lat: 41.8781, lng: -87.6298 },
      phone: "(555) 456-7890",
      email: "chicago@dailynews.com"
    },
    "miami": {
      name: "Miami Office",
      address: "321 Sunshine Ave, Miami, FL 33101",
      coordinates: { lat: 25.7617, lng: -80.1918 },
      phone: "(555) 234-5678",
      email: "miami@dailynews.com"
    }
  };

  const activeOfficeData = offices[activeOffice as keyof typeof offices];

  return (
    <div>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Locations</h2>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {Object.entries(offices).map(([key, office]) => (
            <button
              key={key}
              onClick={() => setActiveOffice(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeOffice === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {office.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 h-[400px] bg-gray-200 relative">
          {/* Placeholder for actual map integration */}
          <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
            <div className="text-center p-6">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-blue-800">
                Map location: {activeOfficeData.coordinates.lat.toFixed(4)}, {activeOfficeData.coordinates.lng.toFixed(4)}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                This is a placeholder for a Google Maps or Mapbox integration
              </p>
              <div className="mt-4 text-gray-700">
                <p>To implement a real map, you would need to:</p>
                <ol className="text-left ml-6 mt-2 list-decimal">
                  <li>Sign up for a mapping service (Google Maps, Mapbox)</li>
                  <li>Install the required libraries (e.g., @googlemaps/js-api-loader)</li>
                  <li>Replace this placeholder with the actual map component</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{activeOfficeData.name}</h3>
              <p className="text-gray-600 mt-2">{activeOfficeData.address}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Contact</h4>
              <p className="text-gray-600 mt-1">
                Phone: {activeOfficeData.phone}<br />
                Email: <a href={`mailto:${activeOfficeData.email}`} className="text-blue-600 hover:underline">{activeOfficeData.email}</a>
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Hours</h4>
              <p className="text-gray-600 mt-1">
                Monday - Friday: 8:00 AM - 8:00 PM<br />
                Saturday: 9:00 AM - 5:00 PM<br />
                Sunday: Closed
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Visitor Information</h4>
              <p className="text-gray-600 mt-1">
                Visitor parking is available on the street or in the parking garage at 123 Main St.<br />
                Please check in at the reception desk upon arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}