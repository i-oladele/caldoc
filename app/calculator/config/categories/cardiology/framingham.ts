import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const framinghamConfig: CalculatorConfig = {
  id: 'framingham',
  name: 'Cardiovascular Risk (Framingham Score)',
  description: 'Estimates 10-year cardiovascular risk based on various factors.',
  category: 'Cardiology',
  fields: [
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      min: 30,
      max: 79,
      step: 1,
      required: true,
      placeholder: 'Enter age (30-79 years)',
      unit: 'years'
    },
    {
      id: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]
    },
    {
      id: 'totalCholesterol',
      label: 'Total Cholesterol',
      type: 'number',
      min: 0,
      step: 1,
      required: true,
      placeholder: 'Enter total cholesterol',
      unit: 'mg/dL'
    },
    {
      id: 'hdlCholesterol',
      label: 'HDL Cholesterol',
      type: 'number',
      min: 0,
      step: 1,
      required: true,
      placeholder: 'Enter HDL cholesterol',
      unit: 'mg/dL'
    },
    {
      id: 'systolicBP',
      label: 'Systolic BP',
      type: 'number',
      min: 90,
      max: 200,
      step: 1,
      required: true,
      placeholder: 'Enter systolic blood pressure',
      unit: 'mmHg'
    },
    {
      id: 'treatedBP',
      label: 'On BP Treatment',
      type: 'checkbox',
      required: true,
      placeholder: 'Patient is on blood pressure medication'
    },
    {
      id: 'smoker',
      label: 'Current Smoker',
      type: 'checkbox',
      required: true,
      placeholder: 'Patient currently smokes'
    },
    {
      id: 'diabetes',
      label: 'Diabetes',
      type: 'checkbox',
      required: true,
      placeholder: 'Patient has diabetes'
    }
  ],
  validate: (values) => {
    const requiredFields = ['age', 'gender', 'totalCholesterol', 'hdlCholesterol', 'systolicBP'];
    const errors: Record<string, string> = {};
    
    for (const field of requiredFields) {
      if (values[field] === undefined || values[field] === '') {
        errors[field] = `${field} is required`;
      } else if (isNaN(Number(values[field]))) {
        errors[field] = `${field} must be a valid number`;
      } else if (Number(values[field]) < 0) {
        errors[field] = `${field} cannot be negative`;
      }
    }
    
    // Special validation for age range if age is valid
    if (!errors.age && values.age) {
      const age = parseInt(values.age);
      if (age < 30 || age > 79) {
        errors.age = 'Age must be between 30 and 79 years for this calculator';
      }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
    
    return null;
  },
  calculate: (values) => {
    // Note: This is a simplified version of the Framingham Risk Score
    // In a real implementation, you would use the full algorithm with points system
    // This is a placeholder calculation
    
    const age = parseInt(values.age as string);
    const totalChol = parseFloat(values.totalCholesterol as string);
    const hdl = parseFloat(values.hdlCholesterol as string);
    const sbp = parseFloat(values.systolicBP as string);
    const isMale = values.gender === 'male';
    const isSmoker = values.smoker === 'true';
    const hasDiabetes = values.diabetes === 'true';
    const onBPTreatment = values.treatedBP === 'true';
    
    // This is a simplified calculation - the actual Framingham score uses a complex points system
    let risk = 0;
    
    // Age factor
    risk += (age - 30) * 0.5;
    
    // Cholesterol ratio
    const cholRatio = totalChol / hdl;
    risk += (cholRatio - 3.5) * 10;
    
    // Blood pressure
    risk += (sbp - 120) * 0.1;
    if (onBPTreatment) risk += 5;
    
    // Other risk factors
    if (isSmoker) risk += 10;
    if (hasDiabetes) risk += 15;
    if (!isMale) risk -= 5; // Slightly lower risk for women
    
    // Cap the risk between 1% and 30% for this simplified version
    risk = Math.max(1, Math.min(30, risk));
    
    // Interpretation
    let interpretation = '';
    if (risk < 5) {
      interpretation = 'Low risk';
    } else if (risk < 10) {
      interpretation = 'Moderate risk';
    } else if (risk < 20) {
      interpretation = 'High risk';
    } else {
      interpretation = 'Very high risk';
    }
    
    return {
      result: parseFloat(risk.toFixed(1)),
      interpretation: `10-year CVD risk: ${risk.toFixed(1)}% - ${interpretation}`
    };
  },
  formula: 'Framingham Risk Score is calculated using a complex algorithm based on age, gender, cholesterol levels, blood pressure, smoking status, and diabetes status.',
  references: [
    'D\'Agostino RB, Vasan RS, Pencina MJ, et al. General cardiovascular risk profile for use in primary care: the Framingham Heart Study. Circulation. 2008;117(6):743-753.',
    'Goff DC, Lloyd-Jones DM, Bennett G, et al. 2013 ACC/AHA guideline on the assessment of cardiovascular risk: a report of the American College of Cardiology/American Heart Association Task Force on Practice Guidelines. Circulation. 2014;129(25 Suppl 2):S49-S73.'
  ],
  resultUnit: '%'
};
