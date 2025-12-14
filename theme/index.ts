/**
 * Centralized theme system for AI Closet App
 * Dark, futuristic "AI stylist console" aesthetic
 */

export const theme = {
  colors: {
    // Background palette - deep gray/near-black range
    background: {
      primary: '#020307',      // Deepest black
      secondary: '#050816',    // Slightly lighter for depth
      tertiary: '#0A0F1E',     // Panel backgrounds
      elevated: '#111827',     // Cards and elevated surfaces
    },
    
    // Accent color - electric cyan for primary actions
    accent: {
      primary: '#00F5FF',      // Electric cyan
      secondary: '#7DD3FC',   // Softer cyan for secondary actions
      glow: 'rgba(0, 245, 255, 0.3)', // Glow effect
      dark: '#0891B2',         // Darker cyan for pressed states
    },
    
    // Alternative accent - neon purple (can be used for variety)
    accentPurple: {
      primary: '#A855F7',
      secondary: '#C084FC',
      glow: 'rgba(168, 85, 247, 0.3)',
    },
    
    // Text colors - high contrast but not pure white
    text: {
      primary: '#F9FAFB',      // Off-white for headings
      secondary: '#E5E7EB',    // Light gray for body
      tertiary: '#9CA3AF',     // Muted gray for hints
      disabled: '#6B7280',     // Disabled text
    },
    
    // Border and divider colors
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)',
      accent: 'rgba(0, 245, 255, 0.3)',
    },
    
    // Status colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  
  typography: {
    // Font families - system fonts for native feel
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    
    // Font weights
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
    pill: 20, // For pill-shaped chips
  },
  
  shadows: {
    // Subtle shadows for depth
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    // Glow effect for accent elements
    glow: {
      shadowColor: '#00F5FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 0,
    },
  },
  
  // Animation durations (in milliseconds)
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Z-index scale
  zIndex: {
    base: 0,
    elevated: 10,
    overlay: 100,
    modal: 200,
    toast: 300,
  },
} as const;

// Type export for theme usage
export type Theme = typeof theme;


