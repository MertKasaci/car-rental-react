import React from 'react';
import SignupForm from '../components/SignupForm';
import { CssBaseline, Box } from '@mui/material';

const SignupPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      color="text.primary"
    >
      <CssBaseline />
      <SignupForm />
    </Box>
  );
};

export default SignupPage;
