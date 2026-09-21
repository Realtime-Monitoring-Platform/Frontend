export const lightTheme = {
  colors: {
    primary: { main: '#82C8E5', light: '#B9E2F1', dark: '#3F819C' },
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
    primary: { main: '#82C8E5', light: '#B9E2F1', dark: '#3F819C' },
    secondary: { main: '#f48fb1', light: '#f8bbd0', dark: '#c2185b' },
    success: { main: '#81c784', light: '#a5d6a7', dark: '#66bb6a' },
    warning: { main: '#ffb74d', light: '#ffcc80', dark: '#ffa726' },
    info: { main: '#64b5f6', light: '#90caf9', dark: '#42a5f5' },
    background: { default: '#071923', paper: '#0B2230' },
    text: { primary: '#E8F5F8', secondary: '#A7C2CC' },
  },
  typography: lightTheme.typography,
  spacing: 8,
  shape: { borderRadius: 8 },
};

export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'light' ? lightTheme : darkTheme;
};
