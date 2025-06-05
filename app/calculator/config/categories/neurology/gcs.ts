import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const gcsConfig: CalculatorConfig = {
  id: 'gcs',
  fields: [
    {
      label: 'Eye Opening',
      placeholder: 'Select score (1-4)',
      unit: '',
      keyboardType: 'numeric'
    },
    {
      label: 'Verbal Response',
      placeholder: 'Select score (1-5)',
      unit: '',
      keyboardType: 'numeric'
    },
    {
      label: 'Motor Response',
      placeholder: 'Select score (1-6)',
      unit: '',
      keyboardType: 'numeric'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const eye = parseInt(values['Eye Opening']);
    const verbal = parseInt(values['Verbal Response']);
    const motor = parseInt(values['Motor Response']);
    
    if (isNaN(eye) || eye < 1 || eye > 4) {
      return 'Eye Opening score must be between 1 and 4';
    }
    if (isNaN(verbal) || verbal < 1 || verbal > 5) {
      return 'Verbal Response score must be between 1 and 5';
    }
    if (isNaN(motor) || motor < 1 || motor > 6) {
      return 'Motor Response score must be between 1 and 6';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const eye = parseInt(values['Eye Opening']);
    const verbal = parseInt(values['Verbal Response']);
    const motor = parseInt(values['Motor Response']);
    const score = eye + verbal + motor;
    
    let interpretation = '';
    if (score <= 8) {
      interpretation = 'Severe';
    } else if (score <= 12) {
      interpretation = 'Moderate';
    } else {
      interpretation = 'Mild';
    }
    
    return {
      result: score,
      interpretation
    };
  },
  formula: 'GCS = Eye Opening + Verbal Response + Motor Response',
  references: [
    'Glasgow Coma Scale. Original Paper.',
    'Journal of Neurosurgery. GCS Updates.',
    'Critical Care Medicine. GCS Interpretation.'
  ],
  resultUnit: ''
};

export default gcsConfig;
