import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Rating,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import StarIcon from '@mui/icons-material/Star';
import { getVehicleDetails } from '../api/api';
import { 
  colorTranslations, 
  statusTranslations, 
  fuelTypeTranslations, 
  transmissionTypeTranslations, 
  translate 
} from '../utils/translations';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  backgroundColor: theme.palette.background.paper,
}));

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const data = await getVehicleDetails(id);
        setVehicle(data);
        
        const reviews = data.reservations.filter(res => res.review);
        const totalRating = reviews.reduce((sum, res) => sum + res.review.rating, 0);
        setAverageRating(reviews.length > 0 ? totalRating / reviews.length : 0);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#7289da' }} />
      </Box>
    );
  }

  if (!vehicle) {
    return <Typography color="text.primary">Araç bulunamadı.</Typography>;
  }

  const reviews = vehicle.reservations.filter(res => res.review).map(res => ({
    ...res.review,
    userName: `${res.user.firstName} ${res.user.lastName}`,
    startDate: res.startDate,
    endDate: res.endDate
  }));

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <DirectionsCarIcon sx={{ fontSize: 60, color: '#7289da', mb: 2 }} />
          <Typography variant="h4" component="h1" color="text.primary" gutterBottom>
            {vehicle.model.name} ({vehicle.year})
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Plaka: {vehicle.licensePlate}
          </Typography>
          <Box my={2}>
            <Chip label={translate(vehicle.color, colorTranslations)} sx={{ backgroundColor: '#7289da', color: '#ffffff', m: 0.5 }} />
            <Chip label={translate(vehicle.status, statusTranslations)} sx={{ backgroundColor: '#43b581', color: '#ffffff', m: 0.5 }} />
          </Box>
          <Typography variant="h5" color="text.primary" gutterBottom>
            {vehicle.dailyPrice} TL / gün
          </Typography>
          <Box display="flex" alignItems="center" mt={2}>
            <StarIcon sx={{ color: '#7289da', mr: 1 }} />
            <Typography variant="h6" component="span" color="text.primary">
              Ortalama Puan: {averageRating.toFixed(1)} / 5
            </Typography>
            <Rating value={averageRating} readOnly precision={0.1} sx={{ ml: 1, color: '#7289da' }} />
          </Box>
        </Box>
      </StyledPaper>

      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom color="text.primary">
          Araç Özellikleri
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="body1" color="text.secondary">Kapasite: {vehicle.model.capacity}</Typography>
          <Typography variant="body1" color="text.secondary">
            Yakıt Tipi: {translate(vehicle.model.fuelType, fuelTypeTranslations)}
          </Typography>
          <Typography variant="body1" color="text.secondary">Bagaj Kapasitesi: {vehicle.model.luggageCapacity}</Typography>
          <Typography variant="body1" color="text.secondary">
            Vites Tipi: {translate(vehicle.model.transmissionType, transmissionTypeTranslations)}
          </Typography>
        </Box>
      </StyledPaper>

      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom color="text.primary">
          Yorumlar ve Değerlendirmeler
        </Typography>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" color="text.primary">{review.userName}</Typography>
                  <Rating value={review.rating} readOnly sx={{ color: '#7289da' }} />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rezervasyon: {new Date(review.startDate).toLocaleDateString()} - {new Date(review.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" color="text.primary">{review.comment}</Typography>
              </CardContent>
            </ReviewCard>
          ))
        ) : (
          <Typography color="text.secondary">Bu araç için henüz yorum yapılmamış.</Typography>
        )}
      </StyledPaper>
    </Container>
  );
};

export default VehicleDetailsPage;