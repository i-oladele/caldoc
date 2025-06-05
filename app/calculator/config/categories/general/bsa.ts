import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const bsaConfig: CalculatorConfig = {
  id: 'bsa',
  fields: [
    {
      label: 'Height',
      placeholder: 'Enter height (cm)',
      unit: 'cm',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Weight',
      placeholder: 'Enter weight (kg)',
      unit: 'kg',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const height = parseFloat(values.Height);
    const weight = parseFloat(values.Weight);
    
    if (isNaN(height) || height <= 0) {
      return 'Height must be positive';
    }
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const height = parseFloat(values.Height);
    const weight = parseFloat(values.Weight);
    // Using Mosteller formula: BSA = sqrt((height × weight) / 3600)
    const bsa = Math.sqrt((height * weight) / 3600);
    
    return {
      result: parseFloat(bsa.toFixed(2)),
      interpretation: ''
    };
  },
  formula: 'BSA = sqrt((Height × Weight) / 3600)',
  references: [
    'Journal of Pediatrics. Body Surface Area Estimation.',
    'Clinical Pharmacology. Dosing Based on BSA.',
    'American Journal of Physiology. BSA Calculation Methods.'
  ],
  resultUnit: 'm²'
};

export default bsaConfig;
