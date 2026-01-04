import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const hematocritConfig: CalculatorConfig = {
  id: 'hematocrit',
  name: 'Hematocrit',
  description: 'Calculate hematocrit level from RBC count and MCV, with gender-specific reference ranges.',
  category: 'Hematology',
  fields: [
    {
      label: 'RBC Count',
      placeholder: 'Enter RBC count (x10¹²/L)',
      unit: 'x10¹²/L',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'MCV',
      placeholder: 'Enter MCV (fL)',
      unit: 'fL',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ],
      required: true,
      placeholder: 'Select gender'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const rbc = parseFloat(values['RBC Count']);
    const mcv = parseFloat(values.MCV);
    const gender = values.gender;
    
    if (isNaN(rbc) || rbc <= 0) {
      return 'RBC count must be positive';
    }
    if (isNaN(mcv) || mcv <= 0) {
      return 'MCV must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const rbc = parseFloat(values['RBC Count']);
    const mcv = parseFloat(values.MCV);
    const gender = values.gender;
    const hematocrit = (rbc * mcv) / 10;
    
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (gender === 'male') {
      if (hematocrit < 36) {
        interpretation = 'Severely Low';
        status = 'danger';
      } else if (hematocrit < 40) {
        interpretation = 'Mildly Low';
        status = 'warning';
      } else if (hematocrit <= 52) {
        interpretation = 'Normal';
        status = 'success';
      } else if (hematocrit <= 56) {
        interpretation = 'Mildly High';
        status = 'warning';
      } else {
        interpretation = 'Severely High';
        status = 'danger';
      }
    } else {
      if (hematocrit < 32) {
        interpretation = 'Severely Low';
        status = 'danger';
      } else if (hematocrit < 36) {
        interpretation = 'Mildly Low';
        status = 'warning';
      } else if (hematocrit <= 48) {
        interpretation = 'Normal';
        status = 'success';
      } else if (hematocrit <= 52) {
        interpretation = 'Mildly High';
        status = 'warning';
      } else {
        interpretation = 'Severely High';
        status = 'danger';
      }
    }
    
    // Get reference ranges based on gender
    const normalRange = gender === 'male' ? '40-52%' : '36-48%';
    
    return {
      result: hematocrit,
      status,
      resultUnit: '%',
      interpretation: `Hematocrit: ${hematocrit.toFixed(1)}% (${interpretation})`,
      resultDetails: [
        { label: 'RBC Count', value: `${rbc.toFixed(2)} x10¹²/L`, status: 'info' },
        { label: 'MCV', value: `${mcv.toFixed(1)} fL`, status: 'info' },
        { label: 'Gender', value: gender.charAt(0).toUpperCase() + gender.slice(1), status: 'info' },
        { 
          label: 'Hematocrit', 
          value: `${hematocrit.toFixed(1)}%`, 
          status,
          description: `Normal range (${gender}): ${normalRange}`
        },
        { 
          label: 'Interpretation', 
          value: interpretation,
          status
        }
      ]
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
