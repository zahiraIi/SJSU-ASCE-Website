'use client';

import React, { useState, useEffect } from 'react';
import { getPublicR2Url } from '@/app/lib/r2';

export default function R2DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageTests, setImageTests] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        setLoading(true);
        const response = await fetch('/api/r2debug');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setDebugInfo(data);
        
        // Setup image tests if we have objects
        if (data.objects && data.objects.length > 0) {
          const tests = data.objects.slice(0, 3).map((obj: any) => ({
            key: obj.key,
            directUrl: obj.publicUrl,
            apiUrl: obj.apiUrl,
            directStatus: 'untested',
            apiStatus: 'untested',
            r2ImgStatus: 'untested'
          }));
          setImageTests(tests);
        }
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDebugInfo();
  }, []);

  // Test loading an image directly
  const testDirectImage = async (index: number) => {
    if (!imageTests[index]) return;
    
    const updatedTests = [...imageTests];
    updatedTests[index].directStatus = 'testing';
    setImageTests(updatedTests);
    
    try {
      const response = await fetch(imageTests[index].directUrl, { method: 'HEAD' });
      
      const newTests = [...imageTests];
      newTests[index].directStatus = response.ok ? 'success' : `failed: ${response.status}`;
      setImageTests(newTests);
    } catch (err: any) {
      const newTests = [...imageTests];
      newTests[index].directStatus = `error: ${err.message}`;
      setImageTests(newTests);
    }
  };

  // Test loading an image via API route
  const testApiImage = async (index: number) => {
    if (!imageTests[index]) return;
    
    const updatedTests = [...imageTests];
    updatedTests[index].apiStatus = 'testing';
    setImageTests(updatedTests);
    
    try {
      const response = await fetch(imageTests[index].apiUrl, { method: 'HEAD' });
      
      const newTests = [...imageTests];
      newTests[index].apiStatus = response.ok ? 'success' : `failed: ${response.status}`;
      setImageTests(newTests);
    } catch (err: any) {
      const newTests = [...imageTests];
      newTests[index].apiStatus = `error: ${err.message}`;
      setImageTests(newTests);
    }
  };

  // Check public URL in JS directly
  const checkPublicUrl = () => {
    if (!debugInfo?.config?.r2PublicUrl) {
      return "R2 Public URL not configured";
    }
    
    try {
      const testUrl = getPublicR2Url('test.jpg');
      return testUrl;
    } catch (err: any) {
      return `Error: ${err.message}`;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">R2 Storage Debugger</h1>
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-500 text-red-700 p-4 rounded mb-6">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {debugInfo && (
        <div className="space-y-8">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-3">Configuration</h2>
            <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded border">
              {JSON.stringify(debugInfo.config, null, 2)}
            </pre>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-3">Public URL Test</h2>
            <p className="mb-2">Result of calling getPublicR2Url directly:</p>
            <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded border">
              {checkPublicUrl()}
            </pre>
          </div>
          
          {imageTests.length > 0 && (
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="text-xl font-semibold mb-3">Image Tests</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {imageTests.map((test, index) => (
                  <div key={index} className="bg-white p-4 rounded border">
                    <p className="font-bold mb-2">{test.key}</p>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <p className="text-sm">Direct URL:</p>
                          <button 
                            onClick={() => testDirectImage(index)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Test Direct
                          </button>
                        </div>
                        <p className="text-xs break-all mb-1">{test.directUrl}</p>
                        <div className={`text-xs px-2 py-1 rounded inline-block ${
                          test.directStatus === 'success' ? 'bg-green-100 text-green-800' :
                          test.directStatus === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                          test.directStatus === 'untested' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Status: {test.directStatus}
                        </div>
                        
                        {test.directStatus === 'success' && (
                          <div className="mt-2">
                            <p className="text-xs mb-1">Direct Image:</p>
                            <img 
                              src={test.directUrl} 
                              alt={test.key}
                              className="max-w-full h-auto max-h-40 border rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/fallback.jpg';
                                target.title = 'Error loading image';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <p className="text-sm">API Route URL:</p>
                          <button 
                            onClick={() => testApiImage(index)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Test API
                          </button>
                        </div>
                        <p className="text-xs break-all mb-1">{test.apiUrl}</p>
                        <div className={`text-xs px-2 py-1 rounded inline-block ${
                          test.apiStatus === 'success' ? 'bg-green-100 text-green-800' :
                          test.apiStatus === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                          test.apiStatus === 'untested' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Status: {test.apiStatus}
                        </div>
                        
                        {test.apiStatus === 'success' && (
                          <div className="mt-2">
                            <p className="text-xs mb-1">API Image:</p>
                            <img 
                              src={test.apiUrl} 
                              alt={test.key}
                              className="max-w-full h-auto max-h-40 border rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/fallback.jpg';
                                target.title = 'Error loading image';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {debugInfo.testObject && (
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="text-xl font-semibold mb-3">Test Object Result</h2>
              <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded border">
                {JSON.stringify(debugInfo.testObject, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 