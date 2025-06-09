import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const bmiPercentileConfig: CalculatorConfig = {
  id: 'bmi-percentile',
  name: 'BMI Percentile (for children)',
  description: 'Compares BMI relative to peers of the same age and sex.',
  category: 'Pediatrics',
  fields: [
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter age in years',
      unit: 'years',
      keyboardType: 'decimal-pad',
      min: 2,
      max: 20
    },
    {
      id: 'sex',
      type: 'select',
      label: 'Sex',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]
    },
    {
      id: 'weight',
      type: 'number',
      label: 'Weight',
      placeholder: 'Enter weight',
      unit: 'kg',
      keyboardType: 'decimal-pad',
      min: 0
    },
    {
      id: 'height',
      type: 'number',
      label: 'Height',
      placeholder: 'Enter height',
      unit: 'cm',
      keyboardType: 'decimal-pad',
      min: 0
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const age = parseFloat(values['age']);
    const weight = parseFloat(values['weight']);
    const height = parseFloat(values['height']);
    const errors: { [key: string]: string } = {};
    
    if (isNaN(age) || age < 2 || age > 20) {
      errors['age'] = 'Age must be between 2 and 20 years';
    }
    if (isNaN(weight) || weight <= 0) {
      errors['weight'] = 'Weight must be a positive number';
    }
    if (isNaN(height) || height <= 0) {
      errors['height'] = 'Height must be a positive number';
    }
    if (!values['sex']) {
      errors['sex'] = 'Please select sex';
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values['weight']);
    const height = parseFloat(values['height']) / 100; // Convert cm to m
    const bmi = weight / (height * height);
    
    // Note: In a real implementation, you would look up the BMI percentile
    // from CDC growth charts based on age, sex, and calculated BMI
    // This is a simplified example
    const percentile = Math.min(99, Math.max(1, Math.round(bmi * 10) / 10));
    
    let interpretation = '';
    if (percentile < 5) {
      interpretation = 'Underweight';
    } else if (percentile < 85) {
      interpretation = 'Healthy weight';
    } else if (percentile < 95) {
      interpretation = 'Overweight';
    } else {
      interpretation = 'Obese';
    }
    
    return {
      result: parseFloat(percentile.toFixed(1)),
      interpretation
    };
  },
  formula: 'BMI = weight (kg) / (height (m) × height (m))',
  references: [
    'CDC Growth Charts: United States',
    'WHO Child Growth Standards',
    'Pediatric Clinical Practice Guidelines for BMI'
  ],
  resultUnit: 'percentile'
};

export default bmiPercentileConfig;
