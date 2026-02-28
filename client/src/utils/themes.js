// Generate a large number of color themes for posters

const baseColors = [
  // Marketing / Professional
  { bg: '#1a365d', text: '#ffffff', accent: '#63b3ed', name: 'Corporate Blue' },
  { bg: '#2d3748', text: '#ffffff', accent: '#4fd1c5', name: 'Modern Dark' },
  { bg: '#ffffff', text: '#2d3748', accent: '#3182ce', name: 'Clean White' },
  { bg: '#f7fafc', text: '#1a202c', accent: '#ed8936', name: 'Minimalist' },
  
  // Vibrant / Creative
  { bg: '#553c9a', text: '#ffffff', accent: '#b794f4', name: 'Creative Purple' },
  { bg: '#c53030', text: '#ffffff', accent: '#fc8181', name: 'Bold Red' },
  { bg: '#d69e2e', text: '#1a202c', accent: '#744210', name: 'Energetic Yellow' },
  { bg: '#2c7a7b', text: '#ffffff', accent: '#81e6d9', name: 'Teal Dream' },
  
  // Nature / Organic
  { bg: '#2f855a', text: '#ffffff', accent: '#9ae6b4', name: 'Forest Green' },
  { bg: '#744210', text: '#fff5f5', accent: '#f6e05e', name: 'Earthy Brown' },
  { bg: '#22543d', text: '#f0fff4', accent: '#68d391', name: 'Deep Nature' },
  
  // Luxury / Elegant
  { bg: '#000000', text: '#d69e2e', accent: '#faf089', name: 'Luxury Gold' },
  { bg: '#171923', text: '#e2e8f0', accent: '#a0aec0', name: 'Midnight' },
  { bg: '#702459', text: '#fff5f5', accent: '#f687b3', name: 'Royal Velvet' },

  // Food / Restaurant
  { bg: '#9b2c2c', text: '#fff5f5', accent: '#fc8181', name: 'Spicy Red' },
  { bg: '#dd6b20', text: '#fffff0', accent: '#fbd38d', name: 'Citrus Orange' },
  
  // Pastel / Soft
  { bg: '#fed7e2', text: '#702459', accent: '#fbb6ce', name: 'Soft Pink' },
  { bg: '#e6fffa', text: '#234e52', accent: '#81e6d9', name: 'Mint Fresh' },
  { bg: '#faf089', text: '#744210', accent: '#d69e2e', name: 'Sunshine' },
  { bg: '#e2e8f0', text: '#2d3748', accent: '#a0aec0', name: 'Cool Grey' },

  // Dark / Neon
  { bg: '#09090b', text: '#00ff41', accent: '#008f11', name: 'Matrix Green' },
  { bg: '#1a1a2e', text: '#e94560', accent: '#16213e', name: 'Cyberpunk Red' },
  { bg: '#0f0c29', text: '#cca2fd', accent: '#302b63', name: 'Galaxy Purple' },
  { bg: '#2b2d42', text: '#edf2f4', accent: '#ef233c', name: 'Midnight Red' },
];

const fonts = ['sans', 'serif', 'mono'];
const layouts = ['center', 'left', 'split'];

// Function to generate many variations
export const generateThemes = () => {
  const themes = [];
  let idCounter = 0;

  // Helper to add theme
  const addTheme = (theme, type) => {
    fonts.forEach(font => {
        layouts.forEach(layout => {
            idCounter++;
            // A meaningful name helps with debugging
            const layoutName = layout.charAt(0).toUpperCase() + layout.slice(1);
            const fontName = font.charAt(0).toUpperCase() + font.slice(1);
            
            themes.push({
                ...theme,
                id: `theme-${idCounter}`,
                font,
                layout,
                type,
                name: theme.name 
                  ? `${theme.name} (${type}, ${fontName}, ${layoutName})` 
                  : `Theme ${idCounter} (${type})`
            });
        });
    });
  };
  
  // 1. Add base themes
  baseColors.forEach(theme => {
    addTheme({
      ...theme,
      style: 'solid'
    }, 'Solid');
  });

  // 2. Generate Gradient variations (just pair neighbors to limit to ~500)
  for (let i = 0; i < baseColors.length; i++) {
     for (let j = 0; j < baseColors.length; j++) {
        // Generate gradients for roughly 1/3 of combinations to get diverse but not exhaustive list
        if (i !== j && (i * j) % 3 === 0) {
            const theme = baseColors[i];
            const secondaryTheme = baseColors[j];
             addTheme({
              bg: theme.bg, 
              bgSecond: secondaryTheme.bg,
              text: theme.text,
              accent: secondaryTheme.accent,
              name: `${theme.name} to ${secondaryTheme.name}`,
              style: 'gradient'
            }, 'Gradient');
        }
     }
  }

  // 3. Generate Pattern variations (simulated with CSS gradients)
  const patternStyles = ['radial', 'diagonal'];
  baseColors.forEach(theme => {
      patternStyles.forEach(pattern => {
          addTheme({
             ...theme,
             style: pattern,
             name: `${theme.name}`,
             bg: theme.bg,
             accent: theme.accent
          }, `Pattern (${pattern})`);
      })
  });

  return themes;
};

export const getRandomTheme = () => {
    const allThemes = generateThemes();
    const randomIndex = Math.floor(Math.random() * allThemes.length);
    return allThemes[randomIndex];
}

export const getAllThemes = () => generateThemes();
