export const colorTranslations = {
    "Red": "Kırmızı",
    "Blue": "Mavi",
    "Black": "Siyah",
    "White": "Beyaz",
    "Gray": "Gri",
    "Silver": "Gümüş",
    "Green": "Yeşil",
    "Yellow": "Sarı",
    "Orange": "Turuncu",
    "Brown": "Kahverengi",
    "Purple": "Mor"
  };
  
  export const statusTranslations = {
    "Available": "Müsait",
    "Rented": "Kiralandı",
    "Maintenance": "Bakımda"
  };

  export const fuelTypeTranslations = {
    "Petrol": "Benzin",
    "Diesel": "Dizel",
    "Electric": "Elektrik",
    "Hybrid": "Hibrit"
  };
  
  export const transmissionTypeTranslations = {
    "Manual": "Manuel",
    "Automatic": "Otomatik",
    "SemiAutomatic": "Yarı Otomatik"
  };

  export const transmissionType = {

  };
  
  // Genel çeviri fonksiyonu
  export const translate = (value, translations) => {
    return translations[value] || value;
  };