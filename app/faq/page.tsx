import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FAQ {
  question: string;
  answer: React.ReactNode;
  category: string;
}

export default function FAQPage() {
  // Update with actual FAQs
  const faqs: FAQ[] = [
    {
      question: "How do I become a member of SJSU ASCE?",
      answer: (
        <>
          <p>
            To become a member, you need to fill out our membership form and pay the annual membership fee of $30.
            Visit our <Link href="/membership" className="text-primary hover:underline">Membership page</Link> for more information.
          </p>
        </>
      ),
      category: "Membership"
    },
    {
      question: "What are the benefits of joining SJSU ASCE?",
      answer: (
        <>
          <p>
            Members gain access to networking events, workshops, competitions, and professional development opportunities. 
            You'll build connections with industry professionals, gain hands-on experience, and enhance your resume with valuable 
            experiences that make you stand out to employers.
          </p>
        </>
      ),
      category: "Membership"
    },
    {
      question: "When and where are the general meetings held?",
      answer: (
        <>
          <p>
            Our general meetings are typically held on Thursdays from 5:00 PM to 6:00 PM in the Engineering Building, Room 189.
            Meeting dates and times may change, so please check our calendar for the most up-to-date information.
          </p>
        </>
      ),
      category: "Events"
    },
    {
      question: "How can I join a competition team?",
      answer: (
        <>
          <p>
            Competition teams typically recruit members at the beginning of the fall semester. Attend our kick-off events
            in August/September to learn about the different teams and how to join. You can also reach out directly to the 
            team captains via our <Link href="/officers" className="text-primary hover:underline">Officers page</Link>.
          </p>
        </>
      ),
      category: "Competitions"
    },
    {
      question: "Do I need to be a civil engineering major to join ASCE?",
      answer: (
        <>
          <p>
            No, while ASCE is primarily for civil engineering students, we welcome students from all majors who are interested
            in civil engineering or related fields. Many of our members come from environmental engineering, construction management,
            and other related disciplines.
          </p>
        </>
      ),
      category: "Membership"
    },
    {
      question: "How can I get involved in leadership positions?",
      answer: (
        <>
          <p>
            Officer elections are held annually in the spring semester. Active members who have demonstrated commitment to the chapter
            can run for positions. You can also gain leadership experience by leading subcommittees or project teams throughout the year.
          </p>
        </>
      ),
      category: "Leadership"
    }
  ];

  // Group FAQs by category
  const categoriesSet = new Set(faqs.map(faq => faq.category));
  const categories = Array.from(categoriesSet);
  const groupedFaqs = categories.map(category => ({
    category,
    items: faqs.filter(faq => faq.category === category)
  }));

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white to-gray-50">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary opacity-5 rounded-full"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-secondary opacity-5 rounded-full"></div>
      </div>
      
      <div className="container-custom relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h5 className="text-primary uppercase tracking-wider font-medium mb-2">Got Questions?</h5>
          <h1 className="section-title">Frequently Asked Questions</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Find answers to common questions about SJSU ASCE membership, events, and activities.
          </p>
        </div>
        
        {/* Main content with sidebar layout */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Left sidebar - categories */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4 pb-2 border-b">Categories</h2>
              <nav>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <a 
                        href={`#${category.toLowerCase()}`} 
                        className="flex items-center py-2 px-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-primary transition-colors"
                      >
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        {category}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold mb-2">Need more help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you can't find the answer to your question, feel free to contact us.
                </p>
                <Link 
                  href="/contact" 
                  className="btn btn-primary w-full text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right content - FAQ accordions */}
          <div className="md:col-span-3">
            {groupedFaqs.map((group, groupIndex) => (
              <div 
                key={groupIndex} 
                id={group.category.toLowerCase()}
                className="mb-12"
              >
                <div className="flex items-center mb-6">
                  <span className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-lg mr-4">
                    {group.category === "Membership" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {group.category === "Events" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {group.category === "Competitions" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                    {group.category === "Leadership" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                  </span>
                  <h2 className="text-2xl font-bold">{group.category} Questions</h2>
                </div>
                
                <div className="space-y-4">
                  {group.items.map((faq, faqIndex) => (
                    <details 
                      key={faqIndex} 
                      className="bg-white rounded-lg shadow-md overflow-hidden group"
                    >
                      <summary className="flex justify-between items-center p-5 cursor-pointer">
                        <h3 className="text-xl font-semibold">{faq.question}</h3>
                        <span className="rounded-full bg-gray-100 p-1.5 text-primary group-open:rotate-180 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                        <div className="pt-4 prose max-w-none text-gray-600">{faq.answer}</div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-20 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 bg-sjsu-gradient text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Still have questions?</h2>
              <p className="mb-6">
                We're here to help! Reach out to us directly if you need more information about SJSU ASCE.
              </p>
              <Link 
                href="/contact" 
                className="inline-block bg-white text-primary font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
              >
                Contact Us
              </Link>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-4">Visit us in person</h3>
              <p className="mb-3">
                <strong>Office Hours:</strong> Monday-Friday, 10:00 AM - 4:00 PM
              </p>
              <p className="mb-3">
                <strong>Location:</strong> Engineering Building, Room 137
              </p>
              <p>
                <strong>Email:</strong> asce.sjsu@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 