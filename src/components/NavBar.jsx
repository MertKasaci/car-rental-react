import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, useMediaQuery, useTheme, styled, alpha } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleLogout = () => {
    // LocalStorage'dan token'ları sil
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Menüyü kapat
    handleMenuClose();
    
    // Kullanıcıyı login sayfasına yönlendir
    navigate('/login');
  };


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const menuItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Araçlar/Rezervasyon', href: '/vehicles' },
    { label: 'İletişim', href: '/contact' },
  ];

  const renderMenu = (
    <StyledMenu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose} component="a" href="/profile">
        <PersonIcon />
        Profil Görüntüle
      </MenuItem>
      <MenuItem onClick={handleMenuClose} component="a" href="/my-reservations">
        <AssignmentIcon />
        Rezervasyonlarım
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ExitToAppIcon />
        Çıkış Yap
      </MenuItem>
    </StyledMenu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      {menuItems.map((item) => (
        <MenuItem key={item.label} onClick={handleMobileMenuClose} component="a" href={item.href}>
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }}>
      <Toolbar sx={{ height: 80, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <DirectionsCarIcon sx={{ fontSize: 40 }} />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Araç Kiralama
          </Typography>
        </Box>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleMobileMenuOpen}
              sx={{ fontSize: 30 }}
            >
              <MenuIcon />
            </IconButton>
            {renderMobileMenu}
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                href={item.href}
                sx={{
                  mx: 1,
                  py: 1,
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
              sx={{
                ml: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <AccountCircle sx={{ fontSize: 35 }} />
            </IconButton>
            {renderMenu}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;