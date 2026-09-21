import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeftRight, TrendingUp, RefreshCw, Copy, Check, Info, Globe } from 'lucide-react';
import { fetchExchangeRates, CURRENCY_METADATA, POPULAR_CURRENCIES } from '../services/currencyApi';

export default function CurrencyConverter({ onApiStatusChange }) {
  const [rates, setRates] = useState({});
  const [lastUpdate, setLastUpdate] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [copied, setCopied] = useState(false);

  // Load exchange rates
  const loadRates = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchExchangeRates('USD', force);
      setRates(data.rates || {});
      setLastUpdate(data.lastUpdate || '');
      setError(data.error || null);
      if (onApiStatusChange) {
        onApiStatusChange(!data.error);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to fetch live rates. Using cached or fallback rates.');
      if (onApiStatusChange) onApiStatusChange(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRates(false);
  }, []);

  // Compute conversion
  const conversionResult = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num) || !rates[fromCurrency] || !rates[toCurrency]) return 0;
    // Conversion: amount / rate(from) * rate(to)  (since rates are USD base)
    const usdAmount = num / rates[fromCurrency];
    const converted = usdAmount * rates[toCurrency];
    return converted;
  }, [amount, fromCurrency, toCurrency, rates]);

  // Single unit rates
  const singleUnitRate = useMemo(() => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return 0;
    return rates[toCurrency] / rates[fromCurrency];
  }, [fromCurrency, toCurrency, rates]);

  const inverseRate = useMemo(() => {
    if (singleUnitRate === 0) return 0;
    return 1 / singleUnitRate;
  }, [singleUnitRate]);

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(conversionResult.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Available currency codes
  const availableCurrencies = useMemo(() => {
    const keys = Object.keys(rates);
    if (keys.length > 0) return keys.sort();
    return Object.keys(CURRENCY_METADATA);
  }, [rates]);

  const getCurrencyLabel = (code) => {
    const meta = CURRENCY_METADATA[code];
    if (meta) {
      return `${meta.flag} ${code} - ${meta.name}`;
    }
    return code;
  };

  return (
    <div className="view-container">
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-title-icon">
              <Globe size={18} />
            </div>
            <div>
              <h2 className="card-title">Live Currency Exchange</h2>
              <span className="card-subtitle">
                {lastUpdate ? `Rates updated: ${lastUpdate}` : 'Fetching live exchange rates...'}
              </span>
            </div>
          </div>

          <button 
            className="icon-btn" 
            onClick={() => loadRates(true)} 
            disabled={refreshing || loading}
            title="Force refresh live rates"
          >
            <RefreshCw size={16} className={refreshing ? 'spin-animation' : ''} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', color: 'var(--accent-amber)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Currency Converter Inputs */}
        <div className="currency-converter-box">
          {/* Source Currency */}
          <div className="currency-input-card">
            <label className="input-label" htmlFor="currency-amount-input">You Send</label>
            <input
              id="currency-amount-input"
              type="number"
              min="0"
              step="any"
              className="form-control form-control-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <div className="mt-2">
              <label className="input-label" htmlFor="from-currency-select">From Currency</label>
              <select
                id="from-currency-select"
                className="form-control"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {availableCurrencies.map((c) => (
                  <option key={c} value={c}>
                    {getCurrencyLabel(c)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="swap-btn-container">
            <button className="swap-btn" onClick={handleSwap} title="Swap currencies" aria-label="Swap currencies">
              <ArrowLeftRight size={20} />
            </button>
          </div>

          {/* Target Currency */}
          <div className="currency-input-card">
            <label className="input-label" htmlFor="currency-target-output">You Get (Estimated)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                id="currency-target-output"
                type="text"
                readOnly
                className="form-control form-control-lg"
                value={isNaN(conversionResult) ? '0.00' : conversionResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              />
              <button 
                className="icon-btn" 
                onClick={handleCopy} 
                title="Copy result"
                style={{ flexShrink: 0, height: '48px', width: '48px' }}
              >
                {copied ? <Check size={18} className="text-emerald" /> : <Copy size={18} />}
              </button>
            </div>

            <div className="mt-2">
              <label className="input-label" htmlFor="to-currency-select">To Currency</label>
              <select
                id="to-currency-select"
                className="form-control"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {availableCurrencies.map((c) => (
                  <option key={c} value={c}>
                    {getCurrencyLabel(c)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Rates Summary Bar */}
        <div className="rate-summary-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={16} className="text-indigo" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              1 {fromCurrency} = {singleUnitRate.toFixed(4)} {toCurrency}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            1 {toCurrency} = {inverseRate.toFixed(4)} {fromCurrency}
          </div>
        </div>

        {/* Quick Multi-Currency Portfolio / Comparison Grid */}
        <div className="mt-4">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Quick Comparison for {amount || '0'} {fromCurrency}
          </h3>
          <div className="popular-currencies-grid">
            {POPULAR_CURRENCIES.filter(c => c !== fromCurrency).slice(0, 10).map((curr) => {
              const meta = CURRENCY_METADATA[curr] || { flag: '🌐', symbol: '', name: curr };
              const rate = rates[curr] && rates[fromCurrency] ? (rates[curr] / rates[fromCurrency]) : 0;
              const val = (parseFloat(amount) || 0) * rate;

              return (
                <div 
                  key={curr} 
                  className="currency-mini-card"
                  onClick={() => setToCurrency(curr)}
                  title={`Click to set as target currency (${curr})`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                      {meta.flag} {curr}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      1 = {rate.toFixed(3)}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {meta.symbol} {val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
