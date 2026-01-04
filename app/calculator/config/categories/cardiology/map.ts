import { CalculationStatus, CalculatorConfig, CalculatorValues } from '@/app/calculator/config/calculator';

export const mapConfig: CalculatorConfig = {
  id: 'map',
  name: 'Mean Arterial Pressure (MAP)',
  description: 'Calculates the average arterial pressure throughout one cardiac cycle, used to assess blood flow and organ perfusion.',
  category: 'Cardiology',
  fields: [
    {
      id: 'systolic',
      label: 'Systolic Blood Pressure',
      placeholder: 'Enter systolic BP (mmHg)',
      unit: 'mmHg',
      type: 'number',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'diastolic',
      label: 'Diastolic Blood Pressure',
      placeholder: 'Enter diastolic BP (mmHg)',
      unit: 'mmHg',
      type: 'number',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: CalculatorValues) => {
    const systolic = parseFloat(values.systolic as string);
    const diastolic = parseFloat(values.diastolic as string);
    
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
  calculate: (values: CalculatorValues): { result: number; interpretation: string; status: CalculationStatus } => {
    const systolic = parseFloat(values.systolic as string);
    const diastolic = parseFloat(values.diastolic as string);
    const map = (systolic + (2 * diastolic)) / 3;
    
    let interpretation = '';
    let status: CalculationStatus = 'success';
    
    if (map < 65) {
      interpretation = 'Hypotension (Critical - Requires immediate attention)';
      status = 'danger';
    } else if (map < 70) {
      interpretation = 'Borderline Low MAP (Monitor closely)';
      status = 'warning';
    } else if (map <= 100) {
      interpretation = 'Normal MAP (Adequate organ perfusion)';
      status = 'success';
    } else if (map <= 110) {
      interpretation = 'Borderline High MAP (Monitor blood pressure)';
      status = 'warning';
    } else {
      interpretation = 'Severely High MAP (Risk of organ damage)';
      status = 'danger';
    }
    
    return {
      result: parseFloat(map.toFixed(2)),
      interpretation,
      status
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
