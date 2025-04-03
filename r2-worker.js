export default {
  async fetch(request, env) {
    console.log(`---> Worker received request: ${request.method} ${request.url}`);
    // Get the bucket
    const bucket = env.R2_BUCKET;
    
    // Parse the URL and get the pathname
    const url = new URL(request.url);
    let key = url.pathname.slice(1);
    
    // Log the requested key for debugging
    console.log(`---> Initial key extracted: ${key}`);
    
    // Handle root path
    if (!key || key === '') {
      return new Response('R2 Proxy is running. Request a file with /path/to/file.jpg', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Try to get the object from R2
    console.log(`---> Attempting bucket.get() with key: ${key}`);
    const object = await bucket.get(key);
    console.log(`---> bucket.get(${key}) returned: ${object ? 'object' : 'null'}`);
    
    // If the object doesn't exist, try with URL decoding
    if (object === null) {
      console.log(`---> Object is null, attempting decodeURIComponent`);
      try {
        key = decodeURIComponent(key);
        console.log(`---> Decoded key: ${key}`);
        console.log(`---> Attempting bucket.get() with decoded key: ${key}`);
        const decodedObject = await bucket.get(key);
        console.log(`---> bucket.get(${key}) returned: ${decodedObject ? 'object' : 'null'}`);
        
        if (decodedObject === null) {
          console.log(`---> Decoded object is also null, returning 404`);
          return new Response(`Object "${key}" not found`, { 
            status: 404,
            headers: corsHeaders()
          });
        }
        
        return createObjectResponse(decodedObject);
        
      } catch (err) {
        console.error('---> Error accessing object with decoded key:', err);
        return new Response(`Error: ${err.message}`, { 
          status: 500,
          headers: corsHeaders()
        });
      }
    }
    
    console.log(`---> Found object, creating response`);
    return createObjectResponse(object);
  }
};

// Set CORS headers to allow requests from localhost
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Range',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
    'Access-Control-Max-Age': '86400'
  };
}

// Create a proper response with an R2 object
function createObjectResponse(object) {
  // Create response headers
  const headers = new Headers();
  
  // Add CORS headers
  Object.entries(corsHeaders()).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  // Set content type based on file extension or default to octet-stream
  const contentType = getContentTypeFromKey(object.key);
  headers.set('Content-Type', contentType);
  headers.set('Content-Length', object.size);
  headers.set('ETag', object.etag);
  headers.set('Cache-Control', 'public, max-age=3600');
  
  // Return the response with the object's body
  return new Response(object.body, {
    headers
  });
}

// Get content type based on file extension
function getContentTypeFromKey(key) {
  const extension = key.split('.').pop().toLowerCase();
  const contentTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'pdf': 'application/pdf',
    'css': 'text/css',
    'js': 'text/javascript',
    'html': 'text/html',
    'txt': 'text/plain',
    'json': 'application/json'
  };
  
  return contentTypes[extension] || 'application/octet-stream';
} 