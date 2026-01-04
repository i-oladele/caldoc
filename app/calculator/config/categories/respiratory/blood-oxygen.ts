import { CalculationStatus, CalculatorConfig, CalculatorValues } from '@/app/calculator/config/calculator';

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
  calculate: (values: CalculatorValues) => {
    // Safely parse values, defaulting to 0 if not present or invalid
    const hgb = typeof values.hemoglobin === 'string' ? parseFloat(values.hemoglobin) || 0 : 0;
    const sao2 = typeof values.saturation === 'string' ? parseFloat(values.saturation) || 0 : 0; // Keep as percentage for interpretation
    const pao2 = typeof values.pao2 === 'string' ? parseFloat(values.pao2) || 0 : 0;
    
    // Oxygen content equation: (1.34 * Hgb * SaO2) + (0.003 * PaO2)
    const oxygenContent = (1.34 * hgb * (sao2 / 100)) + (0.003 * pao2);
    
    // Determine status and interpretation based on oxygen content
    let status: CalculationStatus = 'success';
    let interpretation = '';
    
    if (oxygenContent < 16) {
      status = 'danger';
      interpretation = 'Low oxygen content - Consider oxygen supplementation';
    } else if (oxygenContent <= 20) {
      status = 'success';
      interpretation = 'Normal oxygen content - Adequate oxygenation';
    } else {
      status = 'warning';
      interpretation = 'High oxygen content - Monitor for oxygen toxicity';
    }
    
    // Add SpO2 interpretation as additional information
    const spo2Interpretation = sao2 < 90 
      ? 'Severe hypoxemia - Requires immediate attention' 
      : sao2 < 92 
        ? 'Mild to moderate hypoxemia - Consider oxygen' 
        : sao2 > 98 
          ? 'High oxygen saturation - Monitor for O₂ toxicity' 
          : 'Normal oxygen saturation';
    
    return {
      result: oxygenContent,
      interpretation: `${interpretation}\n${spo2Interpretation} (SpO₂: ${sao2}%)`,
      status
    };
  },
  formula: 'Oxygen Content (mL/dL) = (1.34 × Hgb × SaO₂) + (0.003 × PaO₂)\n\n' +
  'Interpretation by Oxygen Content:\n' +
  '• <16 mL/dL: Low (Red) - Consider oxygen supplementation\n' +
  '• 16-20 mL/dL: Normal (Green) - Adequate oxygenation\n' +
  '• >20 mL/dL: High (Yellow) - Monitor for O₂ toxicity\n\n' +
  'SpO₂ Reference Ranges:\n' +
  '• <90%: Severe hypoxemia\n' +
  '• 90-91%: Mild to moderate hypoxemia\n' +
  '• 92-98%: Normal range\n' +
  '• >98%: High saturation',
  references: [
    'West JB. Respiratory Physiology: The Essentials. 9th ed. Philadelphia, PA: Lippincott Williams & Wilkins; 2011.',
    'Levitzky MG. Pulmonary Physiology. 8th ed. New York, NY: McGraw-Hill Education; 2013.',
    'Nunn\'s Applied Respiratory Physiology. 8th ed. Edinburgh: Churchill Livingstone; 2016.'
  ]
};
