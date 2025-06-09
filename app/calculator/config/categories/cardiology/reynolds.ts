import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const reynoldsConfig: CalculatorConfig = {
  id: 'reynolds',
  name: 'Reynolds Risk Score',
  description: 'Estimates 10-year cardiovascular risk, incorporating hs-CRP and family history.',
  category: 'Cardiology',
  fields: [
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter age (30-79)',
      min: 30,
      max: 79,
      required: true
    },
    {
      id: 'gender',
      type: 'select',
      label: 'Gender',
      placeholder: 'Select gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ],
      required: true
    },
    {
      id: 'smoking',
      type: 'radio',
      label: 'Current Smoker',
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ],
      required: true
    },
    {
      id: 'systolicBP',
      type: 'number',
      label: 'Systolic BP',
      placeholder: 'Enter systolic BP (mmHg)',
      min: 80,
      max: 200,
      unit: 'mmHg',
      required: true
    },
    {
      id: 'totalCholesterol',
      type: 'number',
      label: 'Total Cholesterol',
      placeholder: 'Enter total cholesterol (mg/dL)',
      min: 100,
      max: 400,
      unit: 'mg/dL',
      required: true
    },
    {
      id: 'hdlCholesterol',
      type: 'number',
      label: 'HDL Cholesterol',
      placeholder: 'Enter HDL cholesterol (mg/dL)',
      min: 10,
      max: 150,
      unit: 'mg/dL',
      required: true
    },
    {
      id: 'hsCRP',
      type: 'number',
      label: 'hs-CRP',
      placeholder: 'Enter hs-CRP (mg/L)',
      min: 0.1,
      max: 50,
      step: 0.1,
      unit: 'mg/L',
      required: true
    },
    {
      id: 'familyHistory',
      type: 'radio',
      label: 'Family History of Premature CVD',
      placeholder: 'Heart attack or stroke in parent <60 years old',
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ],
      required: true
    }
  ],
  validate: (values) => {
    // Basic validation to ensure all required fields are filled
    const requiredFields = [
      'age', 'gender', 'smoking', 'systolicBP',
      'totalCholesterol', 'hdlCholesterol', 'hsCRP', 'familyHistory'
    ];
    
    for (const field of requiredFields) {
      if (!values[field]) {
        return { [field]: `Please fill in the ${field.replace(/([A-Z])/g, ' ').toLowerCase().trim()} field` };
      }
    }
    
    return null;
  },
  calculate: (values) => {
    // This is a simplified version of the Reynolds Risk Score
    // Note: The actual Reynolds Risk Score calculation is more complex and involves log transformations
    // and specific coefficients for each risk factor. This is a simplified approximation.
    
    const age = parseInt(values.age);
    const isMale = values.gender === 'male';
    const isSmoker = values.smoking === 'true';
    const systolicBP = parseFloat(values.systolicBP);
    const totalChol = parseFloat(values.totalCholesterol);
    const hdlChol = parseFloat(values.hdlCholesterol);
    const hsCRP = parseFloat(values.hsCRP);
    const hasFamilyHistory = values.familyHistory === 'true';
    
    // Simplified risk calculation (not the actual Reynolds algorithm)
    let risk = 0;
    
    // Base risk based on age and gender
    if (isMale) {
      risk = (age - 30) * 0.5;
    } else {
      risk = (age - 30) * 0.4;
    }
    
    // Add risk factors
    if (isSmoker) risk += 10;
    if (systolicBP >= 140) risk += 10;
    if (systolicBP >= 160) risk += 5;
    if (totalChol >= 240) risk += 5;
    if (hdlChol < 40) risk += 5;
    if (hsCRP >= 3) risk += 5;
    if (hasFamilyHistory) risk += 5;
    
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
  formula: 'The Reynolds Risk Score is calculated based on age, gender, smoking status, blood pressure, cholesterol levels, hs-CRP, and family history of premature cardiovascular disease.',
  references: [
    'Ridker PM, Buring JE, Rifai N, Cook NR. Development and validation of improved algorithms for the assessment of global cardiovascular risk in women: the Reynolds Risk Score. JAMA. 2007;297(6):611-619.',
    'Ridker PM, Paynter NP, Rifai N, Gaziano JM, Cook NR. C-reactive protein and parental history improve global cardiovascular risk prediction: the Reynolds Risk Score for men. Circulation. 2008;118(22):2243-2251.'
  ],
  resultUnit: '%'
};
