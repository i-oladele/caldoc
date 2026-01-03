import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const egfrConfig: CalculatorConfig = {
  id: 'egfr',
  name: 'Estimated GFR (eGFR)',
  description: 'Estimates kidney function from serum creatinine and demographics.',
  category: 'Nephrology',
  fields: [
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter age',
      unit: 'years',
      keyboardType: 'number-pad',
      min: 18,
      max: 120
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
      id: 'race',
      type: 'select',
      label: 'Race',
      options: [
        { label: 'Black', value: 'black' },
        { label: 'Non-Black', value: 'non-black' }
      ]
    },
    {
      id: 'creatinine',
      type: 'number',
      label: 'Serum Creatinine',
      placeholder: 'Enter creatinine level',
      keyboardType: 'decimal-pad',
      min: 0.1,
      step: 0.1
    },
    {
      id: 'creatinineUnit',
      type: 'select',
      label: 'Creatinine Unit',
      options: [
        { label: 'mg/dL', value: 'mg/dL' },
        { label: 'μmol/L', value: 'μmol/L' }
      ],
      defaultValue: 'mg/dL'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const age = parseFloat(values['age']);
    const creatinine = parseFloat(values['creatinine']);
    const creatinineUnit = values['creatinineUnit'] || 'mg/dL';
    
    const errors: Record<string, string> = {};
    
    if (isNaN(age) || age < 18 || age > 120) {
      errors['age'] = 'Age must be between 18 and 120 years';
    }
    
    if (isNaN(creatinine) || creatinine <= 0) {
      errors['creatinine'] = 'Creatinine must be a positive number';
    }
    
    if (!values['sex']) {
      errors['sex'] = 'Please select sex';
    }
    
    if (!values['race']) {
      errors['race'] = 'Please select race';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string }) => {
    const age = parseFloat(values['age']);
    const sex = values['sex'];
    const race = values['race'];
    let creatinine = parseFloat(values['creatinine']);
    const creatinineUnit = values['creatinineUnit'] || 'mg/dL';
    
    // Convert μmol/L to mg/dL if needed (1 mg/dL = 88.4 μmol/L)
    if (creatinineUnit === 'μmol/L') {
      creatinine = creatinine / 88.4;
    }
    
    // CKD-EPI equation for eGFR
    let kappa = sex === 'female' ? 0.7 : 0.9;
    let alpha = sex === 'female' ? -0.329 : -0.411;
    let sexMultiplier = sex === 'female' ? 1.018 : 1.0;
    let raceMultiplier = race === 'black' ? 1.159 : 1.0;
    
    const minCr = Math.max(creatinine / kappa, 1);
    const maxCr = Math.min(creatinine / kappa, 1);
    
    const egfr = 141 * 
                Math.pow(minCr, alpha) * 
                Math.pow(maxCr, -1.209) * 
                Math.pow(0.993, age) * 
                sexMultiplier * 
                raceMultiplier;
    
    const roundedEgfr = Math.round(egfr * 10) / 10;
    
    let stage = '';
    let interpretation = '';
    
    if (roundedEgfr >= 90) {
      stage = 'G1';
      interpretation = 'Normal or high';
    } else if (roundedEgfr >= 60) {
      stage = 'G2';
      interpretation = 'Mildly decreased';
    } else if (roundedEgfr >= 45) {
      stage = 'G3a';
      interpretation = 'Mild to moderate';
    } else if (roundedEgfr >= 30) {
      stage = 'G3b';
      interpretation = 'Moderate to severe';
    } else if (roundedEgfr >= 15) {
      stage = 'G4';
      interpretation = 'Severe';
    } else {
      stage = 'G5';
      interpretation = 'Kidney failure';
    }
    
    // Determine status based on CKD stage
    let status: 'success' | 'warning' | 'danger';
    if (roundedEgfr >= 60) {
      status = 'success';  // Green for normal/mild
    } else if (roundedEgfr >= 30) {
      status = 'warning';  // Yellow for moderate
    } else {
      status = 'danger';   // Red for severe/kidney failure
    }
    
    return {
      result: roundedEgfr,
      status,
      interpretation: `eGFR: ${roundedEgfr} mL/min/1.73m²\n` +
                     `CKD Stage ${stage}: ${interpretation}`
    };
  },
  formula: 'CKD-EPI equation (2021): 141 × min(Scr/κ,1)ᵅ × max(Scr/κ,1)⁻¹.²⁰⁹ × 0.993ᴬᵍᵉ × 1.018 [if female] × 1.159 [if black]\nNote: Creatinine values are automatically converted to mg/dL for calculation',
  references: [
    'KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease',
    'Levey AS, et al. A New Equation to Estimate Glomerular Filtration Rate. Ann Intern Med. 2009',
    'National Kidney Foundation. Clinical Guidelines for Chronic Kidney Disease: Evaluation, Classification and Stratification'
  ],
  resultUnit: 'mL/min/1.73m²'
};

export default egfrConfig;
