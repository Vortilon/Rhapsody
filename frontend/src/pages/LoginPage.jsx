import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Google } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../components/logo';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
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
      // const response = await fetch('http://167.88.36.83:1337/api/auth/local', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     identifier: formData.email,
      //     password: formData.password,
      //   } ),
      // });
      
      // const data = await response.json();
      
      // if (response.ok) {
      //   // Save token to localStorage
      //   localStorage.setItem('jwt', data.jwt);
      //   localStorage.setItem('user', JSON.stringify(data.user));
      //   window.location.href = '/dashboard';
      // } else {
      //   setErrors({
      //     ...errors,
      //     password: data.error.message || 'Invalid credentials',
      //   });
      // }
      
      // For demo purposes, just redirect
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        ...errors,
        password: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log('Google login clicked');
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
            Sign in
          </Typography>
          
          <Typography color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Sign in to access your account
          </Typography>

          <Button
            fullWidth
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            size="large"
            variant="outlined"
            sx={{ mb: 3 }}
          >
            Continue with Google
          </Button>

          <Divider sx={{ mb: 3 }}>
            <Typography color="text.secondary" variant="body2">
              OR
            </Typography>
          </Divider>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl fullWidth error={!!errors.email}>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <OutlinedInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth error={!!errors.password}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
              </FormControl>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 2,
              }}
            >
              <Link
                component={RouterLink}
                to="/forgot-password"
                color="primary"
                underline="hover"
                variant="body2"
              >
                Forgot password?
              </Link>
            </Box>

            <LoadingButton
              fullWidth
              loading={loading}
              size="large"
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Sign In
            </LoadingButton>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  color="primary"
                  underline="hover"
                  variant="body2"
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
