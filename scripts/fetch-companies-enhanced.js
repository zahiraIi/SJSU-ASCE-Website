// Enhanced script to find logos for specific companies with additional search terms

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Directory where the logos will be saved
const logosDir = path.join(__dirname, '../public/images/sponsors');
const sponsorsFilePath = path.join(__dirname, '../app/sponsors/page.tsx');

// Default fallback logo when none can be found
const placeholderPath = path.join(logosDir, 'company-placeholder.svg');

// Companies to focus on with additional search terms
const targetCompanies = [
  {
    name: 'PASE',
    fullName: 'Peoples Associates Structural Engineers',
    section: 'Structural',
    website: 'https://pasecivil.com/',
    searchTerms: ['Peoples Associates Structural Engineers', 'PASE San Jose', 'PASE engineering bay area', 'PASE structural norcal']
  },
  {
    name: 'Mark Thomas',
    fullName: 'Mark Thomas & Company, Inc.',
    section: 'Structural',
    website: 'https://www.markthomas.com/',
    searchTerms: ['Mark Thomas and Company', 'Mark Thomas Engineering', 'Mark Thomas San Jose']
  },
  {
    name: 'Kpff',
    fullName: 'KPFF Consulting Engineers',
    section: 'Structural',
    website: 'https://www.kpff.com/',
    searchTerms: ['KPFF Consulting Engineers', 'KPFF Engineering', 'KPFF structural']
  },
  {
    name: 'Graniterock',
    fullName: 'Graniterock',
    section: 'Construction Management',
    website: 'https://www.graniterock.com/',
    searchTerms: ['Graniterock construction', 'Graniterock watsonville', 'Graniterock california', 'Graniterock san jose']
  },
  {
    name: 'Technical Builders',
    fullName: 'Technical Builders Inc',
    section: 'Construction Management',
    website: 'https://www.technicalbuilders.com/',
    searchTerms: ['Technical Builders Inc', 'TBI construction', 'Technical Builders santa clara', 'Technical Builders bay area']
  },
  {
    name: 'Whiting-Turner',
    fullName: 'The Whiting-Turner Contracting Company',
    section: 'Construction Management',
    website: 'https://www.whiting-turner.com/',
    searchTerms: ['Whiting Turner Contracting', 'Whiting-Turner construction', 'Whiting Turner california']
  },
  {
    name: 'XL Construction',
    fullName: 'XL Construction Corporation',
    section: 'Construction Management',
    website: 'https://www.xlconstruction.com/',
    searchTerms: ['XL Construction Corp', 'XL Construction california', 'XL Construction milpitas']
  }
];

// URLs to use when searching for logos on company websites directly
const commonLogoPathsOnWebsites = [
  '/logo.png',
  '/images/logo.png',
  '/assets/logo.png',
  '/img/logo.png',
  '/images/logo.svg',
  '/assets/logo.svg',
  '/img/logo.svg',
  '/wp-content/uploads/logo.png',
  '/wp-content/themes/company/logo.png',
  '/wp-content/uploads/2023/logo.png',
  '/wp-content/uploads/2022/logo.png',
  '/static/logo.png',
  '/static/images/logo.png',
  '/dist/images/logo.png',
  '/dist/img/logo.png',
  '/public/logo.png',
  '/public/images/logo.png'
];

// Get the current sponsor list to check which ones have missing logos
async function getCurrentSponsors() {
  try {
    const content = fs.readFileSync(sponsorsFilePath, 'utf8');
    const sponsors = [];
    
    // Extract sponsor data using regex
    const regex = /{\s*id:\s*(\d+),\s*name:\s*'([^']+)',\s*logo:\s*'([^']+)',\s*url:\s*'([^']+)'\s*}/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      sponsors.push({
        id: parseInt(match[1]),
        name: match[2],
        logo: match[3],
        url: match[4]
      });
    }
    
    return sponsors;
  } catch (error) {
    console.error('Error getting current sponsors:', error.message);
    return [];
  }
}

