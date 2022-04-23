import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      main: '#fb8500',
      darker: '#053e85'
    },
    secondary: {
      main: '#023047',
      darker: '#053e85'
    },
    error: {
      main: red.A400
    }
  },
  typography: {
    htmlFontSize: 16,
    h1: {
      fontSize: '2.25rem',
      color: '#023047',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 20
    },
    h2: {
      fontSize: '2rem',
      color: '#023047',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 20
    },
    h3: {
      fontSize: '1.75rem',
      color: '#023047',
      fontWeight: 'bold',
      padding: 10
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
});
export default theme;
