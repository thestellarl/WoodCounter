'use client';
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Link,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement your email/password login logic here
    console.log('Email login:', email, password);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Google login success:', tokenResponse);
      // Here, you would typically send the access token to your backend
      // to verify and create a session for the user
      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });
        const data = await response.json();
        console.log('Backend response:', data);
        // Handle successful login (e.g., redirect to dashboard)
      } catch (error) {
        console.error('Error during Google login:', error);
        // Handle error (e.g., show error message to user)
      }
    },
    onError: (errorResponse) => {
      console.error('Google login failed:', errorResponse);
      // Handle error (e.g., show error message to user)
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleEmailLogin}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Divider sx={{ my: 2 }}>OR</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LoginIcon />}
            onClick={() => googleLogin()}
          >
            Sign in with Google
          </Button>
          <Box sx={{ mt: 2 }}>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
