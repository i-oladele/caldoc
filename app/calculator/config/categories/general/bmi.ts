import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const bmiConfig: CalculatorConfig = {
  id: 'bmi',
  fields: [
    {
      label: 'Weight',
      placeholder: 'Enter weight (kg)',
      unit: 'kg',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Height',
      placeholder: 'Enter height (cm)',
      unit: 'cm',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values['Weight']);
    const height = parseFloat(values['Height']);
    
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be positive';
    }
    if (isNaN(height) || height <= 0) {
      return 'Height must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values['Weight']);
    const height = parseFloat(values['Height']);
    const bmi = weight / ((height / 100) ** 2);
    
    let interpretation = '';
    if (bmi < 18.5) {
      interpretation = 'Underweight';
    } else if (bmi < 25) {
      interpretation = 'Normal weight';
    } else if (bmi < 30) {
      interpretation = 'Overweight';
    } else {
      interpretation = 'Obese';
    }
    
    return {
      result: parseFloat(bmi.toFixed(1)),
      interpretation
    };
  },
  formula: 'BMI = Weight (kg) / Height² (m²)',
  references: [
    'World Health Organization. BMI Classification.',
    'Journal of the American Medical Association. BMI and Mortality.',
    'New England Journal of Medicine. Obesity and Health Outcomes.'
  ],
  resultUnit: ''
};

export default bmiConfig;
