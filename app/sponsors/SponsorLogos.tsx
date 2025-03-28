import React from 'react';

// A component that provides placeholder logos for sponsors
// This will help us visualize the effect without actual image files

interface SponsorLogoProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
}

const SponsorLogo: React.FC<SponsorLogoProps> = ({ 
  name, 
  size = 'md', 
  colorScheme = 'blue' 
}) => {
  // Size class mapping
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };
  
  // Color scheme mapping
  const colorClasses = {
    blue: 'text-primary',
    gold: 'text-yellow-500',
    gray: 'text-gray-600',
    green: 'text-green-500'
  };
  
  // Generate a consistent pattern based on company name
  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Placeholder SVG patterns
  const patterns = [
    // Pattern 1: Simple building
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeClasses[size]} ${colorClasses[colorScheme as keyof typeof colorClasses] || 'text-primary'}`}
      fill="currentColor"
    >
      <rect x="20" y="40" width="60" height="50" fillOpacity="0.2" />
      <rect x="30" y="60" width="15" height="15" fillOpacity="0.4" />
      <rect x="55" y="60" width="15" height="15" fillOpacity="0.4" />
      <rect x="30" y="30" width="40" height="10" fillOpacity="0.4" />
      <polygon points="20,40 50,20 80,40" fillOpacity="0.3" />
      <text 
        x="50" 
        y="90" 
        fontSize="10" 
        textAnchor="middle" 
        fill="currentColor"
      >
        {name}
      </text>
    </svg>,
    
    // Pattern 2: Abstract logo
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeClasses[size]} ${colorClasses[colorScheme as keyof typeof colorClasses] || 'text-primary'}`}
      fill="currentColor"
    >
      <circle cx="50" cy="50" r="25" fillOpacity="0.2" />
      <circle cx="50" cy="50" r="15" fillOpacity="0.4" />
      <rect x="30" y="30" width="40" height="40" fillOpacity="0.1" />
      <text 
        x="50" 
        y="90" 
        fontSize="10" 
        textAnchor="middle" 
        fill="currentColor"
      >
        {name}
      </text>
    </svg>,
    
    // Pattern 3: Engineering themed
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeClasses[size]} ${colorClasses[colorScheme as keyof typeof colorClasses] || 'text-primary'}`}
      fill="currentColor"
    >
      <polygon points="50,20 80,40 80,70 50,90 20,70 20,40" fillOpacity="0.2" />
      <line 
        x1="20" y1="40" x2="80" y2="40" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeOpacity="0.5" 
      />
      <line 
        x1="20" y1="70" x2="80" y2="70" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeOpacity="0.5" 
      />
      <line 
        x1="50" y1="20" x2="50" y2="90" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeOpacity="0.5" 
      />
      <text 
        x="50" 
        y="55" 
        fontSize="10" 
        textAnchor="middle" 
        fill="currentColor"
      >
        {name}
      </text>
    </svg>,
    
    // Pattern 4: Construction themed
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeClasses[size]} ${colorClasses[colorScheme as keyof typeof colorClasses] || 'text-primary'}`}
      fill="currentColor"
    >
      <rect x="30" y="40" width="40" height="50" fillOpacity="0.2" />
      <rect x="20" y="90" width="60" height="5" fillOpacity="0.4" />
      <line 
        x1="30" y1="50" x2="70" y2="50" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeOpacity="0.5" 
      />
      <line 
        x1="30" y1="60" x2="70" y2="60" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeOpacity="0.5" 
      />
      <line 
        x1="30" y1="70" x2="70" y2="70" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeOpacity="0.5" 
      />
      <line 
        x1="30" y1="80" x2="70" y2="80" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeOpacity="0.5" 
      />
      <text 
        x="50" 
        y="35" 
        fontSize="10" 
        textAnchor="middle" 
        fill="currentColor"
      >
        {name}
      </text>
    </svg>
  ];
  
  // Select pattern based on name hash
  const patternIndex = hash % patterns.length;
  
  return patterns[patternIndex];
};

export default SponsorLogo; 