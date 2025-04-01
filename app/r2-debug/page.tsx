'use client';

import React, { useState, useEffect } from 'react';
import { getPublicR2Url } from '../lib/r2';

export default function R2DebugPage() {
  const [testResults, setTestResults] = useState<Array<{path: string, url: string, success?: boolean}>>([]);
  
  // Test paths from different folders
  const testPaths = [
    'ASCELOGO/ASCE.png',
    'FGM Pics/DSC00698.JPG',
    'Hike 3-1/IMG_1607.jpg',
    'L&L/jpg/lunchandlearn.jpg',
    'Tabling/ascetabling.jpg',
    'SJSUSPARTANLOGO/sjsuspartanlogo.png',
    'officers/yasmin.JPG',
    'sponsors/kpff.png'
  ];
  
  useEffect(() => {
    // Generate test URLs
    const results = testPaths.map(path => {
      const url = getPublicR2Url(path);
      return { path, url, success: undefined };
    });
    
    setTestResults(results);
    
    // Test each URL by loading the image
    results.forEach((result, index) => {
      const img = new Image();
      
      img.onload = () => {
        setTestResults(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], success: true };
          return updated;
        });
      };
      
      img.onerror = () => {
        setTestResults(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], success: false };
          return updated;
        });
      };
      
      img.src = result.url;
    });
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">R2 URL Debug</h1>
      
      <div className="mb-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
        <p>This page tests direct access to your Cloudflare R2 bucket using the exact URL structure.</p>
        <p className="text-sm mt-2">Public R2 URL format: <code>https://pub-a786dffe79f45f1ad652f22091f210.r2.dev/path/to/file.jpg</code></p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm">
          {`NEXT_PUBLIC_USE_R2_STORAGE: ${process.env.NEXT_PUBLIC_USE_R2_STORAGE}
NEXT_PUBLIC_USE_R2_SIGNED_URLS: ${process.env.NEXT_PUBLIC_USE_R2_SIGNED_URLS}`}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Test Results</h2>
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${
                result.success === undefined ? 'bg-gray-100' : 
                result.success ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <p className="font-bold truncate">Path: {result.path}</p>
              <p className="text-sm text-gray-700 truncate">URL: {result.url}</p>
              <p className="mt-2">
                Status: {
                  result.success === undefined ? 'Testing...' :
                  result.success ? '✅ Success' : '❌ Failed'
                }
              </p>
              {result.success && (
                <div className="mt-3 p-2 border rounded">
                  <img 
                    src={result.url} 
                    alt={result.path} 
                    className="max-h-48 mx-auto"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Next Steps</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>If all tests pass, your R2 bucket is configured correctly</li>
          <li>If some tests fail, check that those files exist in your bucket with the exact paths shown</li>
          <li>If all tests fail, check your CORS configuration or bucket permissions</li>
        </ul>
      </div>
    </div>
  );
} 