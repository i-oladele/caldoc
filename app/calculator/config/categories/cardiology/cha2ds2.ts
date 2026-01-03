import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const cha2ds2Config: CalculatorConfig = {
  id: 'cha2ds2',
  name: 'CHA2DS2 Score (without VASc)',
  description: 'Stroke risk assessment for atrial fibrillation patients without VASc components.',
  category: 'Cardiology',
  fields: [
    {
      id: 'congestiveHF',
      type: 'checkbox',
      label: 'Congestive Heart Failure',
      description: 'Clinical or echocardiographic evidence of heart failure'
    },
    {
      id: 'hypertension',
      type: 'checkbox',
      label: 'Hypertension',
      description: 'History of hypertension or currently on antihypertensive medication'
    },
    {
      id: 'age',
      type: 'number',
      label: 'Age (years)',
      placeholder: 'Enter age',
      min: 0,
      max: 120,
      required: true
    },
    {
      id: 'diabetes',
      type: 'checkbox',
      label: 'Diabetes',
      description: 'Fasting glucose >125 mg/dL or treatment with oral hypoglycemic agent and/or insulin'
    },
    {
      id: 'strokeTIA',
      type: 'checkbox',
      label: 'Prior Stroke/TIA/Thromboembolism',
      description: 'History of stroke, TIA, or systemic embolism (2 points)'
    }
  ],
  validate: (values) => {
    // Only age is required as a number input
    if (!values.age || values.age === '') {
      return { age: 'Age is required' };
    }
    
    const age = Number(values.age);
    if (isNaN(age) || age < 0 || age > 120) {
      return { age: 'Please enter a valid age between 0 and 120' };
    }
    
    return null;
  },
  calculate: (values) => {
    let score = 0;
    const riskFactors = [];
    const age = Number(values.age);
    
    // C: Congestive heart failure (1 point)
    if (values.congestiveHF) {
      score += 1;
      riskFactors.push('Congestive heart failure');
    }
    
    // H: Hypertension (1 point)
    if (values.hypertension) {
      score += 1;
      riskFactors.push('Hypertension');
    }
    
    // A: Age ≥75 years (1 point)
    if (age >= 75) {
      score += 1;
      riskFactors.push('Age ≥75 years');
    }
    
    // D: Diabetes (1 point)
    if (values.diabetes) {
      score += 1;
      riskFactors.push('Diabetes');
    }
    
    // S: Stroke/TIA/Thromboembolism (2 points)
    if (values.strokeTIA) {
      score += 2;
      riskFactors.push('Prior stroke/TIA/thromboembolism');
    }
    
    // Determine risk level, recommendation, and status
    let riskLevel, recommendation, status: 'success' | 'warning' | 'danger';
    if (score === 0) {
      riskLevel = 'Low';
      status = 'success';
      recommendation = 'No antithrombotic therapy needed';
    } else if (score === 1) {
      riskLevel = 'Low-Moderate';
      status = 'warning';
      recommendation = 'Consider antithrombotic therapy (aspirin or oral anticoagulation)';
    } else if (score === 2) {
      riskLevel = 'Moderate-High';
      status = 'warning';
      recommendation = 'Consider oral anticoagulation (warfarin or DOAC)';
    } else {
      riskLevel = 'High';
      status = 'danger';
      recommendation = 'Oral anticoagulation recommended (warfarin or DOAC)';
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
      status,
      interpretation: `CHA2DS2 Score: ${score} (${riskLevel} risk)\nAnnual stroke risk: ~${strokeRisk}%\nRecommendation: ${recommendation}\n\nRisk factors: ${riskFactors.length > 0 ? riskFactors.join(', ') : 'None'}`
    };
  },
  formula: 'CHA2DS2 Score Calculation (0-6 points):\n- C: Congestive heart failure (1 point)\n- H: Hypertension (1 point)\n- A: Age ≥75 years (1 point)\n- D: Diabetes (1 point)\n- S: Prior Stroke/TIA/Thromboembolism (2 points)\n\nScore Interpretation:\n- 0: Low risk (0.2-0.3% annual stroke risk)\n- 1: Low-moderate risk (0.6-1.0% annual stroke risk)\n- 2: Moderate-high risk (1.9-2.9% annual stroke risk)\n- ≥3: High risk (3.2-14.2% annual stroke risk)',
  references: [
    'Gage BF, Waterman AD, Shannon W, et al. Validation of clinical classification schemes for predicting stroke: results from the National Registry of Atrial Fibrillation. JAMA. 2001;285(22):2864-2870.',
    'January CT, Wann LS, Calkins H, et al. 2019 AHA/ACC/HRS Focused Update of the 2014 AHA/ACC/HRS Guideline for the Management of Patients With Atrial Fibrillation. J Am Coll Cardiol. 2019;74(1):104-132.'
  ],
  resultUnit: 'points'
};
