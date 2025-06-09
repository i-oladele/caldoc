import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const alveolarGasConfig: CalculatorConfig = {
  id: 'alveolar-gas',
  name: 'Alveolar Gas Equation',
  description: 'Calculates the alveolar oxygen tension (PAO2) using the alveolar gas equation',
  category: 'respiratory',
  fields: [
    {
      id: 'paco2',
      type: 'number',
      label: 'PaCO2',
      placeholder: 'Enter arterial CO2 pressure (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'fio2',
      type: 'number',
      label: 'FiO2',
      placeholder: 'Enter inspired oxygen fraction (decimal)',
      unit: '',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'pb',
      type: 'number',
      label: 'Pb',
      placeholder: 'Enter barometric pressure (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'r',
      type: 'number',
      label: 'R',
      placeholder: 'Enter respiratory quotient (default 0.8)',
      unit: '',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {};
    const paco2 = parseFloat(values.PaCO2);
    const fio2 = parseFloat(values.FiO2);
    const pb = parseFloat(values.Pb);
    const r = parseFloat(values.R);
    
    if (isNaN(paco2) || paco2 <= 0) {
      errors.PaCO2 = 'PaCO2 must be positive';
    }
    if (isNaN(fio2) || fio2 <= 0 || fio2 > 1) {
      errors.FiO2 = 'FiO2 must be between 0 and 1';
    }
    if (isNaN(pb) || pb <= 0) {
      errors.Pb = 'Barometric pressure must be positive';
    }
    if (isNaN(r) || r <= 0) {
      errors.R = 'Respiratory quotient must be positive';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
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
