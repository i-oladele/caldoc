export const COLORS = {
  primary: '#3D50B5',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  // Grayscale
  black: '#000000',
  darkGray: '#333333',
  gray: '#666666',
  lightGray: '#999999',
  border: '#E5E5EA',
  background: '#F2F2F7',
  white: '#FFFFFF',

  // Additional colors
  primaryLight: '#4F63C9',
  primaryDark: '#2B3C9E',
};

export const TYPOGRAPHY = {
  h1: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  body1: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const LAYOUT = {
  screenPadding: SPACING.md,
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
}; 