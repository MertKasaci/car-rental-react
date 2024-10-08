import React from 'react';
import NavBar from '../components/NavBar';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  TextField, 
  Button,
  IconButton
} from '@mui/material';
import { 
  Phone as PhoneIcon, 
  Email as EmailIcon, 
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon
} from '@mui/icons-material';

const ContactPage = () => {
  return (
    <>
    <NavBar/>
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Bize Ulaşın
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              İletişim Bilgilerimiz
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="body1">+90 (000) 000 00 00</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="body1">info@kiralikarababulma.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="body1">Atatürk Cad. No:123, 34000 Ankara, Türkiye</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bizi Takip Edin
              </Typography>
              <IconButton color="primary" aria-label="facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Bize Mesaj Gönderin
            </Typography>
            <form>
              <TextField
                fullWidth
                label="Adınız"
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="E-posta Adresiniz"
                variant="outlined"
                margin="normal"
                required
                type="email"
              />
              <TextField
                fullWidth
                label="Mesajınız"
                variant="outlined"
                margin="normal"
                required
                multiline
                rows={4}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                Mesaj Gönder
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </>
  );
};

export default ContactPage;