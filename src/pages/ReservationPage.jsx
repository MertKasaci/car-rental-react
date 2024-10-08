import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { isWithinInterval, parseISO } from 'date-fns';
import { 
  getAllVehiclesAsync, 
  getAllLocationsAsync, 
  fetchUserDetailsAsync, 
  createReservation,
  getAvailableCampaignsForUser,
  addCampaignToUser
} from '../api/api';
import { getUsernameFromToken } from '../utils/tokenUtils';

const validationSchema = Yup.object().shape({
  startDate: Yup.date().required('Başlangıç tarihi gereklidir'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır')
    .required('Bitiş tarihi gereklidir'),
  pickupLocationId: Yup.string().required('Alış lokasyonu gereklidir'),
  dropoffLocationId: Yup.string().required('Teslim lokasyonu gereklidir'),
});

const ReservationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [locations, setLocations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const token = localStorage.getItem('accessToken');
          const username = getUsernameFromToken(token);
          
          const [vehiclesData, locationsData, userData] = await Promise.all([
            getAllVehiclesAsync({ pageSize: 1000, page: 1 }), // Tüm araçları getirmek için sayfa boyutunu büyük tutuyoruz
            getAllLocationsAsync(),
            fetchUserDetailsAsync(username)
          ]);
          
          const currentVehicle = vehiclesData.find(v => v.id === id);
          if (!currentVehicle) {
            throw new Error('Vehicle not found');
          }
          
          setVehicle(currentVehicle);
          setLocations(locationsData);
          setUser(userData);

          // Kampanyaları getir
          const availableCampaigns = await getAvailableCampaignsForUser(userData.id);
          setCampaigns(availableCampaigns);
        } catch (error) {
          console.error('Veri yüklenirken hata oluştu:', error);
          // Hata durumunda kullanıcıyı bilgilendir
        } finally {
          setLoading(false);
        }
      } else {
        console.error('Vehicle ID is undefined');
        setLoading(false);
        navigate('/');
      }
    };

    fetchData();
  }, [id, navigate]);

  const isDateReserved = useCallback((date) => {
    if (!vehicle || !vehicle.reservations) return false;
    return vehicle.reservations.some(reservation => 
      isWithinInterval(date, { 
        start: parseISO(reservation.startDate), 
        end: parseISO(reservation.endDate) 
      })
    );
  }, [vehicle]);

  const calculateTotalCost = useCallback((startDate, endDate, campaignId) => {
    if (startDate && endDate && vehicle) {
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      let cost = days * vehicle.dailyPrice;
      
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        const discountAmount = cost * (campaign.discountPercentage / 100);
        cost = cost - discountAmount;
      }
      
      return cost;
    }
    return 0;
  }, [vehicle, campaigns]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const totalCost = calculateTotalCost(values.startDate, values.endDate, values.campaignId);
      const reservationData = {
        vehicleId: id,
        userId: user.id,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        totalCost: totalCost,
        pickupLocationId: values.pickupLocationId,
        dropoffLocationId: values.dropoffLocationId,
        campaignId: values.campaignId || null
      };
      
      // Rezervasyon oluştur
      await createReservation(reservationData);
      
      // Eğer kampanya seçildiyse, kampanyayı kullanıcıya ekle
      if (values.campaignId) {
        await addCampaignToUser(values.campaignId, user.id);
      }
      
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Rezervasyon oluşturulurken hata:', error);
      // Hata durumunda kullanıcıyı bilgilendir
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!vehicle) {
    return <Typography>Araç bulunamadı.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Snackbar 
        open={isSuccess} 
        autoHideDuration={2000} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Rezervasyon İşlemi Başarıyla Tamamlandı. Ana Sayfaya Yönlendiriliyorsunuz.
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        {vehicle.model.name} için Rezervasyon
      </Typography>
      
      <Formik
        initialValues={{
          startDate: null,
          endDate: null,
          pickupLocationId: '',
          dropoffLocationId: '',
          campaignId: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values, isSubmitting }) => {
          const totalCost = calculateTotalCost(values.startDate, values.endDate, values.campaignId);
          return (
            <Form>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <DatePicker
                    label="Başlangıç Tarihi"
                    value={values.startDate}
                    onChange={(date) => setFieldValue('startDate', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={touched.startDate && !!errors.startDate}
                        helperText={touched.startDate && errors.startDate}
                      />
                    )}
                    shouldDisableDate={isDateReserved}
                    minDate={new Date()}
                  />
                  <DatePicker
                    label="Bitiş Tarihi"
                    value={values.endDate}
                    onChange={(date) => setFieldValue('endDate', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={touched.endDate && !!errors.endDate}
                        helperText={touched.endDate && errors.endDate}
                      />
                    )}
                    shouldDisableDate={isDateReserved}
                    minDate={values.startDate || new Date()}
                  />
                </Box>
              </LocalizationProvider>
              
              <Field name="pickupLocationId">
                {({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
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
                  </TextField>
                )}
              </Field>
              
              <Field name="dropoffLocationId">
                {({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
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
                  </TextField>
                )}
              </Field>
              
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Kampanyalar</FormLabel>
                <RadioGroup
                  aria-label="kampanya"
                  name="campaignId"
                  value={values.campaignId}
                  onChange={(e) => setFieldValue('campaignId', e.target.value)}
                >
                  <FormControlLabel
                    value=""
                    control={<Radio />}
                    label="Kampanya Uygulanmasın"
                  />
                  {campaigns.map((campaign) => (
                    <FormControlLabel
                      key={campaign.id}
                      value={campaign.id}
                      control={<Radio />}
                      label={`${campaign.title} - %${campaign.discountPercentage} İndirim`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                label="Toplam Maliyet"
                value={`${totalCost.toFixed(2)} TL`}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2 }}
              />
              
              {values.campaignId && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Uygulanan İndirim: %{campaigns.find(c => c.id === values.campaignId).discountPercentage} 
                  ({(calculateTotalCost(values.startDate, values.endDate, '') - totalCost).toFixed(2)} TL)
                </Typography>
              )}
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isSubmitting || isSuccess}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Rezervasyon Yap'}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default ReservationPage;