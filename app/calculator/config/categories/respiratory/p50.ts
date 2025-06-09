import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const p50Config: CalculatorConfig = {
  id: 'p50',
  name: 'P50 Oxygen Saturation',
  description: 'Measures hemoglobin\'s oxygen affinity.',
  category: 'Respiratory',
  fields: [
    // Required inputs
    {
      id: 'pao2',
      type: 'number',
      label: 'PaO₂',
      placeholder: 'Enter partial pressure of oxygen (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad',
      min: 0,
      step: 0.1
    },
    {
      id: 'sao2',
      type: 'number',
      label: 'SaO₂',
      placeholder: 'Enter oxygen saturation (%)',
      unit: '%',
      keyboardType: 'decimal-pad',
      min: 0,
      max: 100,
      step: 0.1
    },
    // Optional inputs for enhanced calculation
    {
      id: 'ph',
      type: 'number',
      label: 'pH',
      placeholder: 'Enter blood pH (optional)',
      unit: '',
      keyboardType: 'decimal-pad',
      min: 6.8,
      max: 7.8,
      step: 0.01,
      required: false
    },
    {
      id: 'temp',
      type: 'number',
      label: 'Temperature',
      placeholder: 'Enter temperature (°C)',
      unit: '°C',
      keyboardType: 'decimal-pad',
      min: 30,
      max: 45,
      step: 0.1,
      required: false
    },
    {
      id: 'pco2',
      type: 'number',
      label: 'PaCO₂',
      placeholder: 'Enter PaCO₂ (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad',
      min: 10,
      max: 100,
      step: 0.1,
      required: false
    },
    {
      id: 'dpg',
      type: 'number',
      label: '2,3-DPG',
      placeholder: 'Enter 2,3-DPG (μmol/g Hb)',
      unit: 'μmol/g Hb',
      keyboardType: 'decimal-pad',
      min: 5,
      max: 25,
      step: 0.1,
      required: false
    }
  ],
  validate: (values: { [key: string]: string | boolean | number | undefined }) => {
    // Required fields
    const requiredFields = ['pao2', 'sao2'];
    for (const field of requiredFields) {
      const value = values[field];
      if (value === '' || value === undefined || value === null) {
        return `Please fill in the ${field} field`;
      }
    }

    // Validate numeric ranges
    const numericChecks = [
      { field: 'pao2', min: 0, max: 600 },
      { field: 'sao2', min: 0, max: 100 }
    ];

    // Add optional fields if provided
    if (values.ph) {
      numericChecks.push({ field: 'ph', min: 6.8, max: 7.8 });
    }
    if (values.temp) {
      numericChecks.push({ field: 'temp', min: 30, max: 45 });
    }
    if (values.pco2) {
      numericChecks.push({ field: 'pco2', min: 10, max: 100 });
    }
    if (values.dpg) {
      numericChecks.push({ field: 'dpg', min: 5, max: 25 });
    }

    for (const check of numericChecks) {
      const value = parseFloat(values[check.field] as string);
      if (isNaN(value) || value < check.min || value > check.max) {
        return `${check.field} must be between ${check.min} and ${check.max}${check.field === 'ph' ? '' : ' ' + (check.field === 'temp' ? '°C' : '')}`;
      }
    }

    return null;
  },
  calculate: (values: { [key: string]: string | boolean | number | undefined }) => {
    // Parse input values
    const pao2 = parseFloat(values.pao2 as string);
    const sao2 = parseFloat(values.sao2 as string) / 100; // Convert to fraction
    
    // Parse optional values or use defaults
    const ph = values.ph ? parseFloat(values.ph as string) : 7.4;
    const temp = values.temp ? parseFloat(values.temp as string) : 37; // °C
    const pco2 = values.pco2 ? parseFloat(values.pco2 as string) : 40; // mmHg
    const dpg = values.dpg ? parseFloat(values.dpg as string) : 4.65; // μmol/g Hb (normal ~4.65)
    
    // Calculate P50 using the Hill equation with standard parameters
    // P50 = PO2 * ((0.5 / (1 - 0.5)) ^ (1/n)) / ((SaO2 / (1 - SaO2)) ^ (1/n))
    // Where n is the Hill coefficient (~2.7 for normal hemoglobin)
    const hillCoefficient = 2.7; // Normal Hill coefficient
    
    // Simple calculation using Hill equation
    const p50Simple = pao2 * Math.pow(0.5 / (1 - 0.5), 1/hillCoefficient) / 
                     Math.pow(sao2 / (1 - sao2), 1/hillCoefficient);
    
    // More complex calculation with corrections
    // Temperature correction (ΔP50 = 0.22 * (37 - temp))
    const tempCorrection = 0.22 * (37 - temp);
    
    // pH correction (ΔP50 = -0.48 * (7.4 - pH))
    const phCorrection = -0.48 * (7.4 - ph);
    
    // PCO2 correction (ΔP50 = 0.05 * (pco2 - 40))
    const pco2Correction = 0.05 * (pco2 - 40);
    
    // 2,3-DPG correction (ΔP50 = 0.29 * (dpg - 4.65))
    const dpgCorrection = 0.29 * (dpg - 4.65);
    
    // Apply corrections to standard P50 (26.6 mmHg at 37°C, pH 7.4, PCO2 40)
    const correctedP50 = 26.6 + tempCorrection + phCorrection + pco2Correction + dpgCorrection;
    
    // Determine interpretation
    let interpretation = '';
    if (correctedP50 < 22) {
      interpretation = 'Increased oxygen affinity (left shift of oxygen-hemoglobin dissociation curve)';
    } else if (correctedP50 > 28) {
      interpretation = 'Decreased oxygen affinity (right shift of oxygen-hemoglobin dissociation curve)';
    } else {
      interpretation = 'Normal oxygen affinity';
    }
    
    // List factors affecting P50
    const factors = [
      'Factors increasing P50 (right shift):',
      '• Increased temperature',
      '• Decreased pH (acidosis)',
      '• Increased PCO₂',
      '• Increased 2,3-DPG',
      '• Fetal hemoglobin (HbF)',
      '• Abnormal hemoglobins (e.g., Hb Kansas)',
      '\nFactors decreasing P50 (left shift):',
      '• Decreased temperature',
      '• Increased pH (alkalosis)',
      '• Decreased PCO₂',
      '• Decreased 2,3-DPG',
      '• Carbon monoxide poisoning',
      '• Methemoglobinemia',
      '• Abnormal hemoglobins (e.g., Hb Chesapeake)'
    ].join('\n');
    
    // Clinical significance
    const clinicalNotes = [
      'Clinical Significance:',
      '• Left shift: Increased O₂ affinity → decreased O₂ delivery to tissues',
      '• Right shift: Decreased O₂ affinity → increased O₂ delivery to tissues',
      '• P50 is typically measured at pH 7.4, PCO₂ 40 mmHg, 37°C',
      '• Normal P50 range: 24-28 mmHg (varies by lab)'
    ].join('\n');
    
    return {
      result: p50Simple,
      interpretation: `P50: ${p50Simple.toFixed(1)} mmHg\n` +
                     `Corrected P50: ${correctedP50.toFixed(1)} mmHg\n\n` +
                     `Interpretation: ${interpretation}\n\n` +
                     `${factors}\n\n` +
                     `${clinicalNotes}`
    };
  },
  formula: 'P50 Calculation:\n\n' +
           '1. Simple Hill Equation:\n' +
           '   P50 = PaO₂ × (0.5/(1-0.5))^(1/n) / (SaO₂/(1-SaO₂))^(1/n)\n' +
           '   where n ≈ 2.7 (Hill coefficient)\n\n' +
           '2. Corrected P50 (standard conditions):\n' +
           '   P50(corr) = P50 + ΔP50(temp) + ΔP50(pH) + ΔP50(PCO₂) + ΔP50(2,3-DPG)\n\n' +
           'Correction Factors:\n' +
           '• Temperature: ΔP50 = 0.22 × (37 - temp[°C])\n' +
           '• pH: ΔP50 = -0.48 × (7.4 - pH)\n' +
           '• PCO₂: ΔP50 = 0.05 × (PCO₂ - 40)\n' +
           '• 2,3-DPG: ΔP50 = 0.29 × (2,3-DPG - 4.65 μmol/g Hb)',
  references: [
    'Thomas C, Lumb AB. Physiology of haemoglobin. Contin Educ Anaesth Crit Care Pain. 2012;12(5):251-256.',
    'Severinghaus JW. Simple, accurate equations for human blood O2 dissociation computations. J Appl Physiol Respir Environ Exerc Physiol. 1979;46(3):599-602.',
    'Bunn HF, Forget BG. Hemoglobin: Molecular, Genetic and Clinical Aspects. Philadelphia: WB Saunders; 1986.'
  ],
  resultUnit: 'mmHg'
};

export default p50Config;
