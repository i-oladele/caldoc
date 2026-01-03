import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const cha2ds2VascConfig: CalculatorConfig = {
  id: 'cha2ds2-vasc',
  name: 'CHA2DS2-VASc Score',
  description: 'Assesses stroke risk in patients with atrial fibrillation.',
  category: 'Cardiology',
  fields: [
    {
      id: 'congestiveHF',
      type: 'checkbox',
      label: 'Congestive heart failure/LV dysfunction',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'hypertension',
      type: 'checkbox',
      label: 'Hypertension (or treated hypertension)',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'ageGroup',
      type: 'radio',
      label: 'Age Group',
      options: [
        { label: '<65 years', value: 'under65' },
        { label: '65-74 years', value: '65to74' },
        { label: '≥75 years', value: '75plus' }
      ],
      required: true
    },
    {
      id: 'diabetes',
      type: 'checkbox',
      label: 'Diabetes mellitus',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'strokeTIA',
      type: 'checkbox',
      label: 'Stroke/TIA/thromboembolism',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'vascularDisease',
      type: 'checkbox',
      label: 'Vascular disease (prior MI, PAD, or aortic plaque)',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'female',
      type: 'checkbox',
      label: 'Female sex (but not a risk factor if female <65 and no other risk factors)',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    }
  ],
  validate: (values: { [key: string]: string | boolean }) => {
    if (values.ageGroup === undefined) {
      return { ageGroup: 'Please select an age group' };
    }
    return null;
  },
  calculate: (values: { [key: string]: string | boolean }) => {
    let score = 0;
    // Calculate score based on risk factors
    if (values.congestiveHF) score += 1;
    if (values.hypertension) score += 1;
    if (values.diabetes) score += 1;
    if (values.strokeTIA) score += 2;
    if (values.vascularDisease) score += 1;
    
    // Handle age group scoring
    if (values.ageGroup === '65to74') {
      score += 1;
    } else if (values.ageGroup === '75plus') {
      score += 2;
    }

    // Special case for female sex (only counts if other risk factors present)
    if (values.female === true && score === 1) {
      // If female is the only risk factor, it doesn't count
      if (values.ageGroup !== '65to74') {
        score = 0;
      }
    }

    // Determine risk level, recommendation, and annual stroke risk
    let interpretation, recommendation, annualRisk, riskLevel;
    
    if (score === 0) {
      riskLevel = 'Low';
      interpretation = 'Very low risk of stroke';
      annualRisk = '0-0.2%';
      recommendation = 'No antithrombotic therapy needed';
    } else if (score === 1) {
      riskLevel = 'Low-Moderate';
      interpretation = 'Low to moderate risk of stroke';
      annualRisk = '1.3%';
      recommendation = 'Consider antithrombotic therapy (aspirin or oral anticoagulation)';
    } else if (score === 2) {
      riskLevel = 'Moderate';
      interpretation = 'Moderate risk of stroke';
      annualRisk = '2.2%';
      recommendation = 'Consider oral anticoagulation (warfarin or DOAC)';
    } else if (score === 3) {
      riskLevel = 'High';
      interpretation = 'High risk of stroke';
      annualRisk = '3.2%';
      recommendation = 'Oral anticoagulation recommended (warfarin or DOAC)';
    } else if (score === 4) {
      riskLevel = 'High';
      interpretation = 'High risk of stroke';
      annualRisk = '4.0-5.9%';
      recommendation = 'Oral anticoagulation recommended (warfarin or DOAC)';
    } else {
      riskLevel = 'Very High';
      interpretation = 'Very high risk of stroke';
      annualRisk = '6.7-15.2%';
      recommendation = 'Oral anticoagulation strongly recommended (warfarin or DOAC)';
    }

    return {
      result: score,
      interpretation: `CHA2DS2-VASc Score: ${score} (${riskLevel} Risk)\n` +
        `• Risk Level: ${riskLevel}\n` +
        `• Interpretation: ${interpretation}\n` +
        `• Annual Stroke Risk: ${annualRisk}\n` +
        `• Recommendation: ${recommendation}`,
      status: score >= 3 ? 'danger' : score >= 1 ? 'warning' : 'success'
    };
  },
  formula: 'CHA2DS2-VASc Score:\n' +
    '• Congestive heart failure/LV dysfunction: +1\n' +
    '• Hypertension: +1\n' +
    '• Age 65-74 years: +1\n' +
    '• Age ≥75 years: +2\n' +
    '• Diabetes mellitus: +1\n' +
    '• Stroke/TIA/thromboembolism: +2\n' +
    '• Vascular disease: +1\n' +
    '• Female sex: +1 (only if other risk factors present)\n\n' +
    'Score Interpretation and Annual Stroke Risk:\n' +
    '• 0: Low risk (0-0.2% annual stroke risk)\n' +
    '• 1: Low-moderate risk (1.3% annual stroke risk)\n' +
    '• 2: Moderate risk (2.2% annual stroke risk)\n' +
    '• 3: High risk (3.2% annual stroke risk)\n' +
    '• 4: High risk (4.0-5.9% annual stroke risk)\n' +
    '• ≥5: Very high risk (6.7-15.2% annual stroke risk)\n\n' +
    'Recommendations:\n' +
    '• Score 0: No antithrombotic therapy needed\n' +
    '• Score 1: Consider antithrombotic therapy\n' +
    '• Score ≥2: Oral anticoagulation recommended',
  references: [
    'European Heart Journal. 2020 ESC Guidelines for the diagnosis and management of atrial fibrillation.',
    'Chest. 2018;154(5):1121-1201. doi:10.1016/j.chest.2018.07.040',
    'Circulation. 2019;140(2):e125-e151. doi:10.1161/CIR.0000000000000665'
  ],
  resultUnit: 'points'
};

export default cha2ds2VascConfig;
