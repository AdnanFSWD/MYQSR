import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export const createAppTheme = (mode: 'light' | 'dark'): Theme => {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light Theme Palette
            primary: {
              main: '#D97706', // Premium Amber
              light: '#FBBF24',
              dark: '#B45309',
              contrastText: '#FFFFFF',
            },
            secondary: {
              main: '#059669', // Emerald Green
              light: '#34D399',
              dark: '#047857',
              contrastText: '#FFFFFF',
            },
            background: {
              default: '#F8FAFC', // Sleek slate gray background
              paper: '#FFFFFF',
            },
            text: {
              primary: '#0F172A',
              secondary: '#475569',
            },
            divider: '#E2E8F0',
          }
        : {
            // Dark Theme Palette - Deep premium slate/blue-gray
            primary: {
              main: '#F59E0B', // Amber
              light: '#FCD34D',
              dark: '#D97706',
              contrastText: '#1E293B',
            },
            secondary: {
              main: '#10B981', // Emerald
              light: '#6EE7B7',
              dark: '#047857',
              contrastText: '#1E293B',
            },
            background: {
              default: '#0B0F19', // Premium deep space blue/black
              paper: '#111827', // Gray 900
            },
            text: {
              primary: '#F3F4F6',
              secondary: '#9CA3AF',
            },
            divider: '#1F2937',
          }),
    },
    typography: {
      fontFamily: [
        'Outfit',
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.57,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12, // Modern rounded corners
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
        variants: [
          {
            props: { variant: 'contained', color: 'primary' },
            style: ({ theme }) => ({
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
                : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: theme.palette.primary.contrastText,
              '&:hover': {
                opacity: 0.9,
              },
            }),
          },
          {
            props: { variant: 'contained', color: 'secondary' },
            style: ({ theme }) => ({
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: theme.palette.secondary.contrastText,
              '&:hover': {
                opacity: 0.9,
              },
            }),
          },
        ],
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            boxShadow: mode === 'light'
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${mode === 'light' ? '#E2E8F0' : '#1F2937'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#111827',
            backgroundImage: 'none',
            color: mode === 'light' ? '#0F172A' : '#F3F4F6',
            boxShadow: 'none',
            borderBottom: `1px solid ${mode === 'light' ? '#E2E8F0' : '#1F2937'}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#111827',
            borderRight: `1px solid ${mode === 'light' ? '#E2E8F0' : '#1F2937'}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'light' ? '#F8FAFC' : '#1F2937',
            color: mode === 'light' ? '#475569' : '#9CA3AF',
          },
        },
      },
    },
  });
};
