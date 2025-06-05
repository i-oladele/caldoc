import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const hematocritConfig: CalculatorConfig = {
  id: 'hematocrit',
  fields: [
    {
      label: 'RBC Count',
      placeholder: 'Enter RBC count (x10^12/L)',
      unit: 'x10^12/L',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'MCV',
      placeholder: 'Enter MCV (fL)',
      unit: 'fL',
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
    const rbc = parseFloat(values['RBC Count']);
    const mcv = parseFloat(values.MCV);
    const gender = values.Gender.toLowerCase();
    
    if (isNaN(rbc) || rbc <= 0) {
      return 'RBC count must be positive';
    }
    if (isNaN(mcv) || mcv <= 0) {
      return 'MCV must be positive';
    }
    if (!gender || (gender !== 'male' && gender !== 'female')) {
      return 'Please select a valid gender';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const rbc = parseFloat(values['RBC Count']);
    const mcv = parseFloat(values.MCV);
    const gender = values.Gender.toLowerCase();
    const hematocrit = (rbc * mcv) / 10;
    
    let interpretation = '';
    if (gender === 'male') {
      if (hematocrit < 40) {
        interpretation = 'Low Hematocrit';
      } else if (hematocrit <= 52) {
        interpretation = 'Normal Hematocrit';
      } else {
        interpretation = 'High Hematocrit';
      }
    } else {
      if (hematocrit < 36) {
        interpretation = 'Low Hematocrit';
      } else if (hematocrit <= 48) {
        interpretation = 'Normal Hematocrit';
      } else {
        interpretation = 'High Hematocrit';
      }
    }
    
    return {
      result: parseFloat(hematocrit.toFixed(1)),
      interpretation
    };
  },
  formula: 'Hematocrit (%) = (RBC × MCV) / 10',
  references: [
    'American Journal of Hematology. Interpretation of the Complete Blood Count.',
    'Blood. Evaluation of Anemia.',
    'New England Journal of Medicine. Approach to Anemia.'
  ],
  resultUnit: '%'  // Added missing unit
};

export default hematocritConfig;
