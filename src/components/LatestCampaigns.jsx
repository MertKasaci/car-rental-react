import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, useTheme } from '@mui/material';
import { getAllCampaignsAsync } from '../api/api';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const LatestCampaigns = ({ initialPageSize = 10 }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const params = {
          OrderBy: 'StartDate',
          PageSize: initialPageSize
        };
        const data = await getAllCampaignsAsync(params);
        setCampaigns(data);
      } catch (error) {
        console.error('Kampanyalar alınırken hata oluştu:', error);
        setError('Kampanyalar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
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

  if (campaigns.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography>Henüz kampanya bulunmamaktadır.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 5 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom 
        sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 4 }}>
        Yeni Başlayan Kampanyalar
      </Typography>
      <Box sx={{ mx: -2 }}>
        <Slider {...settings}>
          {campaigns.map((campaign) => (
            <Box key={campaign.id} sx={{ px: 2 }}>
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
                  <Typography variant="h5" component="div" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }} gutterBottom>
                    {campaign.title}
                  </Typography>
                  <Typography variant="h6" sx={{ color: theme.palette.secondary.main, mt: 2 }}>
                    İndirim: %{campaign.discountPercentage}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                    Başlangıç: {new Date(campaign.startDate).toLocaleDateString()}
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

export default LatestCampaigns;