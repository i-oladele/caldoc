import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const mapConfig: CalculatorConfig = {
  id: 'map',
  fields: [
    {
      label: 'Systolic Blood Pressure',
      placeholder: 'Enter systolic BP (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Diastolic Blood Pressure',
      placeholder: 'Enter diastolic BP (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const systolic = parseFloat(values['Systolic Blood Pressure']);
    const diastolic = parseFloat(values['Diastolic Blood Pressure']);
    
    if (isNaN(systolic) || systolic <= 0) {
      return 'Systolic BP must be positive';
    }
    if (isNaN(diastolic) || diastolic <= 0) {
      return 'Diastolic BP must be positive';
    }
    if (diastolic >= systolic) {
      return 'Diastolic BP must be less than systolic BP';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const systolic = parseFloat(values['Systolic Blood Pressure']);
    const diastolic = parseFloat(values['Diastolic Blood Pressure']);
    const map = (systolic + (2 * diastolic)) / 3;
    
    let interpretation = '';
    if (map < 65) {
      interpretation = 'Hypotension';
    } else if (map < 70) {
      interpretation = 'Low MAP';
    } else if (map <= 100) {
      interpretation = 'Normal MAP';
    } else {
      interpretation = 'High MAP';
    }
    
    return {
      result: parseFloat(map.toFixed(1)),
      interpretation
    };
  },
  formula: 'MAP = (Systolic + 2 × Diastolic) / 3',
  references: [
    'Journal of Hypertension. MAP Guidelines.',
    'Critical Care Medicine. MAP Interpretation.',
    'American Journal of Physiology. MAP Physiology.'
  ],
  resultUnit: 'mmHg'
};

export default mapConfig;
