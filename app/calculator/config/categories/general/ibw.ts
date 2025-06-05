import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const ibwConfig: CalculatorConfig = {
  id: 'ibw',
  fields: [
    {
      label: 'Height',
      placeholder: 'Enter height (cm)',
      unit: 'cm',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Gender',
      placeholder: 'Select gender',
      unit: '',
      keyboardType: 'default'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const height = parseFloat(values.Height);
    const gender = values.Gender.toLowerCase();
    
    if (isNaN(height) || height <= 0) {
      return 'Height must be positive';
    }
    if (!gender || (gender !== 'male' && gender !== 'female')) {
      return 'Please select a valid gender';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const height = parseFloat(values.Height);
    const gender = values.Gender.toLowerCase();
    
    // Using Devine formula
    let ibw;
    if (gender === 'male') {
      ibw = 50 + 2.3 * ((height - 152.4) / 2.54);
    } else {
      ibw = 45.5 + 2.3 * ((height - 152.4) / 2.54);
    }
    
    return {
      result: parseFloat(ibw.toFixed(1)),
      interpretation: ''
    };
  },
  formula: 'IBW = Base weight + (Height - 152.4 cm) × 2.3 lb/in',
  references: [
    'Clinical Nutrition. Weight Estimation.',
    'American Journal of Clinical Nutrition. IBW Calculation.',
    'Journal of Clinical Medicine. Weight Assessment.'
  ],
  resultUnit: 'kg'
};

export default ibwConfig;
