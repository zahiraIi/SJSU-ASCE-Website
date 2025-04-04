import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import R2Image from '../components/R2Image';

export default function MembershipPage() {
  // Update with your actual Google Form URL
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfiECNFkhvyP4djptSQvhvxF5ZIKC-blItT9iIoPi72tuesZA/viewform";
  
  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-96 bg-sjsu-gradient-alt opacity-10"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-primary opacity-5"></div>
        <div className="absolute bottom-0 -left-24 w-96 h-96 rounded-full bg-secondary opacity-5"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h5 className="text-primary uppercase tracking-wider font-medium mb-2">SJSU ASCE</h5>
          <h1 className="section-title">Become a Member</h1>
        </div>
        
        {/* What you can get section - matching the image style */}
        <div className="max-w-6xl mx-auto mb-16 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6">What you can get with ASCE membership</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-primary hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Network with professionals</h3>
                <p className="text-gray-700">Build connections with industry professionals and potential employers through our events and partnerships.</p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-secondary hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Gain practical experience</h3>
                <p className="text-gray-700">Participate in competitions and projects that give you hands-on experience solving real engineering challenges.</p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-primary hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Leadership development</h3>
                <p className="text-gray-700">Develop leadership skills by taking on roles in project teams, committees, or as chapter officers.</p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-secondary hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Technical workshops</h3>
                <p className="text-gray-700">Access specialized workshops and training in civil engineering software, techniques, and emerging technologies.</p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-primary hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Resume enhancement</h3>
                <p className="text-gray-700">Add valuable experiences and achievements to your resume that make you stand out to employers.</p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-secondary hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Scholarship opportunities</h3>
                <p className="text-gray-700">Access to ASCE scholarships and awards available exclusively to student chapter members.</p>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md">
              <R2Image 
                path="asce-membership.png"
                alt="ASCE Membership Benefits" 
                className="w-full h-auto"
                style={{ maxHeight: '350px', objectFit: 'cover', objectPosition: 'center' }}
              />
              <div className="bg-primary p-4 text-white text-center">
                <p className="font-medium">Join our community of civil engineering students and professionals!</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-8 items-start">
          {/* Left column - membership requirements */}
          <div className="md:col-span-3 bg-white p-8 rounded-lg shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-secondary opacity-5 rounded-full -mr-20 -mt-20"></div>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-primary text-white p-2 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Membership Requirements
            </h2>
            
            <p className="mb-6 text-lg">To become a member of SJSU ASCE, you must:</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-primary mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Be a student at San Jose State University</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Have an interest in civil engineering or related fields</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Pay the annual membership fee ($30 for local chapter membership)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Complete the membership application form</span>
              </li>
            </ul>
            
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-secondary">
              <h3 className="font-bold mb-2">Join today for the full 2024 experience!</h3>
              <p>Our chapter has been serving SJSU civil engineering students for over three decades, providing specialized opportunities for academic and professional growth.</p>
            </div>
          </div>
          
          {/* Right column - application button */}
          <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mb-6">
              <div className="mx-auto w-32 h-32 relative mb-4">
                <R2Image 
                  path="ASCELOGO/ascelogo.png"
                  alt="ASCE Logo" 
                  className="w-full h-full object-contain mx-auto"
                  width={128}
                  height={128}
                />
              </div>
              <h3 className="text-xl font-bold">Ready to join?</h3>
              <p className="text-gray-600 mt-2 mb-6">Complete our membership form to get started with SJSU ASCE.</p>
            </div>
            
            <Link 
              href={googleFormUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary w-full text-lg px-8 py-4 mb-4"
            >
              Apply Now
            </Link>
            
            <p className="text-sm text-gray-600">
              You will be redirected to a Google Form to complete your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 