import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Typography, 
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { authenticateUser } from '../api/api';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Geçersiz e-posta adresi').required('E-posta adresi gerekli'),
  password: Yup.string().required('Şifre gerekli'),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleCloseSnackbar = () => setOpenSnackbar(false);


  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await authenticateUser(values);
      console.log('API yanıtı:', response);
      const { accessToken, refreshToken } = response;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log('Login successful:', response);
      
      // Başarılı login işlemi
      setSnackbarMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      
      // Kısa bir gecikme ile yönlendirme yap
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setSnackbarMessage('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.light,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.dark,
      },
    },
    '& .MuiInputBase-input': {
      color: theme.palette.primary.main,
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.palette.primary.dark,
    },
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom color="primary">
        Hoş Geldiniz
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
        Hesabınıza giriş yapın
      </Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
          <Form>
            <TextField
              name="email"
              label="E-posta"
              fullWidth
              variant="outlined"
              margin="normal"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email ? errors.email : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />
            <TextField
              name="password"
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              margin="normal"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password && touched.password}
              helperText={errors.password && touched.password ? errors.password : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end" color="primary">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem' }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
            </Button>
          </Form>
        )}
      </Formik>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">
          Henüz bir hesabın yok mu?{' '}
          <Link component={RouterLink} to="/register" color="primary">
            Kaydol
          </Link>
        </Typography>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;