// Script to verify all company URLs in the sponsors data

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Path to sponsors file
const sponsorsFilePath = path.join(__dirname, '../app/sponsors/page.tsx');

// Function to extract URLs from sponsors data
function extractUrls() {
  try {
    // Read the file
    const content = fs.readFileSync(sponsorsFilePath, 'utf8');
    
    // Regular expression to match URL entries in the sponsors data
    const urlRegex = /url:\s*['"]([^'"]+)['"]/g;
    const matches = content.matchAll(urlRegex);
    
    // Store URLs with context
    const urls = [];
    for (const match of matches) {
      // Find the company name for this URL
      const lineStart = content.lastIndexOf('{', match.index);
      const nameMatch = content.substring(lineStart, match.index).match(/name:\s*['"]([^'"]+)['"]/);
      
      if (nameMatch) {
        urls.push({
          company: nameMatch[1],
          url: match[1]
        });
      } else {
        urls.push({
          company: 'Unknown',
          url: match[1]
        });
      }
    }
    
    return urls;
  } catch (error) {
    console.error('Error reading sponsors file:', error);
    return [];
  }
}

// Function to check if a URL is valid
async function checkUrl(url, company) {
  try {
    // Add a timeout to avoid hanging too long on one request
    const response = await axios.get(url, { 
      timeout: 10000,
      headers: {
        // Some sites block requests without a user agent
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      // Don't follow redirects to see if they're properly set up
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects (3xx) and success (2xx)
      }
    });
    
    return {
      url,
      company,
      status: response.status,
      success: true,
      message: `Success: ${response.status}`
    };
  } catch (error) {
    let errorMessage = 'Unknown error';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = `Status: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }
    
    return {
      url,
      company,
      status: error.response ? error.response.status : 'N/A',
      success: false,
      message: errorMessage
    };
  }
}

// Function to get a suggested fix for the URL
function suggestFix(url) {
  // Check for common issues and suggest fixes
  if (!url.startsWith('http')) {
    return `Add http:// or https:// prefix: https://${url}`;
  }
  
  if (url.includes('www') && !url.includes('://www.')) {
    return url.replace('www', 'www.');
  }
  
  return null;
}

// Main function to check all URLs
async function verifyUrls() {
  const urls = extractUrls();
  console.log(`Found ${urls.length} URLs to check`);
  
  const results = [];
  for (const { url, company } of urls) {
    console.log(`Checking ${company}'s URL: ${url}`);
    
    // Skip checking urls that are internal links
    if (url.startsWith('/')) {
      results.push({
        url, 
        company,
        status: 'OK',
        success: true,
        message: 'Internal link - not checked'
      });
      continue;
    }
    
    const result = await checkUrl(url, company);
    results.push(result);
    
    // Add a small delay between requests to avoid flooding servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Output results
  console.log('\nResults:');
  console.log('========\n');
  
  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);
  
  console.log(`✅ ${successes.length} URLs are working correctly`);
  if (successes.length > 0) {
    console.log('Working URLs:');
    successes.forEach(r => {
      console.log(`- ${r.company}: ${r.url} (${r.message})`);
    });
  }
  
  console.log('\n');
  
  if (failures.length > 0) {
    console.log(`❌ ${failures.length} URLs have issues:`);
    failures.forEach(r => {
      console.log(`- ${r.company}: ${r.url} (${r.message})`);
      
      const suggestion = suggestFix(r.url);
      if (suggestion) {
        console.log(`  Suggested fix: ${suggestion}`);
      }
    });
    
    // Generate code to fix broken URLs
    if (failures.length > 0) {
      console.log('\nTo fix the broken URLs, update them in app/sponsors/page.tsx:');
      
      for (const failure of failures) {
        const suggestion = suggestFix(failure.url);
        if (suggestion) {
          console.log(`For ${failure.company}, change: ${failure.url}`);
          console.log(`To: ${suggestion}\n`);
        }
      }
    }
  } else {
    console.log('🎉 All URLs are working correctly!');
  }
}

// Run the verification
verifyUrls().catch(console.error); 