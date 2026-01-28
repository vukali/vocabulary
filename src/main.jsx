import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App'
import './index.css'


// Create the theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Custom color for primary
    },
    secondary: {
      main: '#dc004e', // Custom color for secondary
    },
  },
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
