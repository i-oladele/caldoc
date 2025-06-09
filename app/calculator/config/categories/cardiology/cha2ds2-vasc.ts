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
      id: 'age75Plus',
      type: 'checkbox',
      label: 'Age ≥75 years',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
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
      id: 'age65to74',
      type: 'checkbox',
      label: 'Age 65-74 years',
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
    // No specific validation needed for checkboxes
    return null;
  },
  calculate: (values: { [key: string]: string | boolean }) => {
    let score = 0;
    const riskFactors = {
      congestiveHF: 1,
      hypertension: 1,
      age75Plus: 2,
      diabetes: 1,
      strokeTIA: 2,
      vascularDisease: 1,
      age65to74: 1,
      female: 1
    };

    // Calculate score based on checked boxes
    Object.entries(riskFactors).forEach(([key, points]) => {
      if (values[key] === true) {
        score += points;
      }
    });

    // Special case for female sex (only counts if other risk factors present)
    if (values.female === true && score === 1) {
      // If female is the only risk factor, it doesn't count
      if (values.age65to74 !== true) {
        score = 0;
      }
    }

    // Determine risk level and recommendation
    let interpretation = '';
    let recommendation = '';

    if (score === 0) {
      interpretation = 'Low risk';
      recommendation = 'No antithrombotic therapy';
    } else if (score === 1) {
      interpretation = 'Low-moderate risk';
      recommendation = 'Consider antithrombotic therapy (oral anticoagulation or antiplatelet therapy)';
    } else {
      interpretation = 'High risk';
      recommendation = 'Oral anticoagulation recommended (e.g., warfarin, DOAC)';
    }

    return {
      result: score,
      interpretation: `CHA2DS2-VASc Score: ${score} - ${interpretation}. ${recommendation}`
    };
  },
  formula: 'CHA2DS2-VASc Score:\n' +
    '• Congestive heart failure/LV dysfunction: +1\n' +
    '• Hypertension: +1\n' +
    '• Age ≥75 years: +2\n' +
    '• Diabetes mellitus: +1\n' +
    '• Stroke/TIA/thromboembolism: +2\n' +
    '• Vascular disease: +1\n' +
    '• Age 65-74 years: +1\n' +
    '• Female sex: +1 (only if other risk factors present)',
  references: [
    'European Heart Journal. 2020 ESC Guidelines for the diagnosis and management of atrial fibrillation.',
    'Chest. 2018;154(5):1121-1201. doi:10.1016/j.chest.2018.07.040',
    'Circulation. 2019;140(2):e125-e151. doi:10.1161/CIR.0000000000000665'
  ],
  resultUnit: 'points'
};

export default cha2ds2VascConfig;
