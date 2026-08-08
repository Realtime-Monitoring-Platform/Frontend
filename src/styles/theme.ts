export const lightTheme = {
  colors: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    secondary: { main: '#dc004e', light: '#ff5983', dark: '#9a0036' },
    success: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    warning: { main: '#ed6c02', light: '#ff9800', dark: '#e65100' },
    info: { main: '#0288d1', light: '#03a9f4', dark: '#01579b' },
    background: { default: '#fafafa', paper: '#ffffff' },
    text: { primary: '#212121', secondary: '#757575' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
  },
  spacing: 8,
  shape: { borderRadius: 8 },
};

export const darkTheme = {
  colors: {
    primary: { main: '#90caf9', light: '#e3f2fd', dark: '#42a5f5' },
    secondary: { main: '#f48fb1', light: '#f8bbd0', dark: '#c2185b' },
    success: { main: '#81c784', light: '#a5d6a7', dark: '#66bb6a' },
    warning: { main: '#ffb74d', light: '#ffcc80', dark: '#ffa726' },
    info: { main: '#64b5f6', light: '#90caf9', dark: '#42a5f5' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#b0b0b0' },
  },
  typography: lightTheme.typography,
  spacing: 8,
  shape: { borderRadius: 8 },
};

export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'light' ? lightTheme : darkTheme;
};