// Find companies with missing or placeholder logos
async function findCompaniesWithMissingLogos(currentSponsors) {
  const companiesWithMissingLogos = [];
  
  for (const sponsor of currentSponsors) {
    // Check if using a placeholder
    if (sponsor.logo.includes('placeholder')) {
      companiesWithMissingLogos.push(sponsor);
      continue;
    }
    
    // Check if file exists
    const logoPath = path.join(__dirname, '..', 'public', sponsor.logo);
    if (!fs.existsSync(logoPath)) {
      companiesWithMissingLogos.push(sponsor);
    }
  }
  
  return companiesWithMissingLogos;
}

// Convert company name to a safe filename
function getFilenameFromCompany(companyName) {
  return companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/-+/g, '-')         // Replace multiple dashes with single dash
    .replace(/^-|-$/g, '');      // Remove leading/trailing dashes
}

// Create a placeholder SVG with company name
async function createCustomPlaceholder(safeName, companyName) {
  try {
    const outputPath = path.join(logosDir, `${safeName}.svg`);
    
    // Skip if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`Placeholder for ${companyName} already exists. Skipping...`);
      return true;
    }
    
    // Read the base placeholder SVG template
    let svgTemplate = fs.readFileSync(placeholderPath, 'utf8');
    
    // Replace the text with company name
    const displayName = companyName.length > 20 ? 
                        companyName.substring(0, 18) + '...' : 
                        companyName;
                        
    svgTemplate = svgTemplate.replace('>COMPANY<', `>${displayName}<`);
    
    // Write the custom SVG to a file
    fs.writeFileSync(outputPath, svgTemplate);
    console.log(`Created custom placeholder for ${companyName}`);
    return true;
  } catch (error) {
    console.error(`Error creating placeholder for ${companyName}:`, error.message);
    return false;
  }
}

// Function to download an SVG logo
async function downloadSvgLogo(url, outputPath, companyName) {
  try {
    console.log(`Attempting to download SVG logo for ${companyName} from: ${url}`);
    
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'text'
    });
    
    // Check if the response is SVG content (contains <svg tag)
    if (response.data.includes('<svg') || response.data.includes('<?xml')) {
      fs.writeFileSync(outputPath, response.data);
      console.log(`Successfully downloaded and saved SVG logo for ${companyName}`);
      return true;
    } else {
      console.log(`Response from ${url} does not appear to be SVG content`);
      return false;
    }
  } catch (error) {
    console.error(`Error downloading SVG logo for ${companyName}:`, error.message);
    return false;
  }
}

// Add this function to try to find logos directly on the company website
async function tryFindingLogoOnWebsite(company, safeName, logoFilePng, logoFileSvg) {
  if (!company.website) return false;
  
  try {
    // Normalize website URL
    const websiteUrl = company.website.startsWith('http') ?
      company.website : `https://${company.website}`;
    
    // Remove trailing slash if present
    const baseUrl = websiteUrl.endsWith('/') ? 
      websiteUrl.substring(0, websiteUrl.length - 1) : websiteUrl;
    
    console.log(`Trying to find logo directly on company website: ${baseUrl}`);
    
    // Try to extract the logo from the website HTML
    try {
      const response = await axios.get(baseUrl);
      const html = response.data;
      
      // Look for logo in common patterns
      const logoRegex = /(src|href)=["'](\/[^"']*logo[^"']*\.(png|jpg|jpeg|svg))["']/gi;
      let match;
      
      const potentialLogos = [];
      while ((match = logoRegex.exec(html)) !== null) {
        const logoPath = match[2];
        potentialLogos.push(logoPath);
      }
      
      // Try each potential logo URL
      for (const logoPath of potentialLogos) {
        try {
          const fullLogoUrl = `${baseUrl}${logoPath}`;
          console.log(`Found potential logo in HTML: ${fullLogoUrl}`);
          
          // Check if the URL is accessible
          const logoCheck = await axios.head(fullLogoUrl);
          
          if (logoCheck.status === 200) {
            // Determine if it's an SVG or other image
            const isSvg = logoPath.toLowerCase().endsWith('.svg');
            
            if (isSvg) {
              const svgSuccess = await downloadSvgLogo(fullLogoUrl, logoFileSvg, company.name);
              if (svgSuccess) {
                console.log(`Successfully downloaded SVG logo from company website: ${fullLogoUrl}`);
                return { success: true, filename: `${safeName}.svg` };
              }
            } else {
              // Download the image
              const logoResponse = await axios({
                method: 'get',
                url: fullLogoUrl,
                responseType: 'stream'
              });
              
              const writer = fs.createWriteStream(logoFilePng);
              logoResponse.data.pipe(writer);
              
              await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
              });
              
              console.log(`Successfully downloaded logo from company website: ${fullLogoUrl}`);
              return { success: true, filename: `${safeName}.png` };
            }
          }
        } catch (err) {
          console.log(`Failed to download logo from ${logoPath}`);
        }
      }
      
      console.log(`No potential logos found in HTML or download failed`);
    } catch (err) {
      console.log(`Failed to fetch website HTML: ${err.message}`);
    }
    
    // Try common logo paths
    for (const logoPath of commonLogoPathsOnWebsites) {
      try {
        const logoUrl = `${baseUrl}${logoPath}`;
        console.log(`Trying common logo path: ${logoUrl}`);
        
        const response = await axios.head(logoUrl);
        
        if (response.status === 200) {
          // Check if it's an SVG
          if (logoPath.toLowerCase().endsWith('.svg')) {
            const svgSuccess = await downloadSvgLogo(logoUrl, logoFileSvg, company.name);
            if (svgSuccess) {
              console.log(`Successfully downloaded SVG logo from common path: ${logoUrl}`);
              return { success: true, filename: `${safeName}.svg` };
            }
          } else {
            // Download the image
            const logoResponse = await axios({
              method: 'get',
              url: logoUrl,
              responseType: 'stream'
            });
            
            const writer = fs.createWriteStream(logoFilePng);
            logoResponse.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });
            
            console.log(`Successfully downloaded logo from common path: ${logoUrl}`);
            return { success: true, filename: `${safeName}.png` };
          }
        }
      } catch (err) {
        // Just continue to the next path
      }
    }
    
    console.log(`Failed to find logo on website using common paths`);
    return false;
  } catch (error) {
    console.error(`Error trying to find logo on website: ${error.message}`);
    return false;
  }
}

// Search for company logo with multiple search terms
async function searchCompanyLogo(company) {
  try {
    const companyName = company.name;
    const safeName = getFilenameFromCompany(companyName);
    const logoFilePng = path.join(logosDir, `${safeName}.png`);
    const logoFileSvg = path.join(logosDir, `${safeName}.svg`);
    
    console.log(`\nAttempting to find logo for: ${companyName}`);
    console.log(`Full name: ${company.fullName || companyName}`);
    
    // If logo already exists, skip - but force update for target companies
    if (fs.existsSync(logoFilePng) || fs.existsSync(logoFileSvg)) {
      // Check if this is a target company we want to force update
      const isTargetCompany = targetCompanies.some(tc => tc.name === companyName);
      
      if (isTargetCompany) {
        console.log(`Found existing logo for ${companyName}, but forcing update...`);
        // Delete existing files to force update
        if (fs.existsSync(logoFilePng)) {
          fs.unlinkSync(logoFilePng);
          console.log(`Deleted existing PNG for ${companyName} to force update`);
        }
        if (fs.existsSync(logoFileSvg)) {
          fs.unlinkSync(logoFileSvg);
          console.log(`Deleted existing SVG for ${companyName} to force update`);
        }
      } else {
        console.log(`Logo for ${companyName} already exists. Skipping...`);
        return { success: true, filename: fs.existsSync(logoFilePng) ? `${safeName}.png` : `${safeName}.svg` };
      }
    }
    
    // Special case for PASE - skip directly to manual URLs
    if (companyName === 'PASE') {
      console.log("PASE needs special handling - using specific logos");
      // Try specific URLs for PASE
      const paseLogos = [
        'https://pasecivil.com/wp-content/uploads/2021/02/PASE_-Civil_Engineering-Scottsdale.jpg',
        'https://media.licdn.com/dms/image/C560BAQGc9Yq4YSRWNA/company-logo_200_200/0/1654712579577?e=2147483647&v=beta&t=cZ3KSjUcTugWbNm7PUFjfqfY47RLAfYRwu1v5q1cgjw',
        'https://images.squarespace-cdn.com/content/v1/5ce2df4f40ed750001e35cd0/1575508597351-0AQZ6NAH0HDGEZFHC3HG/FullSizeRender.jpg',
        'https://www.buildingenclosureonline.com/ext/resources/Issues/2019/0119/BE0119-Tech-Spotlight-5-img.jpg'
      ];
      
      for (const logoUrl of paseLogos) {
        try {
          console.log(`Trying specific image URL for PASE: ${logoUrl}`);
          
          const response = await axios.head(logoUrl);
          
          if (response.status === 200) {
            // Download the logo
            const logoResponse = await axios({
              method: 'get',
              url: logoUrl,
              responseType: 'stream'
            });
            
            const writer = fs.createWriteStream(logoFilePng);
            logoResponse.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });
            
            console.log(`Downloaded logo for PASE from specific URL!`);
            
            // Force update in the component
            await updateSponsorLogo('PASE', `/images/sponsors/${safeName}.png`);
            
            return { success: true, filename: `${safeName}.png` };
          }
        } catch (err) {
          console.log(`No logo found at specific URL for PASE: ${logoUrl}`);
        }
      }
      
      // If we reach here, all specific URLs failed
      console.log(`All specific URLs for PASE failed, continuing with normal process`);
    }
    
    // Check if we have manual logos for this company - do this before trying the APIs
    const manualLogos = {
      // Add any other companies that need manual handling
      'Mark Thomas': [
        'https://www.markthomas.com/wp-content/uploads/2022/10/Screen-Shot-2022-10-24-at-2.30.01-PM-1024x353.png',
        'https://static.wixstatic.com/media/a2d2f6_84a42b72808447a991673997be4d3b05~mv2.png'
      ],
      'Kpff': [
        'https://www.aiacalifornia.org/wp-content/uploads/2017/12/KPFF_Logo.jpg',
        'https://mlsvc01-prod.s3.amazonaws.com/e20071e1001/9017a237-6f5c-43f8-8290-92723a4c12a1.jpg'
      ],
      'NTK Construction, Inc.': [
        'https://ntkconstruction.com/wp-content/uploads/2019/03/NTK-Transparent.png'
      ],
      'Graniterock': [
        'https://www.graniterock.com/sites/default/files/graniterock_logo.png',
        'https://pbs.twimg.com/profile_images/937755289023688704/Y-U-p8gM_400x400.jpg',
        'https://media.licdn.com/dms/image/C560BAQE8wHsFmjoveQ/company-logo_200_200/0/1631352960736?e=2147483647&v=beta&t=v6LcKAsSZYmTv5Z4MjMcOASEZb2qvxOyV0EMkU8fZvE',
        'https://1000logos.net/wp-content/uploads/2020/09/Graniterock-Logo.png'
      ],
      'Technical Builders': [
        'https://www.technicalbuilders.com/wp-content/uploads/2020/04/TBI_Logo_Full-Color-RGB.png',
        'https://images.squarespace-cdn.com/content/v1/5bdeab049772ae1fd92ff6ad/1573593209304-M1FP7YL1IRGQD1LTFWX3/TBI-Logo.png',
        'https://pbs.twimg.com/profile_images/465544862721118208/NdCmPMhZ_400x400.jpeg'
      ],
      'Whiting-Turner': [
        'https://www.whiting-turner.com/wp-content/uploads/2019/07/wt-logo.svg',
        'https://media.licdn.com/dms/image/C4D0BAQHBGP0e8GR3Lw/company-logo_200_200/0/1631339398788?e=2147483647&v=beta&t=lM3fzecUmYaifzC5kGqUvlYFqe7jUGJaWSnjnuVFMGI',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZVrPQ52pVrA2iqPe-565QZSkcGYrBzakQxZQWSuaGRYeMwkxDWuSGONvdPaR-CvHcUrc&usqp=CAU'
      ],
      'XL Construction': [
        'https://www.xlconstruction.com/wp-content/uploads/2019/08/XL_logo-1.svg',
        'https://media.licdn.com/dms/image/C560BAQHBsK1o7e7JbA/company-logo_200_200/0/1701359042059?e=2147483647&v=beta&t=vvZ9qvr60RWMjOX_5u7FuON21eMxYLpvs3DPPcXTQX0',
        'https://s3.amazonaws.com/totem-assets/customer_logos/xl-red.svg?v=1663794207'
      ]
    };
    
    if (manualLogos[companyName]) {
      console.log(`Found manual logo entries for ${companyName}`);
      const logos = manualLogos[companyName];
      
      for (const logoUrl of logos) {
        try {
          console.log(`Trying manual logo URL for ${companyName}: ${logoUrl}`);
          
          // Check if it's an SVG
          if (logoUrl.toLowerCase().endsWith('.svg')) {
            const logoFileSvg = path.join(logosDir, `${safeName}.svg`);
            const svgSuccess = await downloadSvgLogo(logoUrl, logoFileSvg, companyName);
            
            if (svgSuccess) {
              console.log(`Downloaded SVG logo for ${companyName} from manual URL!`);
              
              // Force update in the component
              await updateSponsorLogo(companyName, `/images/sponsors/${safeName}.svg`);
              
              return { success: true, filename: `${safeName}.svg` };
            } else {
              console.log(`Failed to download SVG from ${logoUrl}, trying next URL`);
              continue;
            }
          }
          
          // For non-SVG files, use existing approach
          const response = await axios.head(logoUrl);
          
          if (response.status === 200) {
            // Download the logo
            const logoResponse = await axios({
              method: 'get',
              url: logoUrl,
              responseType: 'stream'
            });
            
            const writer = fs.createWriteStream(logoFilePng);
            logoResponse.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });
            
            console.log(`Downloaded logo for ${companyName} from manual URL!`);
            
            // Force update in the component
            await updateSponsorLogo(companyName, `/images/sponsors/${safeName}.png`);
            
            return { success: true, filename: `${safeName}.png` };
          }
        } catch (err) {
          console.log(`No logo found at manual URL for ${companyName}: ${logoUrl}`);
        }
      }
      
      console.log(`All manual URLs for ${companyName} failed, trying Clearbit API`);
    }
    
    // 1. Try Clearbit API with website domain
    if (company.website) {
      try {
        const websiteUrl = company.website.startsWith('http') ? 
                         company.website : 
                         `https://${company.website}`;
        
        const url = new URL(websiteUrl);
        const domain = url.hostname.replace('www.', '');
        
        if (domain) {
          const clearbitUrl = `https://logo.clearbit.com/${domain}?size=128`;
          
          try {
            console.log(`Trying Clearbit with domain: ${domain}`);
            const response = await axios.head(clearbitUrl);
            
            if (response.status === 200) {
              // Download the logo
              const logoResponse = await axios({
                method: 'get',
                url: clearbitUrl,
                responseType: 'stream'
              });
              
              const writer = fs.createWriteStream(logoFilePng);
              logoResponse.data.pipe(writer);
              
              await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
              });
              
              console.log(`Downloaded logo for ${companyName} from Clearbit with domain!`);
              return { success: true, filename: `${safeName}.png` };
            }
          } catch (err) {
            console.log(`No logo found at Clearbit for domain: ${domain}`);
          }
        }
      } catch (err) {
        console.log(`Invalid website URL: ${company.website}`);
      }
    }
    
    // 2. Try Clearbit with company name variations
    const searchTerms = company.searchTerms || 
                       [companyName, company.fullName, 
                        `${companyName} San Jose`, 
                        `${companyName} Bay Area`,
                        `${companyName} California`];
    
    for (const term of searchTerms) {
      if (!term) continue;
      
      // Format the term for a URL
      const formattedTerm = term.toLowerCase()
        .replace(/[^a-z0-9]+/g, '')
        .trim();
      
      if (formattedTerm) {
        const clearbitUrl = `https://logo.clearbit.com/${formattedTerm}.com?size=128`;
        
        try {
          console.log(`Trying Clearbit with search term: ${term} (${clearbitUrl})`);
          const response = await axios.head(clearbitUrl);
          
          if (response.status === 200) {
            // Download the logo
            const logoResponse = await axios({
              method: 'get',
              url: clearbitUrl,
              responseType: 'stream'
            });
            
            const writer = fs.createWriteStream(logoFilePng);
            logoResponse.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });
            
            console.log(`Downloaded logo for ${companyName} from Clearbit with search term: ${term}`);
            return { success: true, filename: `${safeName}.png` };
          }
        } catch (err) {
          console.log(`No logo found at Clearbit for search term: ${term}`);
        }
      }
    }
    
    // 3. Try with company name + .com variations
    const domainVariations = [
      `${getFilenameFromCompany(companyName)}.com`,
      `${getFilenameFromCompany(companyName)}.org`,
      `${getFilenameFromCompany(companyName)}.net`,
      `${getFilenameFromCompany(companyName)}.co`
    ];
    
    for (const domain of domainVariations) {
      const clearbitUrl = `https://logo.clearbit.com/${domain}?size=128`;
      
      try {
        console.log(`Trying Clearbit with domain variation: ${domain}`);
        const response = await axios.head(clearbitUrl);
        
        if (response.status === 200) {
          // Download the logo
          const logoResponse = await axios({
            method: 'get',
            url: clearbitUrl,
            responseType: 'stream'
          });
          
          const writer = fs.createWriteStream(logoFilePng);
          logoResponse.data.pipe(writer);
          
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
          
          console.log(`Downloaded logo for ${companyName} from Clearbit with domain variation: ${domain}`);
          return { success: true, filename: `${safeName}.png` };
        }
      } catch (err) {
        console.log(`No logo found at Clearbit for domain variation: ${domain}`);
      }
    }
    
    // After trying Clearbit domain variations without success:
    // Try scraping the website directly for logo
    const websiteResult = await tryFindingLogoOnWebsite(company, safeName, logoFilePng, logoFileSvg);
    if (websiteResult && websiteResult.success) {
      return websiteResult;
    }
    
    // If no logo found, create placeholder
    console.log(`No logo found for ${companyName}, creating placeholder`);
    await createCustomPlaceholder(safeName, companyName);
    return { success: true, filename: `${safeName}.svg` };
  } catch (error) {
    console.error(`Error finding logo for ${company.name}:`, error.message);
    return { success: false, filename: null };
  }
}

