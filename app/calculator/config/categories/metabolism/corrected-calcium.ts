import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const correctedCalciumConfig: CalculatorConfig = {
  id: 'corrected-calcium',
  name: 'Corrected Calcium',
  description: 'Calculates the corrected total calcium level based on albumin levels',
  category: 'metabolism',
  fields: [
    {
      id: 'totalCalcium',
      type: 'number',
      label: 'Total Calcium',
      placeholder: 'Enter total calcium (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'albumin',
      type: 'number',
      label: 'Albumin',
      placeholder: 'Enter albumin (g/dL)',
      unit: 'g/dL',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {};
    const totalCalcium = parseFloat(values['totalCalcium']);
    const albumin = parseFloat(values.albumin);
    
    if (isNaN(totalCalcium) || totalCalcium <= 0) {
      errors.totalCalcium = 'Total calcium must be positive';
    }
    if (isNaN(albumin) || albumin <= 0) {
      errors.albumin = 'Albumin must be positive';
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string }) => {
    const totalCalcium = parseFloat(values['Total Calcium']);
    const albumin = parseFloat(values.Albumin);
    const correctedCalcium = totalCalcium + 0.8 * (4 - albumin);
    
    let interpretation = '';
    if (correctedCalcium < 8.5) {
      interpretation = 'Hypocalcemia';
    } else if (correctedCalcium <= 10.5) {
      interpretation = 'Normal calcium level';
    } else {
      interpretation = 'Hypercalcemia';
    }
    
    return {
      result: parseFloat(correctedCalcium.toFixed(1)),
      interpretation
    };
  },
  formula: 'Corrected Calcium = Total Calcium + 0.8 × (4 - Albumin)',
  references: [
    'Clinical Chemistry. Interpretation of Calcium Levels.',
    'American Journal of Medicine. Assessment of Calcium Disorders.',
    'Journal of Clinical Endocrinology & Metabolism. Calcium Homeostasis.'
  ],
  resultUnit: 'mg/dL'
};

export default correctedCalciumConfig;
