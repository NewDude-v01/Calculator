// Comprehensive Unit Definitions and Conversion Engine

export const UNIT_CATEGORIES = {
  length: {
    id: 'length',
    name: 'Length & Distance',
    icon: 'Ruler',
    baseUnit: 'm',
    units: {
      m: { name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      km: { name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cm: { name: 'Centimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      mm: { name: 'Millimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mi: { name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      yd: { name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      ft: { name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      in: { name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      nmi: { name: 'Nautical Mile', symbol: 'NM', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 }
    },
    defaultFrom: 'm',
    defaultTo: 'ft'
  },
  mass: {
    id: 'mass',
    name: 'Mass & Weight',
    icon: 'Scale',
    baseUnit: 'kg',
    units: {
      kg: { name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      g: { name: 'Gram', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mg: { name: 'Milligram', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      t: { name: 'Metric Ton', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      lb: { name: 'Pound', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      oz: { name: 'Ounce', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
      st: { name: 'Stone', symbol: 'st', toBase: (v) => v * 6.35029318, fromBase: (v) => v / 6.35029318 }
    },
    defaultFrom: 'kg',
    defaultTo: 'lb'
  },
  temperature: {
    id: 'temperature',
    name: 'Temperature',
    icon: 'Thermometer',
    baseUnit: 'C',
    units: {
      C: { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      F: { name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => (v * 9) / 5 + 32 },
      K: { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 }
    },
    defaultFrom: 'C',
    defaultTo: 'F'
  },
  speed: {
    id: 'speed',
    name: 'Speed & Velocity',
    icon: 'Gauge',
    baseUnit: 'mps',
    units: {
      mps: { name: 'Meters per sec', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      kph: { name: 'Kilometers per hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      mph: { name: 'Miles per hour', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      knot: { name: 'Knot', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      fps: { name: 'Feet per second', symbol: 'ft/s', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 }
    },
    defaultFrom: 'kph',
    defaultTo: 'mph'
  },
  area: {
    id: 'area',
    name: 'Area',
    icon: 'Grid',
    baseUnit: 'sqm',
    units: {
      sqm: { name: 'Square Meter', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      sqkm: { name: 'Square Kilometer', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      sqft: { name: 'Square Foot', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      sqyd: { name: 'Square Yard', symbol: 'yd²', toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
      acre: { name: 'Acre', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 },
      ha: { name: 'Hectare', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 }
    },
    defaultFrom: 'sqm',
    defaultTo: 'sqft'
  },
  volume: {
    id: 'volume',
    name: 'Volume & Capacity',
    icon: 'Beaker',
    baseUnit: 'l',
    units: {
      l: { name: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      ml: { name: 'Milliliter', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      cum: { name: 'Cubic Meter', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      gal: { name: 'Gallon (US)', symbol: 'gal', toBase: (v) => v * 3.785411784, fromBase: (v) => v / 3.785411784 },
      qt: { name: 'Quart (US)', symbol: 'qt', toBase: (v) => v * 0.946352946, fromBase: (v) => v / 0.946352946 },
      pt: { name: 'Pint (US)', symbol: 'pt', toBase: (v) => v * 0.473176473, fromBase: (v) => v / 0.473176473 },
      cup: { name: 'Cup (US)', symbol: 'cup', toBase: (v) => v * 0.2365882365, fromBase: (v) => v / 0.2365882365 },
      floz: { name: 'Fluid Ounce (US)', symbol: 'fl oz', toBase: (v) => v * 0.0295735295625, fromBase: (v) => v / 0.0295735295625 }
    },
    defaultFrom: 'l',
    defaultTo: 'gal'
  },
  digital: {
    id: 'digital',
    name: 'Digital Data',
    icon: 'HardDrive',
    baseUnit: 'b',
    units: {
      b: { name: 'Byte', symbol: 'B', toBase: (v) => v, fromBase: (v) => v },
      kb: { name: 'Kilobyte', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      mb: { name: 'Megabyte', symbol: 'MB', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      gb: { name: 'Gigabyte', symbol: 'GB', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      tb: { name: 'Terabyte', symbol: 'TB', toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
      pb: { name: 'Petabyte', symbol: 'PB', toBase: (v) => v * 1125899906842624, fromBase: (v) => v / 1125899906842624 }
    },
    defaultFrom: 'gb',
    defaultTo: 'mb'
  },
  time: {
    id: 'time',
    name: 'Time',
    icon: 'Clock',
    baseUnit: 's',
    units: {
      ms: { name: 'Millisecond', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      s: { name: 'Second', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      min: { name: 'Minute', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      h: { name: 'Hour', symbol: 'hr', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      d: { name: 'Day', symbol: 'day', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      wk: { name: 'Week', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      mo: { name: 'Month (avg)', symbol: 'mo', toBase: (v) => v * 2629746, fromBase: (v) => v / 2629746 },
      yr: { name: 'Year (365d)', symbol: 'yr', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 }
    },
    defaultFrom: 'h',
    defaultTo: 'min'
  }
};

export function convertUnit(val, categoryId, fromUnit, toUnit) {
  if (val === '' || isNaN(val)) return '';
  const num = parseFloat(val);
  if (isNaN(num)) return '';
  
  const cat = UNIT_CATEGORIES[categoryId];
  if (!cat) return '';
  
  const from = cat.units[fromUnit];
  const to = cat.units[toUnit];
  if (!from || !to) return '';
  
  if (fromUnit === toUnit) return num;
  
  const baseValue = from.toBase(num);
  const result = to.fromBase(baseValue);
  
  return result;
}

export function formatResultNumber(num) {
  if (num === '' || num === null || num === undefined || isNaN(num)) return '';
  const val = Number(num);
  if (Math.abs(val) >= 1e9 || (Math.abs(val) > 0 && Math.abs(val) < 1e-5)) {
    return val.toExponential(4);
  }
  // Trim trailing zeros after precision
  return parseFloat(val.toFixed(6)).toString();
}
