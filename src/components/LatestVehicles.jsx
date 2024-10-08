import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, CircularProgress, useTheme } from '@mui/material';
import { getAllVehiclesAsync } from '../api/api';
import carImage from '../assets/CarDrawing.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const LatestVehicles = ({ initialOrderBy = 'createdat', initialPageSize = 10 }) => {
  const [vehicles, setVehicles] = useState([]);
  const [orderBy] = useState(initialOrderBy);
  const [pageSize] = useState(initialPageSize);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const params = {
          OrderBy: orderBy,
          PageSize: pageSize
        };
        const data = await getAllVehiclesAsync(params);
        setVehicles(data);
      } catch (error) {
        console.error('Araçlar alınırken hata oluştu:', error);
        setError('Araçlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [orderBy, pageSize]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography>Henüz araç bulunmamaktadır.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 5 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom 
        sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 4 }}>
        Son Eklenen Araçlar
      </Typography>
      <Box sx={{ mx: -2 }}>
        <Slider {...settings}>
          {vehicles.map((vehicle) => (
            <Box key={vehicle.id} sx={{ px: 2 }}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                m: 1,
                borderRadius: 4,
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[10],
                },
              }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={carImage}
                  alt={vehicle.model.name}
                />
                <CardContent sx={{ flexGrow: 1, bgcolor: theme.palette.background.paper }}>
                  <Typography variant="h5" component="div" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                    {vehicle.model.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.secondary.main, mt: 2 }}>
                    {vehicle.dailyPrice} TL/gün
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default LatestVehicles;