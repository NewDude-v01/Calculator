import React, { useState, useEffect, useCallback } from 'react';
import { Delete, RotateCcw, Copy, Check, History, Sparkles } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [angleMode, setAngleMode] = useState('deg'); // 'deg' or 'rad'
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('omni_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copied, setCopied] = useState(false);
  const [isNewNumber, setIsNewNumber] = useState(true);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('omni_calc_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Could not save history', e);
    }
  }, [history]);

  // Factorial helper
  const factorial = (n) => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= Math.min(n, 170); i++) res *= i;
    return res;
  };

  const handleDigit = useCallback((d) => {
    if (isNewNumber) {
      setDisplay(d === '.' ? '0.' : d);
      setIsNewNumber(false);
    } else {
      if (d === '.' && display.includes('.')) return;
      if (display === '0' && d !== '.') {
        setDisplay(d);
      } else {
        setDisplay(prev => prev + d);
      }
    }
  }, [display, isNewNumber]);

  const handleOperator = useCallback((op) => {
    setIsNewNumber(true);
    if (equation && !isNewNumber) {
      // Evaluate current before chaining
      try {
        const fullExpr = `${equation} ${display}`;
        const evalRes = evaluateExpression(fullExpr);
        setEquation(`${evalRes} ${op}`);
        setDisplay(String(evalRes));
      } catch {
        setEquation(`${display} ${op}`);
      }
    } else {
      setEquation(`${display} ${op}`);
    }
  }, [equation, display, isNewNumber]);

  const evaluateExpression = (expr) => {
    // Safe evaluation of basic operations
    const sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**');

    // Only allow numbers, math operators, parens, decimal
    if (/[^0-9+\-*/().\s*]/.test(sanitized)) {
      throw new Error('Invalid expression');
    }

    // Function constructor safe evaluate
    const result = Function(`'use strict'; return (${sanitized})`)();
    if (!isFinite(result)) throw new Error('Math Error');
    return parseFloat(Number(result).toFixed(10));
  };

  const handleEquals = useCallback(() => {
    if (!equation) return;
    try {
      const fullExpr = `${equation} ${display}`;
      const result = evaluateExpression(fullExpr);
      const formatted = String(result);

      // Add to history
      const newEntry = {
        id: Date.now(),
        equation: fullExpr,
        result: formatted,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 19)]);

      setDisplay(formatted);
      setEquation('');
      setIsNewNumber(true);
    } catch (err) {
      setDisplay('Error');
      setEquation('');
      setIsNewNumber(true);
    }
  }, [equation, display]);

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const handleBackspace = useCallback(() => {
    if (isNewNumber) return;
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
      setIsNewNumber(true);
    } else {
      setDisplay(prev => prev.slice(0, -1));
    }
  }, [display, isNewNumber]);

  const handleNegate = () => {
    if (display === '0') return;
    setDisplay(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay(String(val / 100));
    }
  };

  // Scientific functions
  const handleScientific = (fn) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res;
    switch (fn) {
      case 'sin': {
        const rad = angleMode === 'deg' ? (val * Math.PI) / 180 : val;
        res = Math.sin(rad);
        break;
      }
      case 'cos': {
        const rad = angleMode === 'deg' ? (val * Math.PI) / 180 : val;
        res = Math.cos(rad);
        break;
      }
      case 'tan': {
        const rad = angleMode === 'deg' ? (val * Math.PI) / 180 : val;
        res = Math.tan(rad);
        break;
      }
      case 'log':
        res = Math.log10(val);
        break;
      case 'ln':
        res = Math.log(val);
        break;
      case 'sqrt':
        res = Math.sqrt(val);
        break;
      case 'sqr':
        res = Math.pow(val, 2);
        break;
      case 'inv':
        res = 1 / val;
        break;
      case 'fact':
        res = factorial(val);
        break;
      case 'pi':
        res = Math.PI;
        break;
      case 'e':
        res = Math.E;
        break;
      case 'pow':
        handleOperator('^');
        return;
      default:
        return;
    }

    if (isNaN(res) || !isFinite(res)) {
      setDisplay('Error');
    } else {
      const formatted = String(parseFloat(Number(res).toFixed(10)));
      setDisplay(formatted);
      setIsNewNumber(true);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (/^[0-9]$/.test(key)) {
        handleDigit(key);
      } else if (key === '.') {
        handleDigit('.');
      } else if (key === '+') {
        handleOperator('+');
      } else if (key === '-') {
        handleOperator('-');
      } else if (key === '*') {
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEquals, handleBackspace]);

  const copyResult = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const recallHistory = (item) => {
    setDisplay(item.result);
    setEquation('');
    setIsNewNumber(true);
  };

  return (
    <div className="view-container">
      <div className="calculator-layout">
        {/* Main Calculator Pad */}
        <div className="card">
          <div className="card-header">
            <div className="pill-toggle">
              <button 
                className={`pill-option ${!isScientific ? 'active' : ''}`}
                onClick={() => setIsScientific(false)}
              >
                Standard
              </button>
              <button 
                className={`pill-option ${isScientific ? 'active' : ''}`}
                onClick={() => setIsScientific(true)}
              >
                Scientific
              </button>
            </div>

            {isScientific && (
              <div className="pill-toggle">
                <button 
                  className={`pill-option ${angleMode === 'deg' ? 'active' : ''}`}
                  onClick={() => setAngleMode('deg')}
                >
                  DEG
                </button>
                <button 
                  className={`pill-option ${angleMode === 'rad' ? 'active' : ''}`}
                  onClick={() => setAngleMode('rad')}
                >
                  RAD
                </button>
              </div>
            )}
          </div>

          {/* Calculator Screen */}
          <div className="calc-display-card">
            <div className="calc-expression">{equation || '\u00A0'}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                className="icon-btn" 
                style={{ width: '28px', height: '28px' }} 
                onClick={copyResult} 
                title="Copy result"
              >
                {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
              </button>
              <div className="calc-main-value">{display}</div>
            </div>
          </div>

          {/* Keypad */}
          <div className={`calc-keypad ${isScientific ? 'scientific-expanded' : ''}`}>
            {isScientific && (
              <>
                <button className="calc-btn sci-btn" onClick={() => handleScientific('sin')}>sin</button>
                <button className="calc-btn sci-btn" onClick={() => handleScientific('cos')}>cos</button>
                <button className="calc-btn sci-btn" onClick={() => handleScientific('tan')}>tan</button>
                <button className="calc-btn sci-btn" onClick={() => handleScientific('pi')}>π</button>
                <button className="calc-btn sci-btn" onClick={() => handleScientific('e')}>e</button>

                <button className="calc-btn sci-btn" onClick={() => handleScientific('ln')}>ln</button>
                <button className="calc-btn sci-btn" onClick={() => handleScientific('log')}>log</button>
                <button className="calc-btn sci-btn" onClick={() => handleScientific('sqrt')}>√</button>
                <button className="calc-btn sci-btn" onClick={() => handleScientific('sqr')}>x²</button>
                <button className="calc-btn sci-btn" onClick={() => handleScientific('pow')}>xʸ</button>

                <button className="calc-btn sci-btn" onClick={() => handleScientific('fact')}>n!</button>
                <button className="calc-btn sci-btn" onClick={() => handleScientific('inv')}>1/x</button>
                <button className="calc-btn sci-btn" onClick={() => handleDigit('(')}>(</button>
                <button className="calc-btn sci-btn" onClick={() => handleDigit(')')}>)</button>
              </>
            )}

            {/* Standard Row 1 */}
            <button className="calc-btn danger-btn" onClick={handleClear} title="All Clear">AC</button>
            <button className="calc-btn" onClick={handleBackspace} title="Backspace"><Delete size={18} /></button>
            <button className="calc-btn" onClick={handlePercent}>%</button>
            <button className="calc-btn op-btn" onClick={() => handleOperator('÷')}>÷</button>

            {/* Numbers & Operators */}
            <button className="calc-btn" onClick={() => handleDigit('7')}>7</button>
            <button className="calc-btn" onClick={() => handleDigit('8')}>8</button>
            <button className="calc-btn" onClick={() => handleDigit('9')}>9</button>
            <button className="calc-btn op-btn" onClick={() => handleOperator('×')}>×</button>

            <button className="calc-btn" onClick={() => handleDigit('4')}>4</button>
            <button className="calc-btn" onClick={() => handleDigit('5')}>5</button>
            <button className="calc-btn" onClick={() => handleDigit('6')}>6</button>
            <button className="calc-btn op-btn" onClick={() => handleOperator('-')}>−</button>

            <button className="calc-btn" onClick={() => handleDigit('1')}>1</button>
            <button className="calc-btn" onClick={() => handleDigit('2')}>2</button>
            <button className="calc-btn" onClick={() => handleDigit('3')}>3</button>
            <button className="calc-btn op-btn" onClick={() => handleOperator('+')}>+</button>

            <button className="calc-btn" onClick={handleNegate}>±</button>
            <button className="calc-btn" onClick={() => handleDigit('0')}>0</button>
            <button className="calc-btn" onClick={() => handleDigit('.')}>.</button>
            <button className="calc-btn equals-btn" onClick={handleEquals}>=</button>
          </div>
        </div>

        {/* History Tape Card */}
        <div className="card calc-history-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon">
                <History size={18} />
              </div>
              <div>
                <h2 className="card-title">Calculation History</h2>
                <span className="card-subtitle">{history.length} records</span>
              </div>
            </div>

            {history.length > 0 && (
              <button 
                className="icon-btn" 
                onClick={() => setHistory([])} 
                title="Clear history"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>

          <div className="history-list">
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <p>No calculations yet.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Perform any math or use the keyboard</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id} 
                  className="history-item" 
                  onClick={() => recallHistory(item)}
                  title="Click to load result"
                >
                  <div className="history-exp">{item.equation} =</div>
                  <div className="history-res">{item.result}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
