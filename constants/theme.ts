export const lightTheme = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF2D55',
  border: '#E5E5EA',
  card: '#F2F2F7',
  error: '#FF3B30',
  success: '#34C759',
};

export const darkTheme = {
  background: '#000000',
  text: '#FFFFFF',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#FF375F',
  border: '#38383A',
  card: '#1C1C1E',
  error: '#FF453A',
  success: '#32D74B',
};

export type ThemeColors = typeof lightTheme;

export const getThemeColors = (isDark: boolean) => 
  isDark ? darkTheme : lightTheme; 