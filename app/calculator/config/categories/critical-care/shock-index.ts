import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const shockIndexConfig: CalculatorConfig = {
  id: 'shock-index',
  name: 'Shock Index',
  description: 'Calculates the Shock Index (heart rate divided by systolic blood pressure) to assess the severity of shock.',
  category: 'Critical Care',
  fields: [
    {
      id: 'heartRate',
      type: 'number',
      label: 'Heart Rate',
      placeholder: 'Enter heart rate (bpm)',
      unit: 'bpm'
    },
    {
      id: 'systolicBP',
      type: 'number',
      label: 'Systolic Blood Pressure',
      placeholder: 'Enter systolic blood pressure (mmHg)',
      unit: 'mmHg'
    }
  ],
  validate: (values: Record<string, string | boolean>) => {
    const hr = parseFloat(values['heartRate'] as string);
    const sbp = parseFloat(values['systolicBP'] as string);
    const errors: Record<string, string> = {};
    
    if (isNaN(hr) || hr <= 0) {
      errors['heartRate'] = 'Heart rate must be positive';
    }
    if (isNaN(sbp) || sbp <= 0) {
      errors['systolicBP'] = 'Systolic blood pressure must be positive';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: Record<string, string | boolean>) => {
    const hr = parseFloat(values['heartRate'] as string);
    const sbp = parseFloat(values['systolicBP'] as string);
    const shockIndex = hr / sbp;
    
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (shockIndex < 0.5) {
      interpretation = 'Low Shock Index (Normal)';
      status = 'success';  // Green for normal
    } else if (shockIndex <= 0.7) {
      interpretation = 'Moderate Shock Index (Mild Shock)';
      status = 'warning';  // Yellow for borderline
    } else {
      interpretation = 'High Shock Index (Severe Shock)';
      status = 'danger';   // Red for severe
    }
    
    return {
      result: parseFloat(shockIndex.toFixed(2)),
      interpretation,
      status
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
