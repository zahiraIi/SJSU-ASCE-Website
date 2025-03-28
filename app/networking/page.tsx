import React from 'react';
import Link from 'next/link';

export default function NetworkingPage() {
  // Update with actual networking event details
  const upcomingEvent = {
    title: "Spring Industry Networking Night",
    date: "May 10, 2024",
    time: "5:00 PM - 8:00 PM",
    location: "Engineering Building, Room 285",
    description: "Connect with industry professionals from leading civil engineering firms.",
    registerBy: "May 5, 2024"
  };
  
  // Update with actual companies
  const registeredCompanies = [
    { name: "AECOM", industry: "Architecture & Engineering" },
    { name: "Kimley-Horn", industry: "Civil Engineering & Planning" },
    { name: "BKF Engineers", industry: "Civil Engineering" },
    { name: "Jacobs", industry: "Technical Professional Services" },
    { name: "Caltrans", industry: "Transportation" }
  ];
  
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <h1 className="section-title text-center mb-12">Networking Events</h1>
        
        {/* Upcoming Networking Event */}
        <div className="bg-white border rounded-lg p-8 mb-16">
          <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            Upcoming Event
          </span>
          <h2 className="text-3xl font-bold mb-2">{upcomingEvent.title}</h2>
          <div className="mb-6">
            <p className="text-lg mb-1">
              <strong>Date:</strong> {upcomingEvent.date}
            </p>
            <p className="text-lg mb-1">
              <strong>Time:</strong> {upcomingEvent.time}
            </p>
            <p className="text-lg mb-1">
              <strong>Location:</strong> {upcomingEvent.location}
            </p>
            <p className="text-lg mb-1">
              <strong>Register by:</strong> {upcomingEvent.registerBy}
            </p>
          </div>
          <p className="text-lg mb-6">{upcomingEvent.description}</p>
          <Link 
            href="https://forms.google.com/your-registration-form" // Update with actual registration form
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Register Now
          </Link>
        </div>
        
        {/* Preparation Tips */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How to Prepare</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Before the Event</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Research participating companies</li>
                <li>Update your resume (bring printed copies)</li>
                <li>Prepare your elevator pitch</li>
                <li>Plan professional attire</li>
                <li>Prepare thoughtful questions for recruiters</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-4">During the Event</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Arrive 15 minutes early</li>
                <li>Introduce yourself confidently</li>
                <li>Ask meaningful questions</li>
                <li>Collect business cards</li>
                <li>Take notes after each conversation</li>
                <li>Network with peers and professionals</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Registered Companies */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Registered Companies</h2>
          <p className="mb-6">
            The following companies have confirmed their attendance at our upcoming networking event. 
            More will be added as they register.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 border">Company</th>
                  <th className="text-left p-4 border">Industry</th>
                </tr>
              </thead>
              <tbody>
                {registeredCompanies.map((company, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 border">{company.name}</td>
                    <td className="p-4 border">{company.industry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            *Company list is updated regularly. Check our Google Calendar for the most current information.
          </p>
          <div className="mt-8">
            <Link 
              href="https://calendar.google.com/your-calendar-link" // Update with actual calendar link
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              View Event in Google Calendar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 