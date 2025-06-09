import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const correctedAnionGapConfig: CalculatorConfig = {
  id: 'corrected-anion-gap',
  name: 'Anion Gap Corrected for Albumin',
  description: 'More accurate metabolic acidosis evaluation adjusting for low albumin.',
  category: 'Metabolism',
  fields: [
    {
      id: 'sodium',
      label: 'Sodium (Na⁺)',
      type: 'number',
      min: 0,
      step: 0.1,
      required: true,
      placeholder: 'Enter sodium level',
      unit: 'mEq/L'
    },
    {
      id: 'chloride',
      label: 'Chloride (Cl⁻)',
      type: 'number',
      min: 0,
      step: 0.1,
      required: true,
      placeholder: 'Enter chloride level',
      unit: 'mEq/L'
    },
    {
      id: 'bicarbonate',
      label: 'Bicarbonate (HCO₃⁻)',
      type: 'number',
      min: 0,
      step: 0.1,
      required: true,
      placeholder: 'Enter bicarbonate level',
      unit: 'mEq/L'
    },
    {
      id: 'albumin',
      label: 'Albumin',
      type: 'number',
      min: 0.1,
      step: 0.1,
      required: true,
      placeholder: 'Enter albumin level',
      unit: 'g/dL'
    }
  ],
  validate: (values) => {
    const requiredFields = ['sodium', 'chloride', 'bicarbonate', 'albumin'];
    for (const field of requiredFields) {
      if (values[field] === undefined || values[field] === '') {
        return `${field} is required`;
      } else if (isNaN(Number(values[field]))) {
        return `${field} must be a valid number`;
      } else if (Number(values[field]) < 0) {
        return `${field} cannot be negative`;
      }
    }
    
    if (Number(values.albumin) <= 0) {
      return 'Albumin must be greater than 0';
    }
    
    return null;
  },
  calculate: (values) => {
    const sodium = parseFloat(values.sodium as string);
    const chloride = parseFloat(values.chloride as string);
    const bicarbonate = parseFloat(values.bicarbonate as string);
    const albumin = parseFloat(values.albumin as string);
    
    // Standard anion gap calculation
    const anionGap = sodium - (chloride + bicarbonate);
    
    // Correction factor for albumin (normal albumin is 4.4 g/dL)
    const correctionFactor = (4.4 - albumin) * 2.5;
    
    // Corrected anion gap
    const correctedAnionGap = anionGap + correctionFactor;
    
    // Interpretation
    let interpretation = '';
    if (correctedAnionGap > 12) {
      interpretation = 'Elevated anion gap metabolic acidosis';
    } else if (correctedAnionGap > 6) {
      interpretation = 'Normal anion gap';
    } else {
      interpretation = 'Low anion gap (consider hypoalbuminemia, hypercalcemia, or other conditions)';
    }
    
    return {
      result: parseFloat(correctedAnionGap.toFixed(1)),
      interpretation: `Corrected Anion Gap: ${correctedAnionGap.toFixed(1)} mEq/L - ${interpretation}`
    };
  },
  formula: 'Corrected Anion Gap = (Na⁺ - Cl⁻ - HCO₃⁻) + 2.5 × (4.4 - [Albumin])',
  references: [
    'Figge J, Jabor A, Kazda A, Fencl V. Anion gap and hypoalbuminemia. Crit Care Med. 1998;26(11):1807-1810.',
    'Kraut JA, Madias NE. Serum anion gap: its uses and limitations in clinical medicine. Clin J Am Soc Nephrol. 2007;2(1):162-174.'
  ],
  resultUnit: 'mEq/L'
};
