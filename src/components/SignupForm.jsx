import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff, Person, Email, Phone } from '@mui/icons-material';
import theme from '../utils/theme';
import { registerUser } from '../api/api';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('İsim gereklidir'),
  lastName: Yup.string().required('Soyisim gereklidir'),
  username: Yup.string().required('Kullanıcı adı gereklidir'),
  email: Yup.string().email('Geçersiz e-posta').required('E-posta gereklidir'),
  password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre gereklidir'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Şifreler eşleşmelidir').required('Şifre onayı gereklidir'),
  phoneNumber: Yup.string().required('Telefon numarası gereklidir'),
  gender: Yup.string().required('Cinsiyet gereklidir'),
});

const SignupForm = () => {
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    setSubmitSuccess(null);
    navigate('/login');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const userData = { ...values };
      const response = await registerUser(userData);
      setSubmitSuccess('Hesap başarıyla oluşturuldu!');
      console.log(response);
      setOpen(true);
      resetForm();
    } catch (error) {
      setSubmitError(error.message || 'Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            padding: 4,
            borderRadius: 2,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            width: '100%',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom color="primary" fontWeight="bold">
            Hesap Oluştur
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
            Bize katılın ve yolculuğunuza başlayın
          </Typography>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
              phoneNumber: '',
              gender: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="firstName"
                      as={TextField}
                      label="İsim"
                      fullWidth
                      variant="outlined"
                      error={errors.firstName && touched.firstName}
                      helperText={errors.firstName && touched.firstName ? errors.firstName : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="lastName"
                      as={TextField}
                      label="Soyisim"
                      fullWidth
                      variant="outlined"
                      error={errors.lastName && touched.lastName}
                      helperText={errors.lastName && touched.lastName ? errors.lastName : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="username"
                      as={TextField}
                      label="Kullanıcı Adı"
                      fullWidth
                      variant="outlined"
                      error={errors.username && touched.username}
                      helperText={errors.username && touched.username ? errors.username : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="email"
                      type="email"
                      as={TextField}
                      label="E-posta"
                      fullWidth
                      variant="outlined"
                      error={errors.email && touched.email}
                      helperText={errors.email && touched.email ? errors.email : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="password"
                      as={TextField}
                      label="Şifre"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      variant="outlined"
                      error={errors.password && touched.password}
                      helperText={errors.password && touched.password ? errors.password : ''}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="şifre görünürlüğünü değiştir"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="confirmPassword"
                      as={TextField}
                      label="Şifre Onayı"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      variant="outlined"
                      error={errors.confirmPassword && touched.confirmPassword}
                      helperText={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="phoneNumber"
                      as={TextField}
                      label="Telefon Numarası"
                      fullWidth
                      variant="outlined"
                      error={errors.phoneNumber && touched.phoneNumber}
                      helperText={errors.phoneNumber && touched.phoneNumber ? errors.phoneNumber : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" error={errors.gender && touched.gender}>
                      <InputLabel>Cinsiyet</InputLabel>
                      <Field
                        name="gender"
                        as={Select}
                        label="Cinsiyet"
                      >
                        <MenuItem value=""><em>Seçiniz</em></MenuItem>
                        <MenuItem value="Female">Kadın</MenuItem>
                        <MenuItem value="Male">Erkek</MenuItem>
                      </Field>
                      {errors.gender && touched.gender && (
                        <Typography color="error" variant="caption">
                          {errors.gender}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                
                {submitError && (
                  <Typography color="error" align="center" sx={{ mt: 2 }}>
                    {submitError}
                  </Typography>
                )}
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  disabled={isSubmitting}
                  sx={{ mt: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  {isSubmitting ? 'Kaydediliyor...' : 'Kaydol'}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
      
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Kayıt Başarılı"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hesabınız başarıyla oluşturuldu!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Tamam
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default SignupForm;