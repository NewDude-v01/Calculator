import React, { useState, useMemo } from 'react';
import { Activity, Heart, Flame, ShieldAlert, Sparkles, User } from 'lucide-react';

export default function BmiCalculator() {
  const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' or 'imperial'
  
  // Metric states
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');

  // Imperial states
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');
  const [weightLbs, setWeightLbs] = useState('155');

  // Demographic stats for BMR / Calorie estimate
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('28');
  const [activityLevel, setActivityLevel] = useState('1.375'); // light active

  // Calculate BMI and Weight limits
  const { bmi, category, colorClass, needlePosition, minHealthyWeight, maxHealthyWeight, bmr, tdee } = useMemo(() => {
    let hM = 0;
    let wKg = 0;
    let hCm = 0;

    if (unitSystem === 'metric') {
      hCm = parseFloat(heightCm) || 0;
      hM = hCm / 100;
      wKg = parseFloat(weightKg) || 0;
    } else {
      const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
      hCm = totalInches * 2.54;
      hM = hCm / 100;
      wKg = (parseFloat(weightLbs) || 0) * 0.45359237;
    }

    if (hM <= 0 || wKg <= 0) {
      return { bmi: 0, category: 'N/A', colorClass: 'text-muted', needlePosition: 0, minHealthyWeight: 0, maxHealthyWeight: 0, bmr: 0, tdee: 0 };
    }

    const calculatedBmi = wKg / (hM * hM);

    // Healthy weight range (BMI 18.5 - 24.9)
    const minW = 18.5 * (hM * hM);
    const maxW = 24.9 * (hM * hM);

    // Categories
    let cat = 'Normal Weight';
    let cClass = 'text-emerald';

    if (calculatedBmi < 18.5) {
      cat = 'Underweight';
      cClass = 'text-cyan';
    } else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
      cat = 'Normal Weight';
      cClass = 'text-emerald';
    } else if (calculatedBmi >= 25.0 && calculatedBmi <= 29.9) {
      cat = 'Overweight';
      cClass = 'text-amber';
    } else if (calculatedBmi >= 30.0 && calculatedBmi <= 34.9) {
      cat = 'Obese (Class I)';
      cClass = 'text-rose';
    } else if (calculatedBmi >= 35.0 && calculatedBmi <= 39.9) {
      cat = 'Obese (Class II)';
      cClass = 'text-rose';
    } else {
      cat = 'Extremely Obese (Class III)';
      cClass = 'text-rose';
    }

    // Needle position along gauge (mapped from BMI 15 to 40)
    const clampedBmi = Math.min(Math.max(calculatedBmi, 15), 40);
    const posPercent = ((clampedBmi - 15) / (40 - 15)) * 100;

    // BMR (Mifflin-St Jeor)
    const ageNum = parseFloat(age) || 25;
    let bmrVal = (10 * wKg) + (6.25 * hCm) - (5 * ageNum);
    bmrVal = gender === 'male' ? bmrVal + 5 : bmrVal - 161;
    const tdeeVal = bmrVal * parseFloat(activityLevel);

    return {
      bmi: parseFloat(calculatedBmi.toFixed(1)),
      category: cat,
      colorClass: cClass,
      needlePosition: Math.min(Math.max(posPercent, 0), 100),
      minHealthyWeight: unitSystem === 'metric' ? minW.toFixed(1) + ' kg' : (minW * 2.20462).toFixed(1) + ' lbs',
      maxHealthyWeight: unitSystem === 'metric' ? maxW.toFixed(1) + ' kg' : (maxW * 2.20462).toFixed(1) + ' lbs',
      bmr: Math.round(bmrVal),
      tdee: Math.round(tdeeVal)
    };
  }, [unitSystem, heightCm, weightKg, heightFt, heightIn, weightLbs, gender, age, activityLevel]);

  return (
    <div className="view-container">
      <div className="bmi-grid">
        {/* Input Parameters Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon">
                <Activity size={18} />
              </div>
              <div>
                <h2 className="card-title">BMI &amp; Body Metrics</h2>
                <span className="card-subtitle">Calculate BMI, ideal weight, and metabolic rate</span>
              </div>
            </div>

            <div className="pill-toggle">
              <button 
                className={`pill-option ${unitSystem === 'metric' ? 'active' : ''}`}
                onClick={() => setUnitSystem('metric')}
              >
                Metric
              </button>
              <button 
                className={`pill-option ${unitSystem === 'imperial' ? 'active' : ''}`}
                onClick={() => setUnitSystem('imperial')}
              >
                Imperial
              </button>
            </div>
          </div>

          {/* Metric Inputs */}
          {unitSystem === 'metric' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="input-label" htmlFor="bmi-height-cm">Height (cm)</label>
                <input
                  id="bmi-height-cm"
                  type="number"
                  min="50"
                  max="260"
                  className="form-control form-control-lg"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label" htmlFor="bmi-weight-kg">Weight (kg)</label>
                <input
                  id="bmi-weight-kg"
                  type="number"
                  min="20"
                  max="400"
                  className="form-control form-control-lg"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                />
              </div>
            </div>
          ) : (
            /* Imperial Inputs */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="input-label" htmlFor="bmi-height-ft">Height (ft)</label>
                <input
                  id="bmi-height-ft"
                  type="number"
                  min="2"
                  max="8"
                  className="form-control form-control-lg"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label" htmlFor="bmi-height-in">Height (in)</label>
                <input
                  id="bmi-height-in"
                  type="number"
                  min="0"
                  max="11"
                  className="form-control form-control-lg"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label" htmlFor="bmi-weight-lbs">Weight (lbs)</label>
                <input
                  id="bmi-weight-lbs"
                  type="number"
                  min="40"
                  max="800"
                  className="form-control form-control-lg"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Profile Details for BMR */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Profile &amp; Activity (for Daily Calories)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="input-label" htmlFor="bmi-gender-select">Gender</label>
                <select 
                  id="bmi-gender-select"
                  className="form-control"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="bmi-age-input">Age</label>
                <input 
                  id="bmi-age-input"
                  type="number"
                  min="10"
                  max="120"
                  className="form-control"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="bmi-activity-select">Daily Activity Level</label>
              <select 
                id="bmi-activity-select"
                className="form-control"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
              >
                <option value="1.2">Sedentary (Little or no exercise)</option>
                <option value="1.375">Lightly Active (Exercise 1-3 days/week)</option>
                <option value="1.55">Moderately Active (Exercise 3-5 days/week)</option>
                <option value="1.725">Very Active (Hard exercise 6-7 days/week)</option>
                <option value="1.9">Extremely Active (Physical job or 2x daily training)</option>
              </select>
            </div>
          </div>
        </div>

        {/* BMI Results & Spectrum Gauge Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="bmi-score-badge">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>YOUR BMI SCORE</span>
              <div className={`bmi-score-number ${colorClass}`}>{bmi || '--'}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }} className={colorClass}>
                {category}
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="bmi-spectrum-bar">
              <div 
                className="bmi-indicator-pin" 
                style={{ left: `${needlePosition}%` }}
                title={`BMI: ${bmi}`}
              >
                <div className="bmi-pin-head"></div>
                <div className="bmi-pin-line"></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Underweight (&lt;18.5)</span>
              <span>Normal (18.5-24.9)</span>
              <span>Overweight (25-29.9)</span>
              <span>Obese (&gt;30)</span>
            </div>

            {/* Healthy Weight Card */}
            <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Heart size={16} className="text-emerald" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>Ideal Healthy Weight Range</span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                For your height, a normal BMI corresponds to <strong style={{ color: 'var(--text-primary)' }}>{minHealthyWeight} – {maxHealthyWeight}</strong>.
              </div>
            </div>
          </div>

          {/* Energy & Calories Card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 600 }}>
                <Flame size={15} />
                <span>BMR (Basal Rate)</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, marginTop: '0.25rem' }}>
                {bmr} <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>kcal/day</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600 }}>
                <Sparkles size={15} />
                <span>Daily Maintenance</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, marginTop: '0.25rem' }}>
                {tdee} <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>kcal/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
