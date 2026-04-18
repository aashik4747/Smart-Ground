// Sports-specific image generation system

const SPORT_CONFIGS = {
  football: {
    keywords: ['football stadium', 'soccer field', 'football pitch', 'soccer ground'],
    colors: ['green', 'white'],
    patterns: ['field-lines', 'goal-post', 'stadium-seats']
  },
  cricket: {
    keywords: ['cricket ground', 'cricket pitch', 'cricket stadium', 'cricket field'],
    colors: ['green', 'brown'],
    patterns: ['pitch-lines', 'stumps', 'pavilion']
  },
  badminton: {
    keywords: ['badminton court', 'badminton hall', 'indoor court', 'shuttle court'],
    colors: ['blue', 'white'],
    patterns: ['court-lines', 'net', 'indoor-lighting']
  },
  tennis: {
    keywords: ['tennis court', 'tennis stadium', 'tennis club', 'tennis ground'],
    colors: ['blue', 'green'],
    patterns: ['court-lines', 'net', 'fence']
  },
  basketball: {
    keywords: ['basketball court', 'basketball arena', 'indoor basketball', 'basketball gym'],
    colors: ['orange', 'wood'],
    patterns: ['court-lines', 'hoop', 'three-point-line']
  },
  volleyball: {
    keywords: ['volleyball court', 'beach volleyball', 'volleyball arena', 'sand court'],
    colors: ['blue', 'sand'],
    patterns: ['court-lines', 'net', 'boundary-lines']
  },
  hockey: {
    keywords: ['hockey field', 'hockey stadium', 'hockey ground', 'hockey turf'],
    colors: ['green', 'blue'],
    patterns: ['field-lines', 'goal', 'circle']
  },
  swimming: {
    keywords: ['swimming pool', 'aquatic center', 'swimming complex', 'olympic pool'],
    colors: ['blue', 'white'],
    patterns: ['lane-lines', 'starting-blocks', 'diving-board']
  },
  table_tennis: {
    keywords: ['table tennis', 'ping pong table', 'table tennis hall', 'indoor sports'],
    colors: ['blue', 'green'],
    patterns: ['table-net', 'table-lines', 'paddles']
  },
  squash: {
    keywords: ['squash court', 'squash arena', 'indoor squash', 'racquet sports'],
    colors: ['white', 'blue'],
    patterns: ['court-lines', 'front-wall', 'side-walls']
  }
};

// Generate consistent seed for same venue
function generateSeed(venueId, sport) {
  if (!venueId) return Math.floor(Math.random() * 10000);
  
  const venueStr = String(venueId);
  const sportStr = sport?.toLowerCase() || '';
  
  // Create a consistent hash from venue ID and sport
  let hash = 0;
  const combined = venueStr + sportStr;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash) % 10000;
}

// Generate image URL based on sport and venue
export function generateSportImage(sport, venueId, venueName = '') {
  const normalizedSport = sport?.toLowerCase() || '';
  const config = SPORT_CONFIGS[normalizedSport];
  
  if (!config) {
    // Fallback for unknown sports
    const seed = generateSeed(venueId, 'general');
    return `https://picsum.photos/seed/sport-${seed}/800/600.jpg`;
  }

  const seed = generateSeed(venueId, sport);
  
  // Use multiple strategies for better variety
  const strategies = [
    // Strategy 1: Use sport-specific keywords with seed
    () => {
      const keyword = config.keywords[Math.abs(seed) % config.keywords.length];
      return `https://picsum.photos/seed/${keyword}-${seed}/800/600.jpg`;
    },
    
    // Strategy 2: Use venue name in seed for more variety
    () => {
      const nameSeed = venueName ? venueName.replace(/\s+/g, '-').toLowerCase() : `venue-${seed}`;
      return `https://picsum.photos/seed/${nameSeed}-${normalizedSport}/800/600.jpg`;
    },
    
    // Strategy 3: Use color-based seeds
    () => {
      const color = config.colors[Math.abs(seed) % config.colors.length];
      return `https://picsum.photos/seed/${color}-${normalizedSport}-${seed}/800/600.jpg`;
    },
    
    // Strategy 4: Use pattern-based seeds
    () => {
      const pattern = config.patterns[Math.abs(seed) % config.patterns.length];
      return `https://picsum.photos/seed/${pattern}-${normalizedSport}/800/600.jpg`;
    }
  ];

  // Select strategy based on seed to ensure consistency
  const strategyIndex = seed % strategies.length;
  return strategies[strategyIndex]();
}

// Fallback image generation for when no sport is specified
export function generateGenericSportImage(venueId) {
  const seed = generateSeed(venueId, 'generic');
  const genericKeywords = ['sports ground', 'stadium', 'sports complex', 'athletic field'];
  const keyword = genericKeywords[Math.abs(seed) % genericKeywords.length];
  
  return `https://picsum.photos/seed/${keyword}-${seed}/800/600.jpg`;
}

// Enhanced image selector that tries multiple sources
export function getOptimalSportImage(imageUrl, sport, venueId, venueName = '') {
  // 1. If there's a custom uploaded image, use it
  if (imageUrl && !imageUrl.includes('unsplash.com') && !imageUrl.includes('loremflickr.com') && !imageUrl.includes('picsum.photos')) {
    return imageUrl;
  }

  // 2. Generate sport-specific image
  if (sport) {
    return generateSportImage(sport, venueId, venueName);
  }

  // 3. Fallback to generic sports image
  return generateGenericSportImage(venueId);
}

// Get placeholder image for loading states
export function getPlaceholderImage(sport) {
  const normalizedSport = sport?.toLowerCase() || '';
  const config = SPORT_CONFIGS[normalizedSport];
  
  if (config) {
    const color = config.colors[0];
    return `https://via.placeholder.com/800x600/${color}/ffffff?text=${encodeURIComponent(sport || 'Sports Venue')}`;
  }
  
  return `https://via.placeholder.com/800x600/cccccc/ffffff?text=Sports+Venue`;
}

// Preload images for better performance
export function preloadSportImages(venues) {
  const imagePromises = venues.map(venue => {
    const imageUrl = getOptimalSportImage(venue.imageUrl, venue.sport, venue._id, venue.name);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(imageUrl);
      img.onerror = () => resolve(imageUrl); // Still resolve even on error
      img.src = imageUrl;
    });
  });

  return Promise.all(imagePromises);
}

// Export sport configurations for use in other components
export { SPORT_CONFIGS };
