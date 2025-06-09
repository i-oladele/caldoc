import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const glasgowBlatchfordConfig: CalculatorConfig = {
  id: 'glasgow-blatchford',
  name: 'Glasgow-Blatchford Score',
  description: 'Predicts need for intervention in upper gastrointestinal bleeding.',
  category: 'Gastroenterology',
  fields: [
    {
      id: 'bloodUrea',
      label: 'Blood Urea (mmol/L)',
      type: 'number',
      min: 0,
      step: 0.1,
      required: true,
      placeholder: 'Enter blood urea level'
    },
    {
      id: 'hemoglobin',
      label: 'Hemoglobin (g/dL)',
      type: 'number',
      min: 0,
      step: 0.1,
      required: true,
      placeholder: 'Enter hemoglobin level'
    },
    {
      id: 'systolicBP',
      label: 'Systolic BP (mmHg)',
      type: 'number',
      min: 0,
      step: 1,
      required: true,
      placeholder: 'Enter systolic blood pressure'
    },
    {
      id: 'heartRate',
      label: 'Heart Rate (bpm)',
      type: 'number',
      min: 0,
      step: 1,
      required: true,
      placeholder: 'Enter heart rate'
    },
    {
      id: 'melena',
      label: 'Melena',
      type: 'checkbox',
      required: true,
      placeholder: 'Presence of black, tarry stools'
    },
    {
      id: 'syncope',
      label: 'Syncope',
      type: 'checkbox',
      required: true,
      placeholder: 'History of fainting or loss of consciousness'
    },
    {
      id: 'liverDisease',
      label: 'Liver Disease',
      type: 'checkbox',
      required: true,
      placeholder: 'History of liver disease'
    },
    {
      id: 'heartFailure',
      label: 'Heart Failure',
      type: 'checkbox',
      required: true,
      placeholder: 'History of heart failure'
    }
  ],
  validate: (values) => {
    const errors: Record<string, string> = {};
    // Validate required numeric fields
    const numericFields = ['bloodUrea', 'hemoglobin', 'systolicBP', 'heartRate'];
    for (const field of numericFields) {
      if (values[field] === undefined || values[field] === '') {
        errors[field] = `${field} is required`;
      } else if (isNaN(Number(values[field]))) {
        errors[field] = `${field} must be a valid number`;
      }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values) => {
    // Parse input values
    const bloodUrea = parseFloat(values.bloodUrea as string);
    const hemoglobin = parseFloat(values.hemoglobin as string);
    const systolicBP = parseInt(values.systolicBP as string);
    const heartRate = parseInt(values.heartRate as string);
    const melena = values.melena === 'true';
    const syncope = values.syncope === 'true';
    const liverDisease = values.liverDisease === 'true';
    const heartFailure = values.heartFailure === 'true';

    // Calculate score components
    let score = 0;

    // Blood Urea component
    if (bloodUrea >= 6.5 && bloodUrea < 8) score += 2;
    else if (bloodUrea >= 8 && bloodUrea < 10) score += 3;
    else if (bloodUrea >= 10 && bloodUrea < 25) score += 4;
    else if (bloodUrea >= 25) score += 6;

    // Hemoglobin component (different for men and women)
    if (hemoglobin >= 12 && hemoglobin < 13) score += 1;
    else if (hemoglobin >= 10 && hemoglobin < 12) score += 3;
    else if (hemoglobin < 10) score += 6;

    // Systolic BP component
    if (systolicBP >= 100 && systolicBP <= 109) score += 1;
    else if (systolicBP >= 90 && systolicBP <= 99) score += 2;
    else if (systolicBP < 90) score += 3;

    // Other components
    if (melena) score += 1;
    if (syncope) score += 1;
    if (liverDisease) score += 2;
    if (heartFailure) score += 2;

    // Determine risk level and interpretation
    let interpretation = '';
    
    if (score === 0) {
      interpretation = 'Low Risk: Consider outpatient management. Low likelihood of needing intervention.';
    } else if (score <= 6) {
      interpretation = 'Moderate Risk: Consider admission for observation and early endoscopy.';
    } else {
      interpretation = 'High Risk: Urgent hospital admission and endoscopy within 24 hours required.';
    }

    // Store the detailed information in a memory for reference if needed
    const detailedInfo = {
      score,
      riskLevel: score === 0 ? 'Low Risk' : score <= 6 ? 'Moderate Risk' : 'High Risk',
      recommendations: score === 0 ? [
        'Consider outpatient management',
        'Low likelihood of needing intervention',
        'Consider early discharge if clinically appropriate'
      ] : score <= 6 ? [
        'Consider admission for observation',
        'Monitor for signs of ongoing bleeding',
        'Consider early endoscopy'
      ] : [
        'Urgent hospital admission required',
        'Consider ICU admission if unstable',
        'Urgent endoscopy within 24 hours',
        'Consider blood transfusion if needed',
        'Involve gastroenterology team'
      ]
    };

    // Return the result in the expected format
    return {
      result: score,
      interpretation: interpretation
    };
  },
  formula: 'Glasgow-Blatchford Score Calculation:\n\n' +
    '1. Blood Urea (mmol/L):\n' +
    '   - <6.5: 0 points\n' +
    '   - 6.5-7.9: 2 points\n' +
    '   - 8.0-9.9: 3 points\n' +
    '   - 10.0-24.9: 4 points\n' +
    '   - ≥25: 6 points\n\n' +
    '2. Hemoglobin (g/dL) for men:\n' +
    '   - ≥13: 0 points\n' +
    '   - 12-12.9: 1 point\n' +
    '   - 10-11.9: 3 points\n' +
    '   - <10: 6 points\n\n' +
    '3. Systolic BP (mmHg):\n' +
    '   - ≥110: 0 points\n' +
    '   - 100-109: 1 point\n' +
    '   - 90-99: 2 points\n' +
    '   - <90: 3 points\n\n' +
    '4. Other markers (1 point each):\n' +
    '   - Pulse ≥100 bpm\n' +
    '   - Presentation with melena\n' +
    '   - Presentation with syncope\n\n' +
    '5. Comorbidities (2 points each):\n' +
    '   - Liver disease\n' +
    '   - Cardiac failure',
  references: [
    'Blatchford O, Murray WR, Blatchford M. A risk score to predict need for treatment for upper-gastrointestinal haemorrhage. Lancet. 2000;356(9238):1318-1321.',
    'Stanley AJ, Laine L, Dalton HR, et al. Comparison of risk scoring systems for patients presenting with upper gastrointestinal bleeding: international multicentre prospective study. BMJ. 2017;356:i6432.'
  ],
  resultUnit: ''
};
