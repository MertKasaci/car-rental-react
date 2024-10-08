
import React from 'react';
import { Box, Typography } from '@mui/material';
import carImage from '../assets/car.png'; 

const Header = () => {
    return (
      <Box sx={{ position: 'relative', textAlign: 'center', color: 'white', mt: 1 }}>
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${carImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
            filter: 'brightness(50%)', // Makes the background image darker
          }}
        />
        <Box sx={{ py: 10 }}>
          <Typography variant="h3" component="h1" sx={{ fontSize: '2rem' }}>
            Uygun Fiyata, En Kaliteli Araç Kiralama Deneyimini Yaşamaya Hoş Geldiniz
          </Typography>
        </Box>
      </Box>
    );
  };
  

export default Header;
