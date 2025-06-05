import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const shockIndexConfig: CalculatorConfig = {
  id: 'shock-index',
  fields: [
    {
      label: 'Heart Rate',
      placeholder: 'Enter heart rate (bpm)',
      unit: 'bpm',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Systolic Blood Pressure',
      placeholder: 'Enter systolic blood pressure (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const hr = parseFloat(values['Heart Rate']);
    const sbp = parseFloat(values['Systolic Blood Pressure']);
    
    if (isNaN(hr) || hr <= 0) {
      return 'Heart rate must be positive';
    }
    if (isNaN(sbp) || sbp <= 0) {
      return 'Systolic blood pressure must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const hr = parseFloat(values['Heart Rate']);
    const sbp = parseFloat(values['Systolic Blood Pressure']);
    const shockIndex = hr / sbp;
    
    let interpretation = '';
    if (shockIndex < 0.5) {
      interpretation = 'Low Shock Index (Normal)';
    } else if (shockIndex <= 0.7) {
      interpretation = 'Moderate Shock Index (Mild Shock)';
    } else {
      interpretation = 'High Shock Index (Severe Shock)';
    }
    
    return {
      result: parseFloat(shockIndex.toFixed(2)),
      interpretation
    };
  },
  formula: 'Shock Index = Heart Rate / Systolic Blood Pressure',
  references: [
    'Critical Care Medicine. Shock Assessment.',
    'American Journal of Emergency Medicine. Shock Index.',
    'Journal of Trauma. Hemodynamic Monitoring.'
  ],
  resultUnit: ''
};

export default shockIndexConfig;
