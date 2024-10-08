import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Rating, CircularProgress, useTheme } from '@mui/material';
import { getAllReviewsAsync } from '../api/api';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MaleAvatar from '../assets/Male Avatar.jpeg';
import FemaleAvatar from '../assets/Female Avatar.png';

const LatestReviews = ({ initialPageSize = 10 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const params = {
          OrderBy: 'CreatedAt',
          PageSize: initialPageSize
        };
        const data = await getAllReviewsAsync(params);
        setReviews(data);
      } catch (error) {
        console.error('Yorumlar alınırken hata oluştu:', error);
        setError('Yorumlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [initialPageSize]);

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

  if (reviews.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography>Henüz yorum bulunmamaktadır.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 5 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom 
        sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 4 }}>
        Son Kullanıcı Değerlendirmeleri
      </Typography>
      <Box sx={{ mx: -2 }}>
        <Slider {...settings}>
          {reviews.map((review) => (
            <Box key={review.id} sx={{ px: 2 }}>
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
                <CardContent sx={{ flexGrow: 1, bgcolor: theme.palette.background.paper }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={review.reservation.user.gender === 'Male' ? MaleAvatar : FemaleAvatar}
                      alt={`${review.reservation.user.firstName} ${review.reservation.user.lastName}`}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" component="div">
                        {review.reservation.user.firstName} {review.reservation.user.lastName}
                      </Typography>
                      <Rating value={review.rating} readOnly />
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
                    {review.comment}
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

export default LatestReviews;