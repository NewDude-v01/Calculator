import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Calculator from './components/Calculator';
import CurrencyConverter from './components/CurrencyConverter';
import UnitConverter from './components/UnitConverter';
import BmiCalculator from './components/BmiCalculator';
import FinanceCalculator from './components/FinanceCalculator';
import { fetchExchangeRates } from './services/currencyApi';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('omni_theme') || 'dark';
  });

  const [activeTab, setActiveTab] = useState('calc');
  const [isApiLive, setIsApiLive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('omni_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleGlobalRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchExchangeRates('USD', true);
      setIsApiLive(!data.error);
    } catch {
      setIsApiLive(false);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="app-container">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        isApiLive={isApiLive}
        onRefreshApi={handleGlobalRefresh}
        isRefreshing={isRefreshing}
      />

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-wrapper">
        {activeTab === 'calc' && <Calculator />}
        {activeTab === 'currency' && (
          <CurrencyConverter onApiStatusChange={(status) => setIsApiLive(status)} />
        )}
        {activeTab === 'units' && <UnitConverter />}
        {activeTab === 'bmi' && <BmiCalculator />}
        {activeTab === 'finance' && <FinanceCalculator />}
      </main>

      <footer className="app-footer">
        <p>OmniCalc &amp; Converter &bull; Built with React &amp; Live Currency Exchange API</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>High-precision calculations for metrics, finances, and measurements</p>
      </footer>
    </div>
  );
}
