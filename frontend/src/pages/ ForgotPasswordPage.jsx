import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Logo from '../components/logo';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally make an API call to your backend
      // const response = await fetch('http://167.88.36.83:1337/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: email,
      //   } ),
      // });
      
      // const data = await response.json();
      
      // if (response.ok) {
      //   setSuccess(true);
      // } else {
      //   setError(data.error.message || 'Failed to send reset link');
      // }
      
      // For demo purposes, just show success
      setSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        display: 'flex',
        flex: '1 1 auto',
        height: '100vh',
      }}
    >
      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            p: 3,
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Logo />
          </Box>
          
          <Typography variant="h4" sx={{ mb: 1, textAlign: 'center' }}>
            Forgot Password
          </Typography>
          
          <Typography color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Enter your email address and we'll send you a link to reset your password
          </Typography>

          {success ? (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                We've sent a password reset link to your email address.
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please check your email and follow the instructions to reset your password.
                If you don't receive an email within a few minutes, please check your spam folder.
              </Typography>
              <Link
                component={RouterLink}
                to="/login"
                color="primary"
                underline="hover"
                variant="body2"
                sx={{ display: 'block', textAlign: 'center' }}
              >
                Back to login
              </Link>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl fullWidth error={!!error}>
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <OutlinedInput
                    id="email"
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={handleChange}
                  />
                  {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
              </Stack>

              <LoadingButton
                fullWidth
                loading={loading}
                size="large"
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
              >
                Send Reset Link
              </LoadingButton>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  color="primary"
                  underline="hover"
                  variant="body2"
                >
                  Back to login
                </Link>
              </Box>
            </form>
          )}
        </Box>
      </Container>
    </Box>
  );
}
