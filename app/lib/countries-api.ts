/**
 * Fetch worldwide countries dari restcountries.com (free API)
 * Format: { code, name, dial }
 */
export async function getWorldwideCountries() {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    if (!res.ok) throw new Error('Failed to fetch countries');

    const countries = await res.json();

    return countries
      .map((country: any) => ({
        code: country.cca2,
        name: country.name?.common || country.name?.official || '',
        dial: country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}` : '+1',
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error('Error fetching countries:', err);
    return [];
  }
}

/**
 * Get basic regions/states for a country
 * Fallback: return simple region if not available in detailed DB
 */
export async function getCountryRegions(countryCode: string): Promise<string[]> {
  try {
    // Try to fetch from countries API detail
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    if (!res.ok) throw new Error('Failed to fetch country detail');

    const [country] = await res.json();

    // Return states if available (some countries have this data)
    if (country.flags?.at(0)) {
      // For demo: return common regions/states for known countries
      const regionMap: { [key: string]: string[] } = {
        'ID': ['Aceh', 'Bali', 'Bangka Belitung', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta', 'Gorontalo', 'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Kalimantan Barat', 'Kalimantan Selatan', 'Kalimantan Tengah', 'Kalimantan Timur', 'Kalimantan Utara', 'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Papua', 'Papua Barat', 'Riau', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tengah', 'Sulawesi Tenggara', 'Sulawesi Utara', 'Sumatera Barat', 'Sumatera Selatan', 'Sumatera Utara'],
        'US': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
        'CN': ['Anhui', 'Beijing', 'Chongqing', 'Fujian', 'Gansu', 'Guangdong', 'Guangxi', 'Guizhou', 'Hainan', 'Hebei', 'Heilongjiang', 'Henan', 'Hong Kong', 'Hubei', 'Hunan', 'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning', 'Macao', 'Ningxia', 'Qinghai', 'Shaanxi', 'Shandong', 'Shanghai', 'Shanxi', 'Sichuan', 'Taiwan', 'Tianjin', 'Tibet', 'Xinjiang', 'Yunnan', 'Zhejiang'],
        'JP': ['Aichi', 'Akita', 'Aomori', 'Chiba', 'Ehime', 'Fukui', 'Fukuoka', 'Fukushima', 'Gifu', 'Gunma', 'Hiroshima', 'Hokkaido', 'Hyogo', 'Ibaraki', 'Ishikawa', 'Iwate', 'Kagawa', 'Kagoshima', 'Kanagawa', 'Kochi', 'Kumamoto', 'Kyoto', 'Mie', 'Miyagi', 'Miyazaki', 'Nagano', 'Nagasaki', 'Nara', 'Niigata', 'Okinawa', 'Osaka', 'Saga', 'Saitama', 'Shiga', 'Shimane', 'Shizuoka', 'Tokyo', 'Tochigi', 'Tokushima', 'Tottori', 'Toyama', 'Wakayama', 'Yamagata', 'Yamaguchi', 'Yamanashi'],
        'SG': ['Singapore'],
        'MY': ['Johor', 'Kedah', 'Kelantan', 'Malacca', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'],
        'TH': ['Amnat Charoen', 'Amphy', 'Bangkok', 'Buriram', 'Chaiyaphum', 'Chachoengsao', 'Chiang Mai', 'Chiang Rai', 'Chonburi', 'Chumphon', 'Kalasin', 'Kamphaeng Phet', 'Kanchanaburi', 'Khon Kaen', 'Krabi', 'Lampang', 'Lamphun', 'Loei', 'Lopburi', 'Mae Hong Son', 'Maha Sarakham', 'Mukdahan', 'Nakhon Nayok', 'Nakhon Pathom', 'Nakhon Phanom', 'Nakhon Ratchasima', 'Nakhon Sawan', 'Nakhon Si Thammarat', 'Nan', 'Narathiwat', 'Nong Bua Lamphu', 'Nong Khai', 'Nonthaburi', 'Pathum Thani', 'Pattani', 'Phangnga', 'Phatthalung', 'Phuket', 'Phrae', 'Pichit', 'Prachuap Khiri Khan', 'Prachinburi', 'Prajuab Kirikhan', 'Ranong', 'Ratchaburi', 'Rayong', 'Roi Et', 'Sakon Nakhon', 'Samphanthong', 'Samut Prakan', 'Samut Sakhon', 'Samut Songkhram', 'Saraburi', 'Satun', 'Sisaket', 'Songkhla', 'Sukhothai', 'Suphanburi', 'Surat Thani', 'Surin', 'Tak', 'Trang', 'Trat', 'Ubon Ratchathani', 'Udorn Thani', 'Uthai Thani', 'Uttaradit', 'Yasothon'],
        'AE': ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras al-Khaimah', 'Sharjah', 'Umm Al Quwain'],
        'SA': ['Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Asir', 'Tabuk', 'Ha\'il', 'Jouf', 'Qassim', 'Najran', 'Jazan', 'Northern Borders'],
      };

      return regionMap[countryCode] || ['Province/State'];
    }

    return ['Region'];
  } catch (err) {
    console.error('Error fetching country regions:', err);
    return ['Region'];
  }
}

/**
 * Get cities for a state (simplified - returns generic city name)
 * In real scenario, this would call another detailed geo API
 */
export function getStateCities(state: string): string[] {
  // Generic cities for demo - can be extended with real data per state
  return [`${state} City`, `${state} Center`, `North ${state}`, `South ${state}`];
}

/**
 * Get districts for a city (simplified)
 */
export function getCityDistricts(city: string): string[] {
  return [`${city} District 1`, `${city} District 2`, `${city} District 3`, `Central ${city}`];
}
