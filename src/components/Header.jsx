import React from 'react';
import { Sun, Moon, Sparkles, RefreshCw, Zap } from 'lucide-react';

export default function Header({ theme, toggleTheme, isApiLive, onRefreshApi, isRefreshing }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="brand-section">
          <div className="brand-logo-badge">
            <Zap size={22} />
          </div>
          <div>
            <h1 className="brand-title">OmniCalc</h1>
            <div className="brand-subtitle">Smart Calculation &amp; Conversion Suite</div>
          </div>
        </div>

        <div className="header-actions">
          <div className="live-badge" title="Live exchange rates API connected">
            <span className="live-dot"></span>
            <span>{isApiLive ? 'API Connected' : 'Offline Mode'}</span>
          </div>

          <button 
            className="icon-btn" 
            onClick={onRefreshApi} 
            title="Refresh live exchange rates"
            disabled={isRefreshing}
            aria-label="Refresh API data"
          >
            <RefreshCw size={17} className={isRefreshing ? 'spin-animation' : ''} />
          </button>

          <button 
            className="icon-btn" 
            onClick={toggleTheme} 
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
