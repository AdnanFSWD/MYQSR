import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Determine redirection target (from location state or default to dashboard)
  const from = (location.state as any)?.from?.pathname || '/';

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || 'Login failed';
      setValidationError(errMsg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!username.trim() || !password) {
      setValidationError('Username and password are required');
      return;
    }

    loginMutation.mutate({ username: username.trim(), password });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0F172A' : '#F1F5F9',
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 10% 20%, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 90%)'
            : 'radial-gradient(circle at 10% 20%, rgba(226, 232, 240, 0.4) 0%, rgba(241, 245, 249, 0.8) 90%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: '24px',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 10px 30px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.05)'
              : '0 10px 30px rgba(15,23,42,0.08), 0 1px 3px rgba(0,0,0,0.02)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Brand Icon Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
                mb: 2,
              }}
            >
              <LockIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center', mb: 0.5 }}>
              QSR Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Enter credentials to access your account
            </Typography>
          </Box>

          {validationError && (
            <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: '12px' }}>
              {validationError}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loginMutation.isPending}
              placeholder="e.g. admin"
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending}
              placeholder="••••••••"
              sx={{ mb: 3.5, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loginMutation.isPending}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loginMutation.isPending}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.25)',
                '&:hover': {
                  boxShadow: 'none',
                },
              }}
            >
              {loginMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
