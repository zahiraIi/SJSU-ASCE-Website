'use client';

import GoogleDriveImageDebug from '../components/GoogleDriveImageDebug';

export default function ImageDebugPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Image Loading Debug Tool</h1>
      <p className="mb-6">
        Use this tool to test and debug Google Drive image loading. You can enter a Google Drive image URL 
        or a local image path to see how the image utilities process it.
      </p>
      
      <GoogleDriveImageDebug />
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Tips for Google Drive Images</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Make sure your Google Drive folder is set to "Anyone with the link can view"</li>
          <li>The URL should be in the format: <code>https://drive.google.com/file/d/FILE_ID/view</code></li>
          <li>Individual image files need their own sharing links</li>
          <li>For folder URLs, use the format: <code>https://drive.google.com/drive/folders/FOLDER_ID</code></li>
          <li>Check browser console for any CORS errors</li>
          <li>Google Drive may limit bandwidth for frequently accessed images</li>
        </ul>
      </div>
    </div>
  );
} 