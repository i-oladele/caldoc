import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const friedewaldConfig: CalculatorConfig = {
  id: 'friedewald',
  name: 'Friedewald Formula',
  description: 'Estimates LDL cholesterol level from lipid panel.',
  category: 'Cardiology',
  fields: [
    {
      id: 'totalCholesterol',
      label: 'Total Cholesterol',
      type: 'number',
      min: 0,
      step: 0.1,
      required: true,
      placeholder: 'Enter total cholesterol (mg/dL)',
      unit: 'mg/dL'
    },
    {
      id: 'hdl',
      label: 'HDL Cholesterol',
      type: 'number',
      min: 0,
      step: 0.1,
      required: true,
      placeholder: 'Enter HDL cholesterol (mg/dL)',
      unit: 'mg/dL'
    },
    {
      id: 'triglycerides',
      label: 'Triglycerides',
      type: 'number',
      min: 0,
      step: 1,
      required: true,
      placeholder: 'Enter triglycerides (mg/dL)',
      unit: 'mg/dL'
    }
  ],
  validate: (values) => {
    const requiredFields = ['totalCholesterol', 'hdl', 'triglycerides'];
    for (const field of requiredFields) {
      if (values[field] === undefined || values[field] === '') {
        return `${field} is required`;
      } else if (isNaN(Number(values[field]))) {
        return `${field} must be a valid number`;
      } else if (Number(values[field]) < 0) {
        return `${field} cannot be negative`;
      }
    }
    
    if (Number(values.triglycerides) > 400) {
      return 'Friedewald formula is not accurate for triglycerides > 400 mg/dL';
    }
    
    return null;
  },
  calculate: (values) => {
    const totalChol = parseFloat(values.totalCholesterol as string);
    const hdl = parseFloat(values.hdl as string);
    const trigs = parseFloat(values.triglycerides as string);
    
    // LDL = Total Cholesterol - HDL - (Triglycerides/5)
    // Note: Triglycerides/5 is an estimate of VLDL
    const ldl = totalChol - hdl - (trigs / 5);
    
    let interpretation = '';
    if (ldl < 100) {
      interpretation = 'Optimal';
    } else if (ldl < 130) {
      interpretation = 'Near optimal/above optimal';
    } else if (ldl < 160) {
      interpretation = 'Borderline high';
    } else if (ldl < 190) {
      interpretation = 'High';
    } else {
      interpretation = 'Very high';
    }
    
    return {
      result: parseFloat(ldl.toFixed(1)),
      interpretation: `LDL Cholesterol: ${ldl.toFixed(1)} mg/dL - ${interpretation}`
    };
  },
  formula: 'LDL = Total Cholesterol - HDL - (Triglycerides/5)',
  references: [
    'Friedewald WT, Levy RI, Fredrickson DS. Estimation of the concentration of low-density lipoprotein cholesterol in plasma, without use of the preparative ultracentrifuge. Clin Chem. 1972;18(6):499-502.',
    'National Cholesterol Education Program (NCEP) Expert Panel on Detection, Evaluation, and Treatment of High Blood Cholesterol in Adults (Adult Treatment Panel III). Third Report of the National Cholesterol Education Program (NCEP) Expert Panel on Detection, Evaluation, and Treatment of High Blood Cholesterol in Adults (Adult Treatment Panel III) final report. Circulation. 2002;106(25):3143-3421.'
  ],
  resultUnit: 'mg/dL'
};
