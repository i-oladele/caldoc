import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const abiConfig: CalculatorConfig = {
  id: 'abi',
  name: 'Ankle-Brachial Index',
  description: 'Evaluates peripheral arterial disease by comparing ankle and arm blood pressures.',
  category: 'Cardiology',
  fields: [
    // Ankle Pressures (Right and Left)
    {
      id: 'rightAnkleSBP',
      type: 'number',
      label: 'Right Ankle SBP',
      placeholder: 'Enter right ankle SBP (mmHg)',
      unit: 'mmHg',
      keyboardType: 'number-pad',
      min: 0
    },
    {
      id: 'leftAnkleSBP',
      type: 'number',
      label: 'Left Ankle SBP',
      placeholder: 'Enter left ankle SBP (mmHg)',
      unit: 'mmHg',
      keyboardType: 'number-pad',
      min: 0
    },
    // Brachial Pressures (Right and Left)
    {
      id: 'rightArmSBP',
      type: 'number',
      label: 'Right Arm SBP',
      placeholder: 'Enter right arm SBP (mmHg)',
      unit: 'mmHg',
      keyboardType: 'number-pad',
      min: 0
    },
    {
      id: 'leftArmSBP',
      type: 'number',
      label: 'Left Arm SBP',
      placeholder: 'Enter left arm SBP (mmHg)',
      unit: 'mmHg',
      keyboardType: 'number-pad',
      min: 0
    },
    // Symptoms (optional)
    {
      id: 'symptoms',
      type: 'select',
      label: 'Symptoms',
      placeholder: 'Select if applicable',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Leg pain with exercise (claudication)', value: 'claudication' },
        { label: 'Rest pain', value: 'restPain' },
        { label: 'Non-healing wounds', value: 'wounds' },
        { label: 'Other', value: 'other' }
      ]
    }
  ],
  validate: (values: { [key: string]: string | boolean | number | undefined }) => {
    const requiredFields = ['rightAnkleSBP', 'leftAnkleSBP', 'rightArmSBP', 'leftArmSBP'];
    
    for (const field of requiredFields) {
      const value = values[field];
      if (value === '' || value === undefined || value === null) {
        return `Please fill in the ${field} field`;
      }
    }
    
    // Validate numeric ranges (realistic BP ranges)
    const numericChecks = [
      { field: 'rightAnkleSBP', min: 40, max: 300 },
      { field: 'leftAnkleSBP', min: 40, max: 300 },
      { field: 'rightArmSBP', min: 40, max: 300 },
      { field: 'leftArmSBP', min: 40, max: 300 }
    ];
    
    for (const check of numericChecks) {
      const value = parseFloat(values[check.field] as string);
      if (isNaN(value) || value < check.min || value > check.max) {
        return `${check.field} must be between ${check.min} and ${check.max} mmHg`;
      }
    }
    
    return null;
  },
  calculate: (values: { [key: string]: string | boolean | number | undefined }) => {
    // Parse input values
    const rightAnkle = parseFloat(values.rightAnkleSBP as string);
    const leftAnkle = parseFloat(values.leftAnkleSBP as string);
    const rightArm = parseFloat(values.rightArmSBP as string);
    const leftArm = parseFloat(values.leftArmSBP as string);
    const symptoms = values.symptoms as string;
    
    // Calculate ABI for each leg (higher arm pressure is used as denominator)
    const higherArmPressure = Math.max(rightArm, leftArm);
    const rightABI = rightAnkle / higherArmPressure;
    const leftABI = leftAnkle / higherArmPressure;
    
    // Determine interpretation
    const interpretABI = (abi: number, side: string) => {
      let severity = '';
      let recommendation = '';
      
      if (abi > 1.4) {
        severity = 'Non-compressible vessels';
        recommendation = 'Consider arterial calcification (e.g., diabetes, CKD)';
      } else if (abi > 1.0) {
        severity = 'Normal (but may have non-compressible vessels)';
        recommendation = 'Clinical correlation needed';
      } else if (abi >= 0.9) {
        severity = 'Borderline';
        recommendation = 'Mild PAD or early disease';
      } else if (abi >= 0.7) {
        severity = 'Mild to Moderate PAD';
        recommendation = 'Likely claudication';
      } else if (abi >= 0.4) {
        severity = 'Moderate to Severe PAD';
        recommendation = 'May have rest pain';
      } else {
        severity = 'Severe PAD';
        recommendation = 'Critical limb ischemia likely';
      }
      
      return { severity, recommendation };
    };
    
    const rightResult = interpretABI(rightABI, 'right');
    const leftResult = interpretABI(leftABI, 'left');
    
    // Calculate overall ABI (lower of the two)
    const overallABI = Math.min(rightABI, leftABI);
    
    // Overall risk assessment
    let riskAssessment = '';
    if (overallABI > 1.4) {
      riskAssessment = 'Very high risk of cardiovascular events (non-compressible vessels)';
    } else if (overallABI <= 0.9) {
      riskAssessment = 'High risk of cardiovascular events';
    } else {
      riskAssessment = 'Moderate risk of cardiovascular events';
    }
    
    // Additional clinical notes
    const notes = [
      '• ABI ≤0.9 is 95% sensitive for angiographically significant PAD',
      '• ABI >1.4 suggests non-compressible vessels (consider toe-brachial index)',
      '• Consider exercise ABI if symptoms suggest claudication but resting ABI is normal',
      '• ABI should be interpreted in clinical context with symptoms and other risk factors'
    ].join('\n');
    
    return {
      result: overallABI,
      interpretation: `Ankle-Brachial Index (ABI):\n` +
                     `• Right ABI: ${rightABI.toFixed(2)} (${rightResult.severity})\n` +
                     `• Left ABI: ${leftABI.toFixed(2)} (${leftResult.severity})\n\n` +
                     `Overall Interpretation:\n` +
                     `• ${riskAssessment}\n` +
                     `• Right Leg: ${rightResult.recommendation}\n` +
                     `• Left Leg: ${leftResult.recommendation}\n\n` +
                     `Clinical Notes:\n${notes}`
    };
  },
  formula: 'ABI = Highest Ankle Pressure / Highest Arm Pressure\n\n' +
           'Interpretation:\n' +
           '• >1.4: Non-compressible vessels (consider arterial calcification)\n' +
           '• 1.0-1.4: Normal\n' +
           '• 0.9-1.0: Borderline\n' +
           '• 0.7-0.9: Mild to Moderate PAD\n' +
           '• 0.4-0.7: Moderate to Severe PAD\n' +
           '• <0.4: Severe PAD/Critical Limb Ischemia\n\n' +
           'Procedure Notes:\n' +
           '1. Patient rests supine for 5-10 minutes before measurement\n' +
           '2. Measure SBP in both arms and both ankles (dorsalis pedis and posterior tibial arteries)\n' +
           '3. Use the higher of the two ankle pressures for each leg\n' +
           '4. Use the higher of the two arm pressures as the denominator',
  references: [
    'Aboyans V, et al. 2017 ESC Guidelines on the Diagnosis and Treatment of Peripheral Arterial Diseases. Eur Heart J. 2018;39(9):763-816.',
    'Gerhard-Herman MD, et al. 2016 AHA/ACC Guideline on the Management of Patients With Lower Extremity Peripheral Artery Disease. Circulation. 2017;135(12):e726-e779.',
    'Hirsch AT, et al. ACC/AHA Guidelines for the Management of Patients with Peripheral Arterial Disease. J Am Coll Cardiol. 2006;47(6):1239-1312.'
  ],
  resultUnit: 'ratio (dimensionless)'
};

export default abiConfig;