// Update the sponsors data in the React component
async function updateSponsorsData() {
  try {
    console.log('Updating sponsor logos in the React component...');
    
    // Read the existing sponsors page
    let pageContent = fs.readFileSync(sponsorsFilePath, 'utf8');
    
    // Find all sponsor entries in the file
    const regex = /({\s*id:\s*\d+,\s*name:\s*'([^']+)',\s*logo:\s*'([^']+)',\s*url:\s*'([^']+)'\s*})/g;
    let match;
    const replacements = [];
    
    while ((match = regex.exec(pageContent)) !== null) {
      const [fullMatch, _, name, logoPath, url] = match;
      
      // Get filename from company name
      const safeName = getFilenameFromCompany(name);
      let newLogoPath = logoPath;
      
      // Check if a new logo exists for this company
      if (fs.existsSync(path.join(logosDir, `${safeName}.png`))) {
        newLogoPath = `/images/sponsors/${safeName}.png`;
      } else if (fs.existsSync(path.join(logosDir, `${safeName}.svg`))) {
        newLogoPath = `/images/sponsors/${safeName}.svg`;
      }
      
      // If logo path has changed, prepare replacement
      if (newLogoPath !== logoPath) {
        const newEntry = fullMatch.replace(`logo: '${logoPath}'`, `logo: '${newLogoPath}'`);
        replacements.push({ original: fullMatch, replacement: newEntry });
        console.log(`Updating logo for ${name}: ${logoPath} -> ${newLogoPath}`);
      }
    }
    
    // Apply all replacements
    for (const { original, replacement } of replacements) {
      pageContent = pageContent.replace(original, replacement);
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(sponsorsFilePath, pageContent);
    
    console.log(`Successfully updated ${replacements.length} sponsor logos.`);
    return true;
  } catch (error) {
    console.error('Error updating sponsors data:', error.message);
    return false;
  }
}

// Add a new function to update a specific company logo in the component
async function updateSponsorLogo(companyName, newLogoPath) {
  try {
    console.log(`Directly updating logo for ${companyName} to ${newLogoPath}`);
    
    // Read the existing sponsors page
    let pageContent = fs.readFileSync(sponsorsFilePath, 'utf8');
    
    // Find the specific company entry
    const regex = new RegExp(`({\\s*id:\\s*\\d+,\\s*name:\\s*'${companyName}',\\s*logo:\\s*'[^']+',\\s*url:\\s*'[^']+\'\\s*})`, 'g');
    let match = regex.exec(pageContent);
    
    if (match) {
      const fullMatch = match[1];
      const logoRegex = /logo:\s*'([^']+)'/;
      const logoMatch = logoRegex.exec(fullMatch);
      
      if (logoMatch) {
        const oldLogoPath = logoMatch[1];
        const newEntry = fullMatch.replace(`logo: '${oldLogoPath}'`, `logo: '${newLogoPath}'`);
        pageContent = pageContent.replace(fullMatch, newEntry);
        
        // Write the updated content back to the file
        fs.writeFileSync(sponsorsFilePath, pageContent);
        console.log(`Successfully updated logo for ${companyName} from ${oldLogoPath} to ${newLogoPath}`);
        return true;
      }
    } else {
      console.log(`Could not find ${companyName} in the sponsors data`);
    }
    return false;
  } catch (error) {
    console.error(`Error updating logo for ${companyName}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting enhanced logo search for specific companies...');
    
    // Process target companies
    console.log('Processing target companies:');
    for (const company of targetCompanies) {
      await searchCompanyLogo(company);
    }
    
    // Get current sponsors to find those with missing logos
    const currentSponsors = await getCurrentSponsors();
    const missingLogos = await findCompaniesWithMissingLogos(currentSponsors);
    
    console.log(`\nFound ${missingLogos.length} companies with missing logos:`);
    for (const company of missingLogos) {
      console.log(`- ${company.name} (current logo: ${company.logo})`);
      
      // Skip if it's already in the target companies
      if (!targetCompanies.some(tc => tc.name === company.name)) {
        await searchCompanyLogo({ 
          name: company.name,
          website: company.url
        });
      }
    }
    
    // Update sponsor data in the React component
    await updateSponsorsData();
    
    console.log('\nScript completed successfully!');
    console.log('Run "npm run dev" to see the updated sponsor page.');
  } catch (error) {
    console.error('Error running script:', error.message);
  }
}

// Run the main function
main(); 