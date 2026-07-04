export const theme = {
  colors: {
    primary: '#4338ca', // Indigo 700
    primaryLight: '#818cf8', // Indigo 400
    primaryDark: '#312e81', // Indigo 900
    
    secondary: '#10b981', // Emerald 500
    secondaryLight: '#34d399', // Emerald 400
    secondaryDark: '#047857', // Emerald 700

    background: '#f8fafc', // Slate 50
    surface: '#ffffff', // White
    
    text: '#0f172a', // Slate 900
    textSecondary: '#64748b', // Slate 500
    textInverse: '#ffffff', // White
    
    border: '#e2e8f0', // Slate 200
    
    error: '#ef4444', // Red 500
    warning: '#f59e0b', // Amber 500
    success: '#10b981', // Emerald 500
    info: '#3b82f6', // Blue 500
    
    gold: '#fbbf24', // Amber 400
    silver: '#94a3b8', // Slate 400
    bronze: '#b45309', // Amber 700
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
    },
  },
};

export type Theme = typeof theme;
