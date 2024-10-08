import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  MenuItem, 
  Card, 
  CardContent,
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getAllLocationsAsync, getVehicleDetails, fetchUserDetailsAsync } from '../api/api';
import { getUsernameFromToken } from '../utils/tokenUtils';

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
}));

const validationSchema = Yup.object().shape({
  startDate: Yup.date().required('Başlangıç tarihi gereklidir'),
  endDate: Yup.date().min(
    Yup.ref('startDate'),
    'Bitiş tarihi başlangıç tarihinden sonra olmalıdır'
  ).required('Bitiş tarihi gereklidir'),
  pickupLocationId: Yup.string().required('Alış lokasyonu gereklidir'),
  dropoffLocationId: Yup.string().required('Teslim lokasyonu gereklidir'),
});

const VehicleReservationPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const username = getUsernameFromToken(token);
          if (username) {
            const userData = await fetchUserDetailsAsync(username);
            setUser(userData);
          }
        }
        const [locationsData, vehicleData] = await Promise.all([
          getAllLocationsAsync(),
          getVehicleDetails(vehicleId)
        ]);
        setLocations(locationsData);
        setVehicle(vehicleData);
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
      }
    };

    fetchData();
  }, [vehicleId]);

  const calculateTotalCost = (startDate, endDate) => {
    if (vehicle && startDate && endDate) {
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      return days * vehicle.dailyPrice;
    }
    return 0;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!user) {
      alert('Kullanıcı bilgileri yüklenemedi. Lütfen tekrar giriş yapın.');
      setSubmitting(false);
      return;
    }
    const reservationData = {
      vehicleId,
      userId: user.id,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      totalCost,
      pickupLocationId: values.pickupLocationId,
      dropoffLocationId: values.dropoffLocationId
    };

    try {
      // Burada rezervasyon API'sini çağırın
      // Örnek: const response = await createReservation(reservationData);
      alert('Rezervasyon başarıyla oluşturuldu!');
      navigate('/reservations');
    } catch (error) {
      console.error('Rezervasyon oluşturulurken hata oluştu:', error);
      alert('Rezervasyon oluşturulurken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <div>Kullanıcı bilgileri yükleniyor...</div>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, fontWeight: 'bold', color: 'text.primary' }}>
        Rezervasyon Oluştur
      </Typography>
      <StyledCard>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            Hoş geldiniz, {user.firstName} {user.lastName}
          </Typography>
          <Formik
            initialValues={{
              startDate: null,
              endDate: null,
              pickupLocationId: '',
              dropoffLocationId: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <DatePicker
                      label="Başlangıç Tarihi"
                      value={values.startDate}
                      onChange={(newValue) => {
                        setFieldValue('startDate', newValue);
                        setTotalCost(calculateTotalCost(newValue, values.endDate));
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          error={touched.startDate && !!errors.startDate}
                          helperText={touched.startDate && errors.startDate}
                        />
                      )}
                    />
                    <DatePicker
                      label="Bitiş Tarihi"
                      value={values.endDate}
                      onChange={(newValue) => {
                        setFieldValue('endDate', newValue);
                        setTotalCost(calculateTotalCost(values.startDate, newValue));
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          error={touched.endDate && !!errors.endDate}
                          helperText={touched.endDate && errors.endDate}
                        />
                      )}
                    />
                  </Box>
                </LocalizationProvider>
                <Field
                  as={TextField}
                  select
                  fullWidth
                  name="pickupLocationId"
                  label="Alış Lokasyonu"
                  error={touched.pickupLocationId && !!errors.pickupLocationId}
                  helperText={touched.pickupLocationId && errors.pickupLocationId}
                  sx={{ mb: 2 }}
                >
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  as={TextField}
                  select
                  fullWidth
                  name="dropoffLocationId"
                  label="Teslim Lokasyonu"
                  error={touched.dropoffLocationId && !!errors.dropoffLocationId}
                  helperText={touched.dropoffLocationId && errors.dropoffLocationId}
                  sx={{ mb: 2 }}
                >
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Field>
                <TextField
                  fullWidth
                  label="Toplam Maliyet"
                  value={`${totalCost.toFixed(2)} TL`}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <StyledButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  Rezervasyon Yap
                </StyledButton>
              </Form>
            )}
          </Formik>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default VehicleReservationPage;