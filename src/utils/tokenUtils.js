import {jwtDecode} from 'jwt-decode';

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Token çözümleme hatası:', error);
    return null;
  }
};

export const getUsernameFromToken = (token) => {
  const decodedToken = decodeToken(token);
  return decodedToken ? decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] : null;
};