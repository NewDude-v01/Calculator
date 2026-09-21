// Service for fetching and managing live exchange rates from open.er-api.com

const API_BASE = 'https://open.er-api.com/v6/latest';
const CACHE_KEY_PREFIX = 'omni_currency_rates_';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'SGD', 'HKD', 'NZD', 'BRL', 'MXN', 'KRW', 'AED', 'SAR', 'SEK', 'NOK', 'TRY'
];

export const CURRENCY_METADATA = {
  USD: { name: 'United States Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  CAD: { name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  AUD: { name: 'Australian Dollar', symbol: 'AU$', flag: '🇦🇺' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  MXN: { name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽' },
  KRW: { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  AED: { name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  SAR: { name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  SEK: { name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  TRY: { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  ZAR: { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  PLN: { name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  THB: { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  PHP: { name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  VND: { name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  DKK: { name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  CZK: { name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  HUF: { name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  ILS: { name: 'Israeli New Shekel', symbol: '₪', flag: '🇮🇱' },
  CLP: { name: 'Chilean Peso', symbol: 'CL$', flag: '🇨🇱' },
  COP: { name: 'Colombian Peso', symbol: 'COL$', flag: '🇨🇴' },
  EGP: { name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  ARS: { name: 'Argentine Peso', symbol: 'AR$', flag: '🇦🇷' },
  KWD: { name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼' },
  QAR: { name: 'Qatari Riyal', symbol: 'QR', flag: '🇶🇦' },
  RUB: { name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  PKR: { name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  NGN: { name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  BDT: { name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' }
};

// Fallback rates if user is completely offline on initial load
const FALLBACK_RATES_USD = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 154.5, CAD: 1.36, AUD: 1.52, CHF: 0.90,
  CNY: 7.23, INR: 83.5, SGD: 1.35, HKD: 7.82, NZD: 1.66, BRL: 5.15, MXN: 16.85,
  KRW: 1375.0, AED: 3.67, SAR: 3.75, SEK: 10.75, NOK: 10.82, TRY: 32.25
};

export async function fetchExchangeRates(base = 'USD', forceRefresh = false) {
  const cacheKey = `${CACHE_KEY_PREFIX}${base.toUpperCase()}`;
  
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const isFresh = Date.now() - parsed.timestamp < CACHE_TTL_MS;
        if (isFresh && parsed.rates && Object.keys(parsed.rates).length > 0) {
          return {
            rates: parsed.rates,
            lastUpdate: parsed.lastUpdate || new Date(parsed.timestamp).toUTCString(),
            fromCache: true,
            base: base.toUpperCase()
          };
        }
      }
    } catch (e) {
      console.warn('Could not read currency cache from localStorage', e);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/${base.toUpperCase()}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    if (data.result === 'success' && data.rates) {
      const payload = {
        timestamp: Date.now(),
        lastUpdate: data.time_last_update_utc || new Date().toUTCString(),
        rates: data.rates,
        base: data.base_code || base.toUpperCase()
      };
      
      try {
        localStorage.setItem(cacheKey, JSON.stringify(payload));
      } catch (e) {
        console.warn('Could not save currency rates to localStorage', e);
      }
      
      return {
        rates: data.rates,
        lastUpdate: payload.lastUpdate,
        fromCache: false,
        base: payload.base
      };
    } else {
      throw new Error(data['error-type'] || 'Failed to parse currency rate data');
    }
  } catch (error) {
    console.error('Fetch currency rates failed:', error);
    // Check if we have any stale cache
    try {
      const stale = localStorage.getItem(cacheKey);
      if (stale) {
        const parsed = JSON.parse(stale);
        return {
          rates: parsed.rates,
          lastUpdate: parsed.lastUpdate + ' (Offline/Cached)',
          fromCache: true,
          base: base.toUpperCase(),
          error: error.message
        };
      }
    } catch {}
    
    // Fallback static
    return {
      rates: FALLBACK_RATES_USD,
      lastUpdate: 'Default offline rates',
      fromCache: true,
      base: 'USD',
      error: error.message
    };
  }
}
