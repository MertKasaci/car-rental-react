// src/components/Footer.jsx
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ py: 3, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
      <Typography variant="body1">© 2023 Araç Kiralama</Typography>
      <Typography variant="body2">
        <Link href="/about">Hakkımızda</Link> | <Link href="/contact">İletişim</Link> | <Link href="/privacy">Gizlilik Politikası</Link>
      </Typography>
    </Box>
  );
};

export default Footer;
