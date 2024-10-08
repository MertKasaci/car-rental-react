import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import NavBar from '../components/NavBar';
import FilterSection from '../components/VehicleFilterSection';
import VehicleCard from '../components/VehicleCard';
import { getAllVehiclesAsync } from '../api/api';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllVehiclesAsync(filters);
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError('Araçlar yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Araç Rezervasyonu
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FilterSection onFilterApply={handleFilterApply} />
          </Grid>
          <Grid item xs={12} md={9}>
            {loading ? (
              <Typography>Yükleniyor...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : vehicles.length === 0 ? (
              <Typography>Hiç araç bulunamadı.</Typography>
            ) : (
              <Grid container spacing={3}>
                {vehicles.map((vehicle) => (
                  <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                    <VehicleCard
                      vehicle={{
                        id:vehicle.id,
                        model: vehicle.model.name,
                        year: vehicle.year,
                        licensePlate: vehicle.licensePlate,
                        color: vehicle.color,
                        dailyPrice: vehicle.dailyPrice,
                        status: vehicle.status
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default VehiclesPage;