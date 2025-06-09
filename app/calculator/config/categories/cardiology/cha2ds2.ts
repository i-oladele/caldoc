import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const cha2ds2Config: CalculatorConfig = {
  id: 'cha2ds2',
  name: 'CHA2DS2 Score (without VASc)',
  description: 'Stroke risk assessment for atrial fibrillation patients without VASc components.',
  category: 'Cardiology',
  fields: [
    {
      id: 'congestiveHF',
      type: 'radio',
      label: 'Congestive Heart Failure',
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ],
      required: true
    },
    {
      id: 'hypertension',
      type: 'radio',
      label: 'Hypertension',
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ],
      required: true
    },
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter age (years)',
      min: 0,
      max: 120,
      required: true
    },
    {
      id: 'diabetes',
      type: 'radio',
      label: 'Diabetes',
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ],
      required: true
    },
    {
      id: 'strokeTIA',
      type: 'radio',
      label: 'Stroke/TIA/Thromboembolism',
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ],
      required: true
    }
  ],
  validate: (values) => {
    const requiredFields = [
      'congestiveHF', 'hypertension', 'age', 'diabetes', 'strokeTIA'
    ];
    
    for (const field of requiredFields) {
      if (values[field] === undefined || values[field] === '') {
        const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        return `Please specify ${fieldName}`;
      }
    }
    
    return null;
  },
  calculate: (values) => {
    let score = 0;
    const riskFactors = [];
    
    // C: Congestive heart failure (1 point)
    if (values.congestiveHF === 'true') {
      score += 1;
      riskFactors.push('Congestive heart failure');
    }
    
    // H: Hypertension (1 point)
    if (values.hypertension === 'true') {
      score += 1;
      riskFactors.push('Hypertension');
    }
    
    // A: Age ≥75 years (1 point)
    const age = parseInt(values.age);
    if (age >= 75) {
      score += 1;
      riskFactors.push('Age ≥75 years');
    }
    
    // D: Diabetes (1 point)
    if (values.diabetes === 'true') {
      score += 1;
      riskFactors.push('Diabetes');
    }
    
    // S: Stroke/TIA/Thromboembolism (2 points)
    if (values.strokeTIA === 'true') {
      score += 2;
      riskFactors.push('Prior stroke/TIA/thromboembolism');
    }
    
    // Determine risk level and recommendation
    let riskLevel, recommendation;
    if (score === 0) {
      riskLevel = 'Low';
      recommendation = 'No antithrombotic therapy needed';
    } else if (score === 1) {
      riskLevel = 'Moderate';
      recommendation = 'Consider antithrombotic therapy (aspirin or oral anticoagulant)';
    } else {
      riskLevel = 'High';
      recommendation = 'Oral anticoagulation therapy recommended (e.g., warfarin, DOACs)';
    }
    
    // Calculate annual stroke risk percentage based on score
    const strokeRisk = [
      0,  // 0 points
      1.9, // 1 point
      2.8, // 2 points
      4.0, // 3 points
      5.9, // 4 points
      8.5, // 5 points
      12.5 // 6+ points
    ][Math.min(score, 6)] || 12.5;
    
    return {
      result: score,
      interpretation: `CHA2DS2 Score: ${score} (${riskLevel} risk)\nAnnual stroke risk: ~${strokeRisk}%\nRecommendation: ${recommendation}\n\nRisk factors: ${riskFactors.length > 0 ? riskFactors.join(', ') : 'None'}`
    };
  },
  formula: 'CHA2DS2 Score Calculation:\n- C: Congestive heart failure (1 point)\n- H: Hypertension (1 point)\n- A: Age ≥75 years (1 point)\n- D: Diabetes (1 point)\n- S: Prior Stroke/TIA/Thromboembolism (2 points)',
  references: [
    'Gage BF, Waterman AD, Shannon W, et al. Validation of clinical classification schemes for predicting stroke: results from the National Registry of Atrial Fibrillation. JAMA. 2001;285(22):2864-2870.',
    'January CT, Wann LS, Calkins H, et al. 2019 AHA/ACC/HRS Focused Update of the 2014 AHA/ACC/HRS Guideline for the Management of Patients With Atrial Fibrillation. J Am Coll Cardiol. 2019;74(1):104-132.'
  ],
  resultUnit: 'points'
};
