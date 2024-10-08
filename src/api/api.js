import axios from 'axios';

const api = axios.create({
    baseURL:'https://localhost:7197/api' // Backend base url.
});

//User Fetch Operations
export const registerUser = async(userRegisterData) => {
    try 
    {
        const response = await api.post('/authentication/register',userRegisterData);
        return response.data;
    }
    catch(error)
    {
        throw error.response ? error.response.data : error;
    }

};
export const authenticateUser = async(userAuthenticationData) => {
    console.log('API çağrısı yapılıyor');
    try 
    {
        
        const response = await api.post('/authentication/login',userAuthenticationData);
        return response.data;
    }
    catch(error)
    {
        throw error.response ? error.response.data : error;
    }

};
export const fetchUserDetailsAsync = async(name) => {
    try
    {
      const response = await api.get(`/users/${name}`)
      return response.data;
    }
    catch(error)
    {
     console.error('fetchUserDetails error:', error);
     throw error.response ? error.response.data : error;
    }

};

export const updateUserDetails = async (userId, userDetails) => {
    try {
        const response = await api.put(`/users/${userId}`, userDetails);
        return response.data;
    } catch (error) {
        console.error('Kullanıcı bilgileri güncellenemedi:', error);
        throw error;
    }
};

//Vehicle Fetch Operations
export const getAllVehiclesAsync = async (params) => {
    try {
      const response = await api.get('/vehicles', { params });
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };



  

export const getVehicleDetails = async (id) => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      throw error;
    }
};

export const getAllCampaignsAsync = async(params) => {
    const response = await api.get('/campaigns', { params });
    return response.data;
}

export const getAllReviewsAsync = async(params) => {
    const response = await api.get('/reviews', { params });
    return response.data;
}

//Enum Fetch Operations
export const getVehicleColors = async () => {
    const response = await api.get('/enums/vehicle-colors');
    return response.data;
  };
  
  export const getVehicleStatuses = async () => {
    const response = await api.get('/enums/vehicle-statuses');
    return response.data;
  };


  export const getAllLocationsAsync = async () => {
    try {
      const response = await api.get('/locations');
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error.response ? error.response.data : error;
    }
  };

  
  export const createReservation = async (reservationData) => {
  try {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  } catch (error) {
    console.error('Rezervasyon oluşturulurken hata:', error);
    throw error.response ? error.response.data : error;
  }
};




// Kullanıcı için uygun kampanyaları getir
export const getAvailableCampaignsForUser = async (userId) => {
  try {
    const response = await api.get(`/campaigns/users/${userId}/available-campaigns`);
    return response.data;
  } catch (error) {
    console.error('Kullanıcı için uygun kampanyalar alınırken hata oluştu:', error);
    throw error;
  }
};

// Kullanıcıya kampanya ekle
export const addCampaignToUser = async (campaignId, userId) => {
  try {
    const response = await api.post(`/campaigns/${campaignId}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Kullanıcıya kampanya eklenirken hata oluştu:', error);
    throw error;
  }
};

export const getAllReservationsAsync = async () => {
  try {
    const response = await api.get('/reservations');
    return response.data;
  } catch (error) {
    console.error('Rezervasyonlar alınırken hata oluştu:', error);
    throw error;
  }
};


export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Yorum oluşturulurken hata oluştu:', error);
    throw error.response ? error.response.data : error;
  }
};


export default api;