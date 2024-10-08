import React from 'react';
import { CssBaseline, Box, Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Container 
          component="main" 
          maxWidth="sm"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            py: 8,
          }}
        >
          <Box
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: theme.shape.borderRadius,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              p: 4,
              width: '100%',
            }}
          >
            <LoginForm />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;