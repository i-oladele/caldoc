import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const meldConfig: CalculatorConfig = {
  id: 'meld',
  name: 'MELD Score',
  description: 'Predicts mortality risk in patients with liver disease.',
  category: 'Hepatology',
  fields: [
    {
      id: 'bilirubin',
      type: 'number',
      label: 'Bilirubin',
      placeholder: 'Enter total bilirubin (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad',
      min: 0
    },
    {
      id: 'inr',
      type: 'number',
      label: 'INR',
      placeholder: 'Enter INR',
      unit: '',
      keyboardType: 'decimal-pad',
      min: 0.1,
      step: 0.1
    },
    {
      id: 'creatinine',
      type: 'number',
      label: 'Creatinine',
      placeholder: 'Enter creatinine (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad',
      min: 0
    },
    {
      id: 'sodium',
      type: 'number',
      label: 'Sodium (Optional for MELD-Na)',
      placeholder: 'Enter sodium (mEq/L)',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad',
      min: 0,
      required: false
    },
    {
      id: 'onDialysis',
      type: 'checkbox',
      label: 'On Dialysis',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    }
  ],
  validate: (values: { [key: string]: string | boolean }) => {
    const requiredFields = ['bilirubin', 'inr', 'creatinine'];
    
    for (const field of requiredFields) {
      if (values[field] === '') {
        return 'Please fill in all required fields';
      }
    }
    
    // Additional validation for numeric ranges
    const bilirubin = parseFloat(values.bilirubin as string);
    const inr = parseFloat(values.inr as string);
    const creatinine = parseFloat(values.creatinine as string);
    
    if (isNaN(bilirubin) || bilirubin < 0) {
      return 'Bilirubin must be a positive number';
    }
    if (isNaN(inr) || inr < 0.1) {
      return 'INR must be at least 0.1';
    }
    if (isNaN(creatinine) || creatinine < 0) {
      return 'Creatinine must be a positive number';
    }
    
    // Optional sodium validation
    if (values.sodium && values.sodium !== '') {
      const sodium = parseFloat(values.sodium as string);
      if (isNaN(sodium) || sodium < 100 || sodium > 200) {
        return 'Sodium must be between 100 and 200 mEq/L';
      }
    }
    
    return null;
  },
  calculate: (values: { [key: string]: string | boolean }) => {
    // Parse input values with type assertions
    const bilirubin = parseFloat(values.bilirubin as string);
    const inr = parseFloat(values.inr as string);
    let creatinine = parseFloat(values.creatinine as string);
    const sodium = values.sodium ? parseFloat(values.sodium as string) : null;
    const onDialysis = values.onDialysis as boolean;
    
    // For patients on dialysis, set creatinine to 4.0 as per MELD guidelines
    if (onDialysis) {
      creatinine = 4.0;
    }
    
    // MELD score calculation
    let meldScore = 3.78 * Math.log(bilirubin) + 
                   11.2 * Math.log(inr) + 
                   9.57 * Math.log(creatinine) + 
                   6.43;
    
    // Round to nearest whole number and ensure it's between 6 and 40
    meldScore = Math.max(6, Math.min(Math.round(meldScore), 40));
    
    // MELD-Na calculation if sodium is provided
    let meldNaScore = null;
    if (sodium !== null) {
      // Constrain sodium to valid range (125-137 mEq/L for calculation)
      const constrainedNa = Math.max(125, Math.min(sodium, 137));
      
      meldNaScore = meldScore - (0.025 * meldScore * (140 - constrainedNa)) + 140;
      meldNaScore = Math.max(6, Math.min(Math.round(meldNaScore), 40));
    }
    
    // Determine mortality risk and interpretation
    let interpretation = '';
    let mortalityRisk = '';
    
    if (meldScore < 10) {
      mortalityRisk = '1.9% 3-month mortality';
      interpretation = 'Low risk - Consider other factors for transplant listing';
    } else if (meldScore <= 19) {
      mortalityRisk = '6.0-19.6% 3-month mortality';
      interpretation = 'Moderate risk - Consider for transplant evaluation';
    } else if (meldScore <= 29) {
      mortalityRisk = '19.6-52.6% 3-month mortality';
      interpretation = 'High risk - Strongly consider transplant listing';
    } else {
      mortalityRisk = '>52.6% 3-month mortality';
      interpretation = 'Very high risk - Highest priority for transplant';
    }
    
    // Format the result
    let resultText = `MELD Score: ${meldScore} (${mortalityRisk})`;
    if (meldNaScore !== null) {
      resultText += `\nMELD-Na Score: ${meldNaScore}`;
    }
    
    return {
      result: meldNaScore !== null ? meldNaScore : meldScore, // Use MELD-Na if available, otherwise MELD
      interpretation: `${resultText}\n\n${interpretation}`
    };
  },
  formula: 'MELD Score = 3.78 × ln(serum bilirubin [mg/dL]) + 11.2 × ln(INR) + 9.57 × ln(serum creatinine [mg/dL]) + 6.43\n' +
           '• Score is rounded to the nearest whole number\n' +
           '• Minimum score is 6, maximum is 40\n' +
           '• For patients on dialysis, use creatinine = 4.0 mg/dL\n\n' +
           'MELD-Na (if sodium available):\n' +
           'MELD-Na = MELD + 1.32 × (137 - Na) - [0.033 × MELD × (137 - Na)]\n' +
           '• Na is constrained between 125-137 mEq/L for calculation',
  references: [
    'Kamath PS, et al. A model to predict survival in patients with end-stage liver disease. Hepatology. 2001;33(2):464-470.',
    'Wiesner R, et al. Model for end-stage liver disease (MELD) and allocation of donor livers. Gastroenterology. 2003;124(1):91-96.',
    'Kim WR, et al. Hyponatremia and mortality among patients on the liver-transplant waiting list. N Engl J Med. 2008;359(10):1018-1026.'
  ],
  resultUnit: 'points'
};

export default meldConfig;
