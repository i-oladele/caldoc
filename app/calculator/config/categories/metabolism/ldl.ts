import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const ldlConfig: CalculatorConfig = {
  id: 'ldl',
  fields: [
    {
      label: 'Total Cholesterol',
      placeholder: 'Enter total cholesterol (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'HDL',
      placeholder: 'Enter HDL (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Triglycerides',
      placeholder: 'Enter triglycerides (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const totalChol = parseFloat(values['Total Cholesterol']);
    const hdl = parseFloat(values.HDL);
    const trig = parseFloat(values.Triglycerides);
    
    if (isNaN(totalChol) || totalChol <= 0) {
      return 'Total cholesterol must be positive';
    }
    if (isNaN(hdl) || hdl <= 0) {
      return 'HDL must be positive';
    }
    if (isNaN(trig) || trig <= 0) {
      return 'Triglycerides must be positive';
    }
    if (trig > 400) {
      return 'Triglycerides must be less than 400 mg/dL for accurate calculation';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const totalChol = parseFloat(values['Total Cholesterol']);
    const hdl = parseFloat(values.HDL);
    const trig = parseFloat(values.Triglycerides);
    const ldl = totalChol - hdl - (trig / 5);
    
    let interpretation = '';
    if (ldl < 70) {
      interpretation = 'Optimal';
    } else if (ldl < 100) {
      interpretation = 'Near Optimal';
    } else if (ldl < 130) {
      interpretation = 'Borderline High';
    } else if (ldl < 160) {
      interpretation = 'High';
    } else {
      interpretation = 'Very High';
    }
    
    return {
      result: parseFloat(ldl.toFixed(1)),
      interpretation
    };
  },
  formula: 'LDL = Total Cholesterol - HDL - (Triglycerides/5)',
  references: [
    'Friedewald WT, et al. Estimation of LDL-cholesterol concentration without ultracentrifugation.',
    'Clinical Chemistry. LDL Cholesterol Calculation Methods.',
    'Journal of Lipid Research. Validation of the Friedewald Formula.'
  ],
  resultUnit: 'mg/dL'
};

export default ldlConfig;
