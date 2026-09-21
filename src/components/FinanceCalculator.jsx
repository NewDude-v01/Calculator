import React, { useState, useMemo } from 'react';
import { Landmark, Users, Tag, DollarSign, Percent, Calendar } from 'lucide-react';

export default function FinanceCalculator() {
  const [subTab, setSubTab] = useState('loan'); // 'loan', 'tip', 'discount'

  // --- 1. Loan State ---
  const [principal, setPrincipal] = useState('250000');
  const [interestRate, setInterestRate] = useState('6.5');
  const [termYears, setTermYears] = useState('30');

  // --- 2. Tip State ---
  const [billAmount, setBillAmount] = useState('85.50');
  const [tipPercent, setTipPercent] = useState('18');
  const [splitCount, setSplitCount] = useState('3');

  // --- 3. Discount State ---
  const [origPrice, setOrigPrice] = useState('120');
  const [discountPercent, setDiscountPercent] = useState('25');
  const [salesTaxPercent, setSalesTaxPercent] = useState('8.25');

  // Loan Computations
  const loanResults = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(interestRate) || 0) / 100 / 12;
    const n = (parseFloat(termYears) || 0) * 12;

    if (p <= 0 || n <= 0) return { monthly: 0, totalPayment: 0, totalInterest: 0, principalPercent: 100 };

    if (r === 0) {
      const monthly = p / n;
      return { monthly, totalPayment: p, totalInterest: 0, principalPercent: 100 };
    }

    const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - p;
    const principalPercent = (p / totalPayment) * 100;

    return {
      monthly,
      totalPayment,
      totalInterest,
      principalPercent: Math.min(Math.max(principalPercent, 0), 100)
    };
  }, [principal, interestRate, termYears]);

  // Tip Computations
  const tipResults = useMemo(() => {
    const b = parseFloat(billAmount) || 0;
    const t = parseFloat(tipPercent) || 0;
    const people = Math.max(parseInt(splitCount, 10) || 1, 1);

    const totalTip = (b * t) / 100;
    const totalBill = b + totalTip;
    const perPersonTotal = totalBill / people;
    const perPersonTip = totalTip / people;

    return {
      totalTip,
      totalBill,
      perPersonTotal,
      perPersonTip,
      people
    };
  }, [billAmount, tipPercent, splitCount]);

  // Discount Computations
  const discountResults = useMemo(() => {
    const orig = parseFloat(origPrice) || 0;
    const disc = parseFloat(discountPercent) || 0;
    const tax = parseFloat(salesTaxPercent) || 0;

    const discountAmount = (orig * disc) / 100;
    const discountedPrice = Math.max(orig - discountAmount, 0);
    const taxAmount = (discountedPrice * tax) / 100;
    const finalPrice = discountedPrice + taxAmount;

    return {
      discountAmount,
      taxAmount,
      finalPrice,
      savings: discountAmount
    };
  }, [origPrice, discountPercent, salesTaxPercent]);

  return (
    <div className="view-container">
      <div className="card">
        {/* Sub-tabs for financial calculators */}
        <div className="finance-subtabs">
          <button 
            className={`finance-subtab ${subTab === 'loan' ? 'active' : ''}`}
            onClick={() => setSubTab('loan')}
          >
            <Landmark size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Loan &amp; Mortgage
          </button>
          <button 
            className={`finance-subtab ${subTab === 'tip' ? 'active' : ''}`}
            onClick={() => setSubTab('tip')}
          >
            <Users size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Tip &amp; Split Bill
          </button>
          <button 
            className={`finance-subtab ${subTab === 'discount' ? 'active' : ''}`}
            onClick={() => setSubTab('discount')}
          >
            <Tag size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Discount &amp; Tax
          </button>
        </div>

        {/* 1. LOAN CALCULATOR */}
        {subTab === 'loan' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div className="mb-4">
                <label className="input-label" htmlFor="loan-principal">Loan Amount ($)</label>
                <input
                  id="loan-principal"
                  type="number"
                  min="1000"
                  step="1000"
                  className="form-control form-control-lg"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="input-label" htmlFor="loan-interest">Interest Rate (%)</label>
                  <input
                    id="loan-interest"
                    type="number"
                    min="0.1"
                    max="50"
                    step="0.05"
                    className="form-control"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label" htmlFor="loan-term">Loan Term (Years)</label>
                  <input
                    id="loan-term"
                    type="number"
                    min="1"
                    max="50"
                    className="form-control"
                    value={termYears}
                    onChange={(e) => setTermYears(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Loan Results Card */}
            <div className="finance-result-card">
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>ESTIMATED MONTHLY PAYMENT</span>
                <div className="finance-stat-val-large">
                  ${loanResults.monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Progress bar principal vs interest */}
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--accent-amber)', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${loanResults.principalPercent}%`, background: 'var(--accent-primary)', height: '100%' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                  <span>Principal: {loanResults.principalPercent.toFixed(1)}%</span>
                  <span>Interest: {(100 - loanResults.principalPercent).toFixed(1)}%</span>
                </div>
              </div>

              <div className="finance-stat-row">
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Total Interest Paid</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-amber)' }}>
                  ${loanResults.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="finance-stat-row">
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Total Amount Repaid</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  ${loanResults.totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. TIP & BILL SPLITTER */}
        {subTab === 'tip' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div className="mb-4">
                <label className="input-label" htmlFor="tip-bill-amount">Bill Amount ($)</label>
                <input
                  id="tip-bill-amount"
                  type="number"
                  min="0"
                  step="0.5"
                  className="form-control form-control-lg"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="input-label">Tip Percentage: {tipPercent}%</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {['10', '15', '18', '20', '25'].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`pill-option ${tipPercent === pct ? 'active' : ''}`}
                      style={{ border: '1px solid var(--border-color)', padding: '0.4rem 0.9rem' }}
                      onClick={() => setTipPercent(pct)}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={tipPercent}
                  onChange={(e) => setTipPercent(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label" htmlFor="tip-split-people">Split Between How Many People?</label>
                <input
                  id="tip-split-people"
                  type="number"
                  min="1"
                  max="100"
                  className="form-control"
                  value={splitCount}
                  onChange={(e) => setSplitCount(e.target.value)}
                />
              </div>
            </div>

            {/* Tip Results */}
            <div className="finance-result-card">
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>EACH PERSON PAYS</span>
                <div className="finance-stat-val-large">
                  ${tipResults.perPersonTotal.toFixed(2)}
                </div>
              </div>

              <div className="finance-stat-row">
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Tip per person</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                  ${tipResults.perPersonTip.toFixed(2)}
                </span>
              </div>

              <div className="finance-stat-row">
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Total Tip Amount</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  ${tipResults.totalTip.toFixed(2)}
                </span>
              </div>

              <div className="finance-stat-row">
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Total Bill (with tip)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  ${tipResults.totalBill.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. DISCOUNT & SALES TAX */}
        {subTab === 'discount' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div className="mb-4">
                <label className="input-label" htmlFor="discount-original-price">Original Price ($)</label>
                <input
                  id="discount-original-price"
                  type="number"
                  min="0"
                  step="any"
                  className="form-control form-control-lg"
                  value={origPrice}
                  onChange={(e) => setOrigPrice(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label" htmlFor="discount-pct-input">Discount (%)</label>
                  <input
                    id="discount-pct-input"
                    type="number"
                    min="0"
                    max="100"
                    className="form-control"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label" htmlFor="discount-tax-input">Sales Tax (%)</label>
                  <input
                    id="discount-tax-input"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="form-control"
                    value={salesTaxPercent}
                    onChange={(e) => setSalesTaxPercent(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Discount Results */}
            <div className="finance-result-card">
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>FINAL PAYABLE PRICE</span>
                <div className="finance-stat-val-large">
                  ${discountResults.finalPrice.toFixed(2)}
                </div>
              </div>

              <div className="finance-stat-row">
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>You Save (Discount)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  -${discountResults.savings.toFixed(2)} ({discountPercent}%)
                </span>
              </div>

              <div className="finance-stat-row">
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Sales Tax ({salesTaxPercent}%)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  +${discountResults.taxAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
