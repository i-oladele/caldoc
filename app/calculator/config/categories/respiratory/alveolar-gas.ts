import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const alveolarGasConfig: CalculatorConfig = {
  id: 'alveolar-gas',
  fields: [
    {
      label: 'PaCO2',
      placeholder: 'Enter arterial CO2 pressure (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'FiO2',
      placeholder: 'Enter inspired oxygen fraction (decimal)',
      unit: '',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Pb',
      placeholder: 'Enter barometric pressure (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'R',
      placeholder: 'Enter respiratory quotient (default 0.8)',
      unit: '',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const paco2 = parseFloat(values.PaCO2);
    const fio2 = parseFloat(values.FiO2);
    const pb = parseFloat(values.Pb);
    const r = parseFloat(values.R);
    
    if (isNaN(paco2) || paco2 <= 0) {
      return 'PaCO2 must be positive';
    }
    if (isNaN(fio2) || fio2 <= 0 || fio2 > 1) {
      return 'FiO2 must be between 0 and 1';
    }
    if (isNaN(pb) || pb <= 0) {
      return 'Barometric pressure must be positive';
    }
    if (isNaN(r) || r <= 0) {
      return 'Respiratory quotient must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const paco2 = parseFloat(values.PaCO2);
    const fio2 = parseFloat(values.FiO2);
    const pb = parseFloat(values.Pb);
    const r = parseFloat(values.R);
    
    // Calculate alveolar oxygen pressure
    const paO2 = (fio2 * (pb - 47)) - (1.25 * paco2);
    
    let interpretation = '';
    if (paO2 < 60) {
      interpretation = 'Hypoxemia';
    } else if (paO2 <= 100) {
      interpretation = 'Normal oxygenation';
    } else {
      interpretation = 'Hyperoxemia';
    }
    
    return {
      result: parseFloat(paO2.toFixed(1)),
      interpretation
    };
  },
  formula: 'PAO2 = (FiO2 × (Pb - 47)) - (1.25 × PaCO2)',
  references: [
    'American Journal of Respiratory and Critical Care Medicine. Gas Exchange.',
    'Critical Care Medicine. Respiratory Physiology.',
    'Journal of Applied Physiology. Alveolar Gas Equation.'
  ],
  resultUnit: 'mmHg'
};

export default alveolarGasConfig;
