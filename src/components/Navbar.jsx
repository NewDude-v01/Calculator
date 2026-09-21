import React from 'react';
import { Calculator, ArrowRightLeft, Scale, Activity, Coins } from 'lucide-react';

const TABS = [
  { id: 'calc', label: 'Calculator', icon: Calculator },
  { id: 'currency', label: 'Live Currency', icon: Coins },
  { id: 'units', label: 'Unit Converter', icon: ArrowRightLeft },
  { id: 'bmi', label: 'BMI & Health', icon: Activity },
  { id: 'finance', label: 'Finance & Split', icon: Scale },
];

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="nav-container" aria-label="Main navigation tabs">
      <div className="nav-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={isActive}
              role="tab"
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
