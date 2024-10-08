import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import CarDrawing from '../assets/CarDrawing.png';
import { colorTranslations, statusTranslations, translate } from '../utils/translations';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#7289da',
  color: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: '#5a6fb4',
  },
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
}));

const VehicleCard = ({ vehicle }) => {

  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  const handleReservationClick = () => {
    navigate(`/reservations/create/${vehicle.id}`);
  };



  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="180"
        image={CarDrawing}
        alt="Car Drawing"
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {vehicle.model}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Chip label={`${vehicle.year}`} sx={{ mr: 1, mb: 1, backgroundColor: 'primary.main', color: 'background.paper' }} />
          <Chip label={translate(vehicle.color, colorTranslations)} sx={{ mr: 1, mb: 1 }} />
          <Chip label={translate(vehicle.status, statusTranslations)} sx={{ mb: 1 }} />
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Plaka: {vehicle.licensePlate}
        </Typography>
        <Typography variant="h6" color="primary.main" sx={{ mt: 'auto', mb: 2 }}>
          {vehicle.dailyPrice} TL / gün
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledButton 
            variant="outlined" 
            size="small" 
            onClick={handleDetailsClick}
            sx={{ 
              flex: 1, 
              mr: 1, 
              backgroundColor: 'transparent', 
              color: '#7289da', 
              borderColor: '#7289da',
              '&:hover': {
                backgroundColor: 'rgba(114, 137, 218, 0.1)', // Light background on hover
              }
            }}
          >
            Araç Detayları
          </StyledButton>
          <StyledButton 
            variant="contained" 
            size="small" 
            sx={{ flex: 1, ml: 1 }}
            onClick={handleReservationClick}
          >
            Rezervasyon Yap
          </StyledButton>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default VehicleCard;