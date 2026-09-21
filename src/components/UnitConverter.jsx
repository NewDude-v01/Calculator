import React, { useState, useMemo } from 'react';
import { 
  Ruler, Scale, Thermometer, Gauge, Grid, Beaker, HardDrive, Clock, 
  ArrowLeftRight, Copy, Check 
} from 'lucide-react';
import { UNIT_CATEGORIES, convertUnit, formatResultNumber } from '../services/unitDefinitions';

const CATEGORY_ICONS = {
  length: Ruler,
  mass: Scale,
  temperature: Thermometer,
  speed: Gauge,
  area: Grid,
  volume: Beaker,
  digital: HardDrive,
  time: Clock
};

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState('length');
  const [fromValue, setFromValue] = useState('1');
  const [fromUnit, setFromUnit] = useState(() => UNIT_CATEGORIES.length.defaultFrom);
  const [toUnit, setToUnit] = useState(() => UNIT_CATEGORIES.length.defaultTo);
  const [copied, setCopied] = useState(false);

  // When switching category, update units
  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    const cat = UNIT_CATEGORIES[catId];
    setFromUnit(cat.defaultFrom);
    setToUnit(cat.defaultTo);
  };

  // Convert
  const convertedResult = useMemo(() => {
    return convertUnit(fromValue, activeCategory, fromUnit, toUnit);
  }, [fromValue, activeCategory, fromUnit, toUnit]);

  // Swap units
  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatResultNumber(convertedResult));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const currentCategory = UNIT_CATEGORIES[activeCategory];
  const unitList = Object.entries(currentCategory.units);

  return (
    <div className="view-container">
      <div className="card">
        {/* Category Pills Header */}
        <div className="unit-category-pills">
          {Object.values(UNIT_CATEGORIES).map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Ruler;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`unit-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                <Icon size={16} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dual Conversion Input Box */}
        <div className="currency-converter-box">
          {/* From Card */}
          <div className="currency-input-card">
            <label className="input-label" htmlFor="unit-from-input">From</label>
            <input
              id="unit-from-input"
              type="number"
              step="any"
              className="form-control form-control-lg"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="Enter value"
            />
            <div className="mt-2">
              <label className="input-label" htmlFor="unit-from-select">Unit</label>
              <select
                id="unit-from-select"
                className="form-control"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
              >
                {unitList.map(([key, u]) => (
                  <option key={key} value={key}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="swap-btn-container">
            <button className="swap-btn" onClick={handleSwap} title="Swap units" aria-label="Swap units">
              <ArrowLeftRight size={20} />
            </button>
          </div>

          {/* To Card */}
          <div className="currency-input-card">
            <label className="input-label" htmlFor="unit-to-output">To (Result)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                id="unit-to-output"
                type="text"
                readOnly
                className="form-control form-control-lg"
                value={formatResultNumber(convertedResult)}
                placeholder="0"
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
              <label className="input-label" htmlFor="unit-to-select">Unit</label>
              <select
                id="unit-to-select"
                className="form-control"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
              >
                {unitList.map(([key, u]) => (
                  <option key={key} value={key}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* All Units in Category Realtime Overview */}
        <div className="mt-4">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            All {currentCategory.name} Conversions for {fromValue || '0'} {currentCategory.units[fromUnit]?.symbol}
          </h3>

          <div className="unit-grid-overview">
            {unitList.map(([key, u]) => {
              const res = convertUnit(fromValue, activeCategory, fromUnit, key);
              const isSelected = key === toUnit;
              return (
                <div 
                  key={key} 
                  className="unit-stat-item"
                  style={{ borderColor: isSelected ? 'var(--accent-primary)' : undefined, background: isSelected ? 'rgba(99, 102, 241, 0.08)' : undefined }}
                  onClick={() => setToUnit(key)}
                  title="Click to select as target unit"
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.name}</div>
                    <div className="unit-stat-name">{u.symbol}</div>
                  </div>
                  <div className="unit-stat-val">
                    {formatResultNumber(res)}
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
