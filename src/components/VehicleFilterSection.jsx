import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Paper, Slider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAllVehiclesAsync, getVehicleColors, getVehicleStatuses } from '../api/api';
import { colorTranslations, statusTranslations, translate } from '../utils/translations';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#7289da', // Use the exact color code from your theme
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#5a6fb4', // Slightly darker shade for hover
  },
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
}));

const VehicleFilterSection = ({ onFilterApply }) => {
  const [filters, setFilters] = useState({
    minDailyPrice: null,
    maxDailyPrice: null,
    year: null,
    color: null,
    status: null
  });

  const [colors, setColors] = useState({});
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const fetchedColors = await getVehicleColors();
        const fetchedStatuses = await getVehicleStatuses();
        setColors(fetchedColors);
        setStatuses(fetchedStatuses);
      } catch (error) {
        console.error('Enum değerleri alınırken hata oluştu:', error);
      }
    };

    fetchEnums();
  }, []);

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value === '' ? null : value
    }));
  }, []);

  const handlePriceChange = (event, newValue) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      minDailyPrice: newValue[0],
      maxDailyPrice: newValue[1]
    }));
  };

  const handleApplyFilters = useCallback(() => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    onFilterApply(activeFilters);
  }, [filters, onFilterApply]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      minDailyPrice: null,
      maxDailyPrice: null,
      year: null,
      color: null,
      status: null
    });
  }, []);

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Araç Filtreleri
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Günlük Fiyat Aralığı</Typography>
        <Slider
          value={[filters.minDailyPrice, filters.maxDailyPrice]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
        />
      </Box>
      
      <TextField
        label="Yıl"
        type="number"
        value={filters.year || ''}
        onChange={(e) => handleFilterChange('year', e.target.value)}
        fullWidth
        margin="normal"
        sx={{ mb: 2 }}
      />
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Renk</InputLabel>
        <Select
          value={filters.color || ''}
          onChange={(e) => handleFilterChange('color', e.target.value)}
          label="Renk"
        >
          <MenuItem value="">
            <em>Seçiniz</em>
          </MenuItem>
          {Object.entries(colors).map(([key, value]) => (
            <MenuItem key={key} value={key}>{translate(value, colorTranslations)}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Durum</InputLabel>
        <Select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          label="Durum"
        >
          <MenuItem value="">
            <em>Seçiniz</em>
          </MenuItem>
          {Object.entries(statuses).map(([key, value]) => (
            <MenuItem key={key} value={key}>{translate(value, statusTranslations)}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledButton variant="contained" color="primary" onClick={handleApplyFilters} sx={{ flex: 1, mr: 1 }}>
          Uygula
        </StyledButton>
        <StyledButton 
        variant="outlined" 
        onClick={handleResetFilters} 
        sx={{ 
          flex: 1, 
          ml: 1, 
          backgroundColor: 'transparent', 
          color: '#7289da', 
          borderColor: '#7289da',
          '&:hover': {
            backgroundColor: 'rgba(114, 137, 218, 0.1)', // Light background on hover
          }
        }}
      >
        Sıfırla
      </StyledButton>
      </Box>
    </StyledPaper>
  );
};

export default VehicleFilterSection;