import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Logo from '../components/logo';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    name: '',
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

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // const response = await fetch('http://167.88.36.83:1337/api/auth/local/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     username: formData.name,
      //     email: formData.email,
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
      //     email: data.error.message || 'Registration failed',
      //   });
      // }
      
      // For demo purposes, just redirect
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        ...errors,
        email: 'An error occurred. Please try again.',
      });
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
            Create an account
          </Typography>
          
          <Typography color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Fill in the form below to create your account
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl fullWidth error={!!errors.name}>
                <InputLabel htmlFor="name">Full Name</InputLabel>
                <OutlinedInput
                  id="name"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
              </FormControl>

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
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
              </FormControl>
            </Stack>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                By creating an account, you agree to our{' '}
                <Link color="primary" underline="hover">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link color="primary" underline="hover">
                  Privacy Policy
                </Link>
              </Typography>
            </Box>

            <LoadingButton
              fullWidth
              loading={loading}
              size="large"
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Create Account
            </LoadingButton>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  color="primary"
                  underline="hover"
                  variant="body2"
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
