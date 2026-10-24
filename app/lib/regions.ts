export type InternationalRegionData = {
  [countryCode: string]: {
    name: string;
    provinces: {
      [province: string]: {
        [city: string]: string[]; // list of districts / subdistricts
      };
    };
  };
};

export const INTERNATIONAL_REGIONS: InternationalRegionData = {
  ID: {
    name: "Indonesia",
    provinces: {
      "DKI Jakarta": {
        "Jakarta Pusat": ["Menteng", "Gambir", "Tanah Abang", "Senen"],
        "Jakarta Selatan": ["Kebayoran Baru", "Mampang Prapatan", "Setiabudi", "Cilandak"],
        "Jakarta Barat": ["Grogol Petamburan", "Palmerah", "Kebon Jeruk", "Cengkareng"]
      },
      "Jawa Barat": {
        "Kota Bandung": ["Coblong", "Cicendo", "Bandung Wetan", "Sumur Bandung"],
        "Kab. Bekasi": ["Cikarang Pusat", "Cikarang Utara", "Cikarang Selatan", "Tambun Selatan"],
        "Kota Bekasi": ["Bekasi Selatan", "Bekasi Barat", "Bekasi Timur", "Jatiasih"]
      },
      "Jawa Timur": {
        "Kota Surabaya": ["Gubeng", "Tegalsari", "Wonokromo", "Rungkut"],
        "Kab. Sidoarjo": ["Sidoarjo", "Waru", "Buduran", "Taman"]
      },
      "Jawa Tengah": {
        "Kota Semarang": ["Semarang Tengah", "Candisari", "Gajahmungkur", "Banyumanik"],
        "Kota Surakarta": ["Laweyan", "Banjarsari", "Jebres", "Pasar Kliwon"]
      },
      "Bali": {
        "Kota Denpasar": ["Denpasar Selatan", "Denpasar Barat", "Denpasar Timur", "Denpasar Utara"],
        "Kab. Badung": ["Kuta", "Kuta Selatan", "Kuta Utara", "Mengwi"]
      }
    }
  },
  SG: {
    name: "Singapore",
    provinces: {
      "Singapore State": {
        "Central Region": ["Orchard", "Marina Bay", "Downtown Core", "Newton"],
        "East Region": ["Tampines", "Bedok", "Pasir Ris", "Changi"],
        "West Region": ["Jurong East", "Jurong West", "Clementi", "Boon Lay"]
      }
    }
  },
  MY: {
    name: "Malaysia",
    provinces: {
      "Selangor": {
        "Petaling Jaya": ["Bandar Utama", "Damansara", "Kelana Jaya"],
        "Shah Alam": ["Section 13", "Setia Alam", "Subang Hi-Tech"]
      },
      "Kuala Lumpur": {
        "KL City Center": ["Bukit Bintang", "KLCC", "Chow Kit", "Brickfields"]
      },
      "Johor": {
        "Johor Bahru": ["Tebrau", "Skudai", "Plentong", "Tampoi"]
      }
    }
  },
  US: {
    name: "United States",
    provinces: {
      "California": {
        "Los Angeles": ["Downtown LA", "Hollywood", "Westwood", "Venice"],
        "San Francisco": ["Financial District", "Mission District", "SoMa", "Chinatown"]
      },
      "New York": {
        "New York City": ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"]
      },
      "Texas": {
        "Houston": ["Downtown", "Galleria", "Medical Center", "Greater Heights"],
        "Dallas": ["Downtown", "Uptown", "Deep Ellum", "Oak Lawn"]
      }
    }
  },
  CN: {
    name: "China",
    provinces: {
      "Shanghai": {
        "Shanghai City": ["Huangpu", "Xuhui", "Jing'an", "Pudong"]
      },
      "Guangdong": {
        "Guangzhou": ["Tianhe", "Yuexiu", "Liwan", "Haizhu"],
        "Shenzhen": ["Nanshan", "Futian", "Luohu", "Bao'an"]
      },
      "Zhejiang": {
        "Hangzhou": ["Xihu", "Gongshu", "Shangcheng", "Binjiang"]
      }
    }
  },
  JP: {
    name: "Japan",
    provinces: {
      "Tokyo": {
        "Tokyo Metropolis": ["Shinjuku", "Shibuya", "Minato", "Chiyoda", "Chuo"]
      },
      "Osaka": {
        "Osaka City": ["Kita", "Namba", "Tennoji", "Yodogawa"]
      }
    }
  },
  AE: {
    name: "United Arab Emirates",
    provinces: {
      "Dubai": {
        "Dubai Emirate": ["Downtown Dubai", "Deira", "Bur Dubai", "Dubai Marina", "Business Bay"]
      },
      "Abu Dhabi": {
        "Abu Dhabi Emirate": ["Al Maryah Island", "Al Reem Island", "Corniche", "Khalifa City"]
      }
    }
  },
  SA: {
    name: "Saudi Arabia",
    provinces: {
      "Riyadh Region": {
        "Riyadh City": ["Al Olaya", "Al Malaz", "Al Batha", "Diplomatic Quarter"]
      },
      "Makkah Region": {
        "Jeddah": ["Al Alros", "Al Balad", "Al Rawdah", "Al Hamra"],
        "Makkah": ["Al Haram", "Aziziyah", "Al Maabdah"]
      }
    }
  }
};
