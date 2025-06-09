import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const wellsDVTConfig: CalculatorConfig = {
  id: 'wells-dvt',
  name: 'Wells Score (for DVT)',
  description: 'Estimates probability of deep vein thrombosis.',
  category: 'Hematology',
  fields: [
    {
      id: 'activeCancer',
      type: 'checkbox',
      label: 'Active cancer (treatment within last 6 months or palliative)',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'bedRest',
      type: 'checkbox',
      label: 'Bed rest > 3 days or major surgery within 12 weeks',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'legSwelling',
      type: 'checkbox',
      label: 'Entire leg swelling',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'veinPalpable',
      type: 'checkbox',
      label: 'Calf swelling > 3cm compared to asymptomatic leg',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'pittingEdema',
      type: 'checkbox',
      label: 'Pitting edema (greater in symptomatic leg)',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'collateralVeins',
      type: 'checkbox',
      label: 'Collateral superficial veins (non-varicose)',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'alternativeDiagnosis',
      type: 'checkbox',
      label: 'Alternative diagnosis as likely or more likely than DVT',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    }
  ],
  calculate: (values: { [key: string]: string | boolean }): { result: number; interpretation: string } => {
    let score = 0;
    
    // Add points for each positive finding
    if (values.activeCancer === true) score += 1;
    if (values.bedRest === true) score += 1.5;
    if (values.legSwelling === true) score += 1;
    if (values.veinPalpable === true) score += 1;
    if (values.pittingEdema === true) score += 1;
    if (values.collateralVeins === true) score += 1;
    
    // Subtract point if alternative diagnosis is more likely
    if (values.alternativeDiagnosis === true) score -= 2;
    
    // Determine probability
    let probability = '';
    if (score <= 0) {
      probability = 'Low (DVT unlikely, consider D-dimer test)';
    } else if (score === 1 || score === 2) {
      probability = 'Moderate (Consider D-dimer test or ultrasound)';
    } else {
      probability = 'High (Proceed to ultrasound, consider treatment while awaiting results)';
    }
    
    const baseInterpretation = score <= 1 ? 'DVT unlikely' : 'DVT likely';
    const additionalInfo = 'Clinical judgment should always be used in conjunction with this scoring system.';
    
    return {
      result: score,
      interpretation: `Wells DVT Score: ${score} - ${baseInterpretation}. ${additionalInfo}`
    };
  },
  validate: (values: { [key: string]: string | boolean }) => {
    // No specific validation needed for checkboxes as they default to false
    return null;
  },
  resultUnit: 'points',
  formula: 'Wells Score for DVT:\n' +
    '• Active cancer: +1\n' +
    '• Bed rest > 3 days or major surgery within 12 weeks: +1.5\n' +
    '• Entire leg swelling: +1\n' +
    '• Calf swelling > 3cm: +1\n' +
    '• Pitting edema: +1\n' +
    '• Collateral superficial veins: +1\n' +
    '• Alternative diagnosis as likely or more likely: -2\n\n' +
    'Interpretation:\n' +
    '≤ 0: Low probability (3% risk)\n' +
    '1-2: Moderate probability (17% risk)\n' +
    '≥ 3: High probability (75% risk)',
  references: [
    'Wells PS, Anderson DR, Bormanis J, et al. Value of assessment of pretest probability of deep-vein thrombosis in clinical management. Lancet. 1997;350(9094):1795-1798.',
    'Wells PS, Anderson DR, Rodger M, et al. Evaluation of D-dimer in the diagnosis of suspected deep-vein thrombosis. N Engl J Med. 2003;349(13):1227-1235.',
    'American College of Physicians. Evaluation of patients with suspected acute pulmonary embolism: best practice advice from the Clinical Guidelines Committee of the American College of Physicians. Ann Intern Med. 2015;163(9):701-711.'
  ]
};
