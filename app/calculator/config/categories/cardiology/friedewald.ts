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
  calculate: (values: { [key: string]: string }) => {
    const totalChol = parseFloat(values.totalCholesterol);
    const hdl = parseFloat(values.hdl);
    const trigs = parseFloat(values.triglycerides);
    
    // Calculate LDL using the Friedewald formula
    // LDL = Total Cholesterol - HDL - (Triglycerides/5)
    // Note: This formula is less accurate when triglycerides > 400 mg/dL
    const ldl = totalChol - hdl - (trigs / 5);
    const roundedLdl = Math.round(ldl);
    
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (ldl < 100) {
      interpretation = 'Optimal';
      status = 'success';  // Green
    } else if (ldl < 130) {
      interpretation = 'Near optimal/above optimal';
      status = 'warning';  // Yellow
    } else if (ldl < 160) {
      interpretation = 'Borderline high';
      status = 'warning';  // Yellow
    } else if (ldl < 190) {
      interpretation = 'High';
      status = 'danger';   // Red
    } else {
      interpretation = 'Very high';
      status = 'danger';   // Red
    }
    
    return {
      result: parseFloat(ldl.toFixed(1)),
      interpretation: `LDL Cholesterol: ${ldl.toFixed(1)} mg/dL - ${interpretation}`,
      status,
      resultDetails: [
        { label: 'LDL Cholesterol', value: `${ldl.toFixed(1)} mg/dL`, status },
        { label: 'Category', value: interpretation, status }
      ]
    };
  },
  formula: 'LDL = Total Cholesterol - HDL - (Triglycerides/5)\n\nLDL Cholesterol Categories (mg/dL):\n- <100: Optimal (Green)\n- 100-129: Near optimal/Above optimal (Yellow)\n- 130-159: Borderline high (Yellow)\n- 160-189: High (Red)\n- ≥190: Very high (Red)',
  references: [
    'Friedewald WT, Levy RI, Fredrickson DS. Estimation of the concentration of low-density lipoprotein cholesterol in plasma, without use of the preparative ultracentrifuge. Clin Chem. 1972;18(6):499-502.',
    'National Cholesterol Education Program (NCEP) Expert Panel on Detection, Evaluation, and Treatment of High Blood Cholesterol in Adults (Adult Treatment Panel III). Third Report of the National Cholesterol Education Program (NCEP) Expert Panel on Detection, Evaluation, and Treatment of High Blood Cholesterol in Adults (Adult Treatment Panel III) final report. Circulation. 2002;106(25):3143-3421.'
  ],
  resultUnit: 'mg/dL'
};
