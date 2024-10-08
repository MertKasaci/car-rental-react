import React from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import LatestVehicles from '../components/LatestVehicles';
import LatestCampaigns from '../components/LatestCampaigns';
import CustomerReviews from '../components/CustomerReviews';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <Header />
      <LatestVehicles />
      <LatestCampaigns />
      <CustomerReviews />
      <Footer />
    </div>
  );
};

export default HomePage;