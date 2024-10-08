import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Typography, 
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Container,
  Paper,
  Avatar,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import { getUsernameFromToken } from '../utils/tokenUtils';
import { fetchUserDetailsAsync, updateUserDetails } from '../api/api';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
  borderRadius: '15px',
  width: '100%', // Kağıdın genişliğini artır
  maxWidth: '800px', // Maksimum genişlik ekle
  margin: '0 auto', // Ortalamak için
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  width: theme.spacing(7),
  height: theme.spacing(7),
}));

const StyledForm = styled(Form)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.dark,
    },
  },
}));

const UserProfileSchema = Yup.object().shape({
  userName: Yup.string().required('Kullanıcı adı gerekli'),
  firstName: Yup.string().required('Ad gerekli'),
  lastName: Yup.string().required('Soyad gerekli'),
  email: Yup.string().email('Geçersiz e-posta').required('E-posta gerekli'),
});

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  
  
 
 
  useEffect(() => {
    const getUserDetails =  async () => {
      try {
        setLoading(true);

        const storedDetails = localStorage.getItem('userDetails');
        if (storedDetails) {
          setUserDetails(JSON.parse(storedDetails));
          setLoading(false);
        }


        const token = localStorage.getItem('accessToken');
        const username = getUsernameFromToken(token);
        if (!username) {
          throw new Error('Kullanıcı adı bulunamadı');
        }
        const details = await fetchUserDetailsAsync(username);
        setUserDetails(details);

        localStorage.setItem('userDetails', JSON.stringify(details));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  },[]);
    
  

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!userDetails || !userDetails.id) {
        throw new Error('Kullanıcı ID bulunamadı');
      }
      await updateUserDetails(userDetails.id, values);
      setSnackbar({ open: true, message: 'Profil başarıyla güncellendi', severity: 'success' });


      localStorage.setItem('userDetails', JSON.stringify(values));

      setTimeout(() => {
        navigate(0);  
      }, 1000);  


    } catch (err) {
      setSnackbar({ open: true, message: 'Güncelleme sırasında bir hata oluştu', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography color="error">{error}</Typography>
    </Box>
  );

  return (
    <>
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mb: 4, mt: 4 }}>
        <StyledPaper elevation={6}>
          <StyledAvatar>
            <PersonIcon />
          </StyledAvatar>
          <Typography component="h1" variant="h5" gutterBottom>
            Kullanıcı Profili
          </Typography>
          <Formik
            initialValues={userDetails || {}}
            validationSchema={UserProfileSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ errors, touched, isSubmitting}) => (
              <StyledForm>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={StyledTextField}
                      name="userName"
                      label="Kullanıcı Adı"
                      fullWidth
                      variant="outlined"
                      error={touched.userName && errors.userName}
                      helperText={touched.userName && errors.userName}
                      
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={StyledTextField}
                      name="firstName"
                      label="Ad"
                      fullWidth
                      variant="outlined"
                      error={touched.firstName && errors.firstName}
                      helperText={touched.firstName && errors.firstName}
                      
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={StyledTextField}
                      name="lastName"
                      label="Soyad"
                      fullWidth
                      variant="outlined"
                      error={touched.lastName && errors.lastName}
                      helperText={touched.lastName && errors.lastName}
                      
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={StyledTextField}
                      name="email"
                      label="E-posta"
                      fullWidth
                      variant="outlined"
                      error={touched.email && errors.email}
                      helperText={touched.email && errors.email}
                      
                    />
                  </Grid>
                </Grid>
                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={<SaveIcon />}
                  size="large"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isSubmitting ? 'Güncelleniyor...' : 'Profili Güncelle'}
                </StyledButton>
              </StyledForm>
            )}
          </Formik>
        </StyledPaper>
      </Container>
      <Footer />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserProfile;