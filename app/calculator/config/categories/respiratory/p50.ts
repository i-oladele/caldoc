import { CalculationStatus, CalculatorConfig, CalculatorValues } from '@/app/calculator/config/calculator';

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
  calculate: (values: CalculatorValues) => {
    // Parse input values
    const pao2 = typeof values.pao2 === 'string' ? parseFloat(values.pao2) || 0 : 0;
    const sao2 = typeof values.sao2 === 'string' ? parseFloat(values.sao2) / 100 : 0; // Convert to fraction
    
    // Parse optional values or use defaults
    const ph = values.ph ? (typeof values.ph === 'string' ? parseFloat(values.ph) : 7.4) : 7.4;
    const temp = values.temp ? (typeof values.temp === 'string' ? parseFloat(values.temp) : 37) : 37; // °C
    const pco2 = values.pco2 ? (typeof values.pco2 === 'string' ? parseFloat(values.pco2) : 40) : 40; // mmHg
    const dpg = values.dpg ? (typeof values.dpg === 'string' ? parseFloat(values.dpg) : 4.65) : 4.65; // μmol/g Hb (normal ~4.65)
    
    // Calculate P50 using the Hill equation with standard parameters
    const hillCoefficient = 2.7; // Normal Hill coefficient
    
    // Simple calculation using Hill equation
    const p50Simple = pao2 * Math.pow(0.5 / (1 - 0.5), 1/hillCoefficient) / 
                     Math.pow(sao2 / (1 - sao2), 1/hillCoefficient);
    
    // More complex calculation with corrections
    const tempCorrection = 0.22 * (37 - temp);
    const phCorrection = -0.48 * (7.4 - ph);
    const pco2Correction = 0.05 * (pco2 - 40);
    const dpgCorrection = 0.29 * (dpg - 4.65);
    
    // Apply corrections to standard P50 (26.6 mmHg at 37°C, pH 7.4, PCO2 40)
    const correctedP50 = 26.6 + tempCorrection + phCorrection + pco2Correction + dpgCorrection;
    const roundedP50 = parseFloat(correctedP50.toFixed(1));
    
    // Determine status and interpretation
    let status: CalculationStatus = 'success';
    let interpretation = '';
    
    if (correctedP50 < 22) {
      status = 'danger';
      interpretation = 'Markedly increased oxygen affinity (significant left shift)';
    } else if (correctedP50 < 24) {
      status = 'warning';
      interpretation = 'Mildly increased oxygen affinity (left shift)';
    } else if (correctedP50 <= 28) {
      status = 'success';
      interpretation = 'Normal oxygen affinity';
    } else if (correctedP50 <= 30) {
      status = 'warning';
      interpretation = 'Mildly decreased oxygen affinity (right shift)';
    } else {
      status = 'danger';
      interpretation = 'Markedly decreased oxygen affinity (significant right shift)';
    }
    
    // Clinical significance with color coding
    const clinicalNotes = [
      `P50: ${p50Simple.toFixed(1)} mmHg (calculated)`,
      `Corrected P50: ${roundedP50} mmHg (standard conditions)`,
      `Status: ${status === 'success' ? 'Normal' : status === 'warning' ? 'Borderline' : 'Abnormal'}`,
      `\n${interpretation}`,
      '\nNormal range: 24-28 mmHg',
      '\nClinical Implications:',
      '• Left shift: Increased O₂ affinity → decreased O₂ delivery to tissues',
      '• Right shift: Decreased O₂ affinity → increased O₂ delivery to tissues',
      '\nCommon Causes:',
      '• Left shift: Alkalosis, hypothermia, CO poisoning, methemoglobinemia',
      '• Right shift: Acidosis, fever, anemia, high altitude, 2,3-DPG increase'
    ].join('\n');
    
    return {
      result: p50Simple,
      interpretation: clinicalNotes,
      status
    };
  },
  formula: 'P50 Calculation:\n\n' +
           '1. Simple Hill Equation:\n' +
           '   P50 = PaO₂ × (0.5/(1-0.5))^(1/n) / (SaO₂/(1-SaO₂))^(1/n)\n' +
           '   where n ≈ 2.7 (Hill coefficient)\n\n' +
           '2. Corrected P50 (standard conditions):\n' +
           '   P50_corr = 26.6 + 0.22(37 - temp) - 0.48(7.4 - pH) + 0.05(PCO₂ - 40) + 0.29(2,3-DPG - 4.65)\n\n' +
           '   Where:\n' +
           '   • 26.6 mmHg = standard P50 at 37°C, pH 7.4, PCO₂ 40 mmHg\n' +
           '   • temp = temperature in °C\n' +
           '   • pH = blood pH\n' +
           '   • PCO₂ = partial pressure of CO₂ in mmHg\n' +
           '   • 2,3-DPG = 2,3-diphosphoglycerate in μmol/g Hb\n\n' +
           '3. Interpretation (Corrected P50):\n' +
           '   • <22 mmHg: Markedly increased O₂ affinity (Left shift)\n' +
           '   • 22-24 mmHg: Mildly increased O₂ affinity (Borderline left)\n' +
           '   • 24-28 mmHg: Normal O₂ affinity\n' +
           '   • 28-30 mmHg: Mildly decreased O₂ affinity (Borderline right)\n' +
           '   • >30 mmHg: Markedly decreased O₂ affinity (Right shift)',
  references: [
    'Thomas C, Lumb AB. Physiology of haemoglobin. Contin Educ Anaesth Crit Care Pain. 2012;12(5):251-256.',
    'Severinghaus JW. Simple, accurate equations for human blood O2 dissociation computations. J Appl Physiol Respir Environ Exerc Physiol. 1979;46(3):599-602.',
    'Bunn HF, Forget BG. Hemoglobin: Molecular, Genetic and Clinical Aspects. Philadelphia: WB Saunders; 1986.'
  ],
  resultUnit: 'mmHg',
};

export default p50Config;
