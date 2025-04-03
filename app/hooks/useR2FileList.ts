'use client';

import { useState, useEffect } from 'react';

interface UseR2FileListResult {
  fileList: string[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useR2FileList(): UseR2FileListResult {
  const [fileList, setFileList] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    const fetchFileList = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/r2files');
        if (!response.ok) {
          throw new Error(`Failed to fetch R2 file list: ${response.statusText}`);
        }
        const data = await response.json();
        if (isMounted) {
          setFileList(data);
        }
      } catch (err) {
        console.error("Error in useR2FileList:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFileList();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false
    };
  }, []); // Empty dependency array means this runs once on mount

  return { fileList, isLoading, error };
} 