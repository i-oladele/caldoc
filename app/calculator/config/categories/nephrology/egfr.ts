import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

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
      unit: 'mg/dL',
      keyboardType: 'decimal-pad',
      min: 0.1,
      step: 0.1
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const age = parseFloat(values['age']);
    const creatinine = parseFloat(values['creatinine']);
    
    if (isNaN(age) || age < 18 || age > 120) {
      return 'Age must be between 18 and 120 years';
    }
    if (isNaN(creatinine) || creatinine <= 0) {
      return 'Creatinine must be a positive number';
    }
    if (!values['sex']) {
      return 'Please select sex';
    }
    if (!values['race']) {
      return 'Please select race';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const age = parseFloat(values['age']);
    const sex = values['sex'];
    const race = values['race'];
    const creatinine = parseFloat(values['creatinine']);
    
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
    
    return {
      result: roundedEgfr,
      interpretation: `CKD Stage ${stage}: ${interpretation}`
    };
  },
  formula: 'CKD-EPI equation (2021): 141 × min(Scr/κ,1)ᵅ × max(Scr/κ,1)⁻¹.²⁰⁹ × 0.993ᴬᵍᵉ × 1.018 [if female] × 1.159 [if black]',
  references: [
    'KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease',
    'Levey AS, et al. A New Equation to Estimate Glomerular Filtration Rate. Ann Intern Med. 2009',
    'National Kidney Foundation. Clinical Guidelines for Chronic Kidney Disease: Evaluation, Classification and Stratification'
  ],
  resultUnit: 'mL/min/1.73m²'
};

export default egfrConfig;
