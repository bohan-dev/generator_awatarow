import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
// Import main game component
import SlotMachine from './components/SlotMachine.tsx';
import { CopyProvider, useCopy, SupportedLocale } from './content/CopyProvider';
import { BalanceProvider } from './context/BalanceContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { copy, locale, setLocale } = useCopy();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const localeOptions: Array<{ code: SupportedLocale; label: string; flag: string }> = useMemo(
    () => [
      { code: 'pl-PL', label: 'PL', flag: '🇵🇱' },
      { code: 'en-US', label: 'EN', flag: '🇺🇸' },
    ],
    []
  );

  const handleLocaleClick = (targetLocale: SupportedLocale) => {
    if (targetLocale !== locale) {
      setLocale(targetLocale);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', color: '#FFD700' }}>
      <Box
        component="header"
        sx={{
          px: 2.5,
          pt: 7,
          pb: 3,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.12) 0%, rgba(10, 10, 10, 0) 100%)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.18)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 20,
            display: 'flex',
            gap: 1,
            zIndex: 1,
          }}
        >
          {localeOptions.map(({ code, label, flag }) => {
            const isActive = locale === code;

            return (
              <Button
                key={code}
                size="small"
                onClick={() => handleLocaleClick(code)}
                disableElevation
                variant="contained"
                sx={{
                  minWidth: 44,
                  height: 30,
                  borderRadius: '999px',
                  background: isActive
                    ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                    : 'rgba(255, 215, 0, 0.12)',
                  color: isActive ? '#0B0B0B' : '#FFD700',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)'
                      : 'rgba(255, 215, 0, 0.2)',
                  },
                }}
              >
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <span role="img" aria-label={label}>
                    {flag}
                  </span>
                  {label}
                </Box>
              </Button>
            );
          })}
        </Box>


        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -70,
              right: -60,
              width: 200,
              height: 200,
              bgcolor: 'rgba(255, 215, 0, 0.18)',
              filter: 'blur(70px)'
            }}
          />
        </Box>

        <Box
          sx={{
            height: 3,
            width: '80%',
            mx: 'auto',
            borderRadius: 999,
            background: 'linear-gradient(90deg, rgba(255, 215, 0, 0) 0%, rgba(255, 215, 0, 0.85) 50%, rgba(255, 215, 0, 0) 100%)',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.55)',
            opacity: 0.9
          }}
        />

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 700, textAlign: 'center' }}>
            {copy.HEADER_TITLE}
          </Typography>
        </Box>



        <Box
          sx={{
            height: 3,
            width: '80%',
            mx: 'auto',
            borderRadius: 999,
            background: 'linear-gradient(90deg, rgba(255, 215, 0, 0) 0%, rgba(255, 215, 0, 0.85) 50%, rgba(255, 215, 0, 0) 100%)',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.45)',
            opacity: 0.75,
            mt: 3
          }}
        />
      </Box>

      <Box component="main" sx={{ pb: { xs: 10, sm: 12 } }}>
        {children}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{
            backgroundColor: 'rgba(255, 215, 0, 0.95)',
            color: '#0B0B0B',
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: '#0B0B0B',
            },
          }}
        >
          {copy.HEADER_FREE_SPINS_MESSAGE}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CopyProvider>
        <BalanceProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<SlotMachine />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </BalanceProvider>
      </CopyProvider>
    </ThemeProvider>
  );
}

export default App;
