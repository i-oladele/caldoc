import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const bloodOxygenConfig: CalculatorConfig = {
  id: 'blood-oxygen',
  name: 'Oxygen Content of Blood',
  description: 'Calculates total oxygen carried in blood by hemoglobin and dissolved oxygen.',
  category: 'Respiratory',
  resultUnit: 'mL/dL',
  fields: [
    {
      id: 'hemoglobin',
      type: 'number',
      label: 'Hemoglobin',
      placeholder: 'Enter hemoglobin level',
      unit: 'g/dL',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'saturation',
      type: 'number',
      label: 'Oxygen Saturation',
      placeholder: 'Enter oxygen saturation',
      unit: '%',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'pao2',
      type: 'number',
      label: 'PaO₂',
      placeholder: 'Enter partial pressure of oxygen',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {};
    
    if (!values.hemoglobin) {
      errors.hemoglobin = 'Hemoglobin is required';
    } else if (isNaN(Number(values.hemoglobin)) || Number(values.hemoglobin) <= 0) {
      errors.hemoglobin = 'Hemoglobin must be a positive number';
    }
    
    if (!values.saturation) {
      errors.saturation = 'Oxygen saturation is required';
    } else {
      const sat = Number(values.saturation);
      if (isNaN(sat) || sat < 0 || sat > 100) {
        errors.saturation = 'Oxygen saturation must be between 0 and 100';
      }
    }
    
    if (!values.pao2) {
      errors.pao2 = 'PaO₂ is required';
    } else if (isNaN(Number(values.pao2)) || Number(values.pao2) < 0) {
      errors.pao2 = 'PaO₂ must be a non-negative number';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string }) => {
    const hgb = parseFloat(values.hemoglobin);
    const sao2 = parseFloat(values.saturation) / 100; // Convert percentage to decimal
    const pao2 = parseFloat(values.pao2);
    
    // Oxygen content equation: (1.34 * Hgb * SaO2) + (0.003 * PaO2)
    const oxygenContent = (1.34 * hgb * sao2) + (0.003 * pao2);
    
    return {
      result: oxygenContent,
      interpretation: oxygenContent < 16 
        ? 'Low oxygen content - consider oxygen supplementation' 
        : oxygenContent > 20 
          ? 'High oxygen content - monitor for oxygen toxicity' 
          : 'Normal oxygen content'
    };
  },
  formula: 'Oxygen Content (mL/dL) = (1.34 × Hgb × SaO₂) + (0.003 × PaO₂)',
  references: [
    'West JB. Respiratory Physiology: The Essentials. 9th ed. Philadelphia, PA: Lippincott Williams & Wilkins; 2011.',
    'Levitzky MG. Pulmonary Physiology. 8th ed. New York, NY: McGraw-Hill Education; 2013.',
    'Nunn\'s Applied Respiratory Physiology. 8th ed. Edinburgh: Churchill Livingstone; 2016.'
  ]
};
