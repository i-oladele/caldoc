import { CalculatorConfig, CalculatorValues } from '@/app/calculator/config/calculator';

export const bmiConfig: CalculatorConfig = {
  id: 'bmi',
  name: 'Body Mass Index (BMI)',
  description: 'Calculates BMI based on weight and height to assess body fat.',
  category: 'general',
  resultUnit: 'kg/m²',
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
  validate: (values: CalculatorValues) => {
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
  calculate: (values: CalculatorValues) => {
    const weight = parseFloat(values['Weight']);
    const height = parseFloat(values['Height']);
    const bmi = weight / ((height / 100) ** 2);
    
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (bmi < 18.5) {
      interpretation = 'Underweight';
      status = 'warning';  // Yellow for underweight
    } else if (bmi < 23) {  // Normal range (18.5 - 22.9)
      interpretation = 'Normal weight';
      status = 'success';  // Green for normal
    } else if (bmi < 25) {  // Borderline (23 - 24.9)
      interpretation = 'Overweight (Borderline)';
      status = 'warning';  // Yellow for borderline
    } else if (bmi < 30) {  // Overweight (25 - 29.9)
      interpretation = 'Overweight';
      status = 'danger';   // Red for overweight
    } else {  // Obese (30+)
      interpretation = 'Obese';
      status = 'danger';   // Red for obese
    }
    
    return {
      result: bmi,
      interpretation,
      status,
      resultUnit: 'kg/m²'
    };
  },
  formula: 'BMI = Weight (kg) / Height² (m²)',
  references: [
    'World Health Organization. BMI Classification.',
    'Journal of the American Medical Association. BMI and Mortality.',
    'New England Journal of Medicine. Obesity and Health Outcomes.'
  ]
};

export default bmiConfig;
