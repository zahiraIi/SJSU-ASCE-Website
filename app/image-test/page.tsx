import ImageTester from '../components/ImageTester';

export default function ImageTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Google Drive Image Testing</h1>
      <p className="mb-8">
        This page helps debug and test the mapping between local image paths and Google Drive images.
        It demonstrates how the website handles image loading from Google Drive when local paths are used.
      </p>
      
      <ImageTester />
      
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">How it works</h2>
        <p className="mb-2">
          The image utility maps local paths (e.g., <code>/images/Photos/Tabling/ascetabling.jpg</code>) 
          to Google Drive file IDs. This allows the website to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Keep the same file paths in components</li>
          <li>Host images on Google Drive instead of the local filesystem</li>
          <li>Avoid needing to copy large files into the Git repository</li>
        </ul>
        <p>
          To add more images, edit the <code>PATH_TO_ID_MAP</code> in <code>app/utils/imageUtils.ts</code>.
        </p>
      </div>
    </div>
  );
} 