import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const alveolarGasConfig: CalculatorConfig = {
  id: 'alveolar-gas',
  name: 'Alveolar Gas Equation',
  description: 'Calculates the alveolar oxygen tension (PAO2) using the alveolar gas equation',
  category: 'respiratory',
  fields: [
    {
      id: 'paco2',
      type: 'number',
      label: 'Arterial CO2 Pressure (PaCO2)',
      placeholder: 'Enter arterial CO2 pressure (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'fio2',
      type: 'number',
      label: 'Inspired Oxygen Fraction (FiO2)',
      placeholder: 'Enter inspired oxygen fraction (decimal)',
      unit: '',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'pb',
      type: 'number',
      label: 'Barometric Pressure(Pb)',
      placeholder: 'Enter barometric pressure (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'r',
      type: 'number',
      label: 'Respiratory Quotient (R)',
      placeholder: 'Enter respiratory quotient (default 0.8)',
      unit: '',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string | boolean }) => {
    const errors: { [key: string]: string } = {};
    const paco2 = parseFloat(values.paco2 as string);
    const fio2 = parseFloat(values.fio2 as string);
    const pb = parseFloat(values.pb as string);
    // Use default of 0.8 if R is not provided or empty
    const r = values.r === '' || values.r === undefined || values.r === null ? 0.8 : parseFloat(values.r as string);
    
    if (isNaN(paco2) || paco2 <= 0) {
      errors.paco2 = 'PaCO2 must be positive';
    }
    if (isNaN(fio2) || fio2 <= 0 || fio2 > 1) {
      errors.fio2 = 'FiO2 must be between 0 and 1';
    }
    if (isNaN(pb) || pb <= 0) {
      errors.pb = 'Barometric pressure must be positive';
    }
    if (isNaN(r) || r <= 0) {
      errors.r = 'Respiratory quotient must be positive';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string | boolean }) => {
    const paco2 = parseFloat(values.paco2 as string);
    const fio2 = parseFloat(values.fio2 as string);
    const pb = parseFloat(values.pb as string);
    // Use default of 0.8 if R is not provided or empty
    const r = values.r === '' || values.r === undefined || values.r === null ? 0.8 : parseFloat(values.r as string);
    
    // Calculate alveolar oxygen pressure
    const paO2 = (fio2 * (pb - 47)) - (1.25 * paco2);
    
    let interpretation = '';
    let status: 'danger' | 'warning' | 'success' = 'success';
    
    if (paO2 < 60) {
      interpretation = 'Hypoxemia - Consider oxygen therapy and evaluate for respiratory failure';
      status = 'danger';
    } else if (paO2 < 75) {
      interpretation = 'Mild hypoxemia - Monitor closely';
      status = 'warning';
    } else if (paO2 <= 100) {
      interpretation = 'Normal oxygenation';
      status = 'success';
    } else if (paO2 <= 150) {
      interpretation = 'Mild hyperoxemia - Consider reducing FiO2 if possible';
      status = 'warning';
    } else {
      interpretation = 'Significant hyperoxemia - Consider reducing FiO2';
      status = 'danger';
    }
    
    return {
      result: parseFloat(paO2.toFixed(1)),
      interpretation,
      status
    };
  },
  formula: `Alveolar Gas Equation:
  
  PAO₂ = (FiO₂ × (Pb - PH₂O)) - (PaCO₂ / R)
  
  Where:
  - PAO₂ = Alveolar oxygen tension (mmHg)
  - FiO₂ = Fraction of inspired oxygen (0.21 for room air)
  - Pb = Barometric pressure (mmHg)
  - PH₂O = Water vapor pressure (47 mmHg at 37°C)
  - PaCO₂ = Arterial carbon dioxide tension (mmHg)
  - R = Respiratory quotient (typically 0.8)
  
  Simplified form:
  PAO₂ = (FiO₂ × (Pb - 47)) - (1.25 × PaCO₂)`,
  
  // Original formula for reference
  // PAO2 = (FiO2 × (Pb - 47)) - (1.25 × PaCO2)
  references: [
    'American Journal of Respiratory and Critical Care Medicine. Gas Exchange.',
    'Critical Care Medicine. Respiratory Physiology.',
    'Journal of Applied Physiology. Alveolar Gas Equation.'
  ],
  resultUnit: 'mmHg'
};

export default alveolarGasConfig;
