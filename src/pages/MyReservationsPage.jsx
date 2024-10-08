import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Card, CardContent, Grid, Chip, CircularProgress, 
  Button, Box, Divider, Paper, useTheme, useMediaQuery, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Rating
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format, isBefore } from 'date-fns';
import { getUsernameFromToken } from '../utils/tokenUtils';
import { fetchUserDetailsAsync, getAllReservationsAsync, createReview } from '../api/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CurrencyLiraIcon from '@mui/icons-material/CurrencyLira';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
  },
}));

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const username = getUsernameFromToken(token);
        const userData = await fetchUserDetailsAsync(username);
        const allReservations = await getAllReservationsAsync();
        
        const userReservations = allReservations.filter(
          reservation => reservation.user.id === userData.id
        );
        
        setReservations(userReservations);
      } catch (err) {
        console.error('Rezervasyonlar yüklenirken hata oluştu:', err);
        setError('Rezervasyonlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleReviewClick = (reservation) => {
    setCurrentReservation(reservation);
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewContent('');
    setRating(0);
    setCurrentReservation(null);
  };

  const handleSubmitReview = async () => {
    if (!currentReservation) return;

    const reviewData = {
      reservationId: currentReservation.id,
      comment: reviewContent,
      rating: rating
    };

    try {
      await createReview(reviewData);
      handleCloseReviewDialog();
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res.id === currentReservation.id ? { ...res, review: reviewData } : res
        )
      );
      // Yorum başarıyla oluşturulduktan sonra ilgili aracın detay sayfasına yönlendir
      navigate(`/vehicles/${currentReservation.vehicle.id}`);
    } catch (error) {
      console.error('Yorum oluşturulurken hata:', error);
      // Hata mesajını kullanıcıya göster
    }
  };

  const renderLocationInfo = (location) => {
    if (!location) return 'Bilgi yok';
    return (
      <Box>
        <Typography variant="body2" fontWeight="bold">
          {location.name}
        </Typography>
        {location.address && (
          <Typography variant="body2">
            {location.address.street}, {location.address.city}, {location.address.state} {location.address.zipCode}
          </Typography>
        )}
      </Box>
    );
  };

  const renderVehicleInfo = (vehicle) => {
    return (
      <Box>
        <Typography variant="body1" fontWeight="bold">
          {vehicle.model.name} ({vehicle.year})
        </Typography>
        <Typography variant="body2">
          Renk: {vehicle.color} | Plaka: {vehicle.licensePlate}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress style={{ color: "#7289da" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 3, color: "#7289da", fontWeight: 'bold' }}>
        Rezervasyonlarım
      </Typography>
      {reservations.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: theme.palette.background.paper }}>
          <Typography>Henüz bir rezervasyonunuz bulunmamaktadır.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {reservations.map((reservation) => {
            const isCompleted = isBefore(new Date(reservation.endDate), new Date());
            const canReview = isCompleted && !reservation.review;
            return (
              <Grid item xs={12} key={reservation.id}>
                <StyledCard elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" component="div" color="#7289da">
                        Rezervasyon #{reservation.id.slice(0, 8)}
                      </Typography>
                      <Chip 
                        label={isCompleted ? "Tamamlandı" : "Aktif"} 
                        color={isCompleted ? "default" : "primary"}
                        sx={{ 
                          fontWeight: 'bold',
                          backgroundColor: isCompleted ? theme.palette.grey[300] : "#7289da",
                          color: isCompleted ? theme.palette.text.primary : theme.palette.background.paper
                        }}
                      />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <DateRangeIcon sx={{ mr: 1, color: "#7289da" }} />
                          <Typography variant="body1">
                            {format(new Date(reservation.startDate), 'dd.MM.yyyy HH:mm')} - 
                            {format(new Date(reservation.endDate), 'dd.MM.yyyy HH:mm')}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <CurrencyLiraIcon sx={{ mr: 1, color: "#7289da" }} />
                          <Typography variant="body1">
                            Toplam Ücret: {reservation.totalCost.toFixed(2)} ₺
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="flex-start" mb={1}>
                          <DirectionsCarIcon sx={{ mr: 1, color: "#7289da", mt: 0.5 }} />
                          {renderVehicleInfo(reservation.vehicle)}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box mb={2}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: "#7289da" }}>
                            <LocationOnIcon sx={{ mr: 1 }} /> Alış Lokasyonu
                          </Typography>
                          {renderLocationInfo(reservation.pickupLocation)}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: "#7289da" }}>
                            <LocationOnIcon sx={{ mr: 1 }} /> Teslim Lokasyonu
                          </Typography>
                          {renderLocationInfo(reservation.dropoffLocation)}
                        </Box>
                      </Grid>
                    </Grid>
                    {canReview && (
                      <Box mt={2}>
                        <Button 
                          variant="contained" 
                          startIcon={<RateReviewIcon />}
                          onClick={() => handleReviewClick(reservation)}
                          sx={{ 
                            backgroundColor: "#7289da",
                            color: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: "#5a6fb4",
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            }
                          }}
                        >
                          Rezervasyon Deneyimini Yorumla
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>
      )}
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog}>
        <DialogTitle>Rezervasyon Değerlendirmesi</DialogTitle>
        <DialogContent>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="review"
            label="Yorumunuz"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>İptal</Button>
          <Button onClick={handleSubmitReview} variant="contained" color="primary">
            Gönder
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyReservationsPage;