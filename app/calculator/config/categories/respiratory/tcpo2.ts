import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const tcpo2Config: CalculatorConfig = {
  id: 'tcpo2',
  name: 'Transcutaneous Oxygen Measurement (TcPO2)',
  description: 'Estimates oxygen levels through the skin.',
  category: 'Respiratory',
  fields: [
    // Required inputs
    {
      id: 'pao2',
      type: 'number',
      label: 'Arterial Oxygen (PaO₂)',
      placeholder: 'Enter PaO₂ (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad',
      min: 0,
      step: 0.1
    },
    // Optional inputs for enhanced interpretation
    {
      id: 'patientAge',
      type: 'number',
      label: 'Patient Age',
      placeholder: 'Enter age (years)',
      unit: 'years',
      keyboardType: 'number-pad',
      min: 0,
      max: 120,
      required: false
    },
    {
      id: 'temperature',
      type: 'number',
      label: 'Skin Temperature',
      placeholder: 'Enter temperature (°C)',
      unit: '°C',
      keyboardType: 'decimal-pad',
      min: 20,
      max: 45,
      step: 0.1,
      required: false
    },
    {
      id: 'location',
      type: 'select',
      label: 'Measurement Location',
      placeholder: 'Select measurement site',
      options: [
        { label: 'Chest (standard)', value: 'chest' },
        { label: 'Arm', value: 'arm' },
        { label: 'Thigh', value: 'thigh' },
        { label: 'Calf', value: 'calf' },
        { label: 'Foot', value: 'foot' },
        { label: 'Other', value: 'other' }
      ],
      required: false
    },
    {
      id: 'clinicalCondition',
      type: 'select',
      label: 'Clinical Condition',
      placeholder: 'Select if applicable',
      options: [
        { label: 'None (baseline)', value: 'none' },
        { label: 'Chronic Wound', value: 'wound' },
        { label: 'Critical Limb Ischemia', value: 'cli' },
        { label: 'Diabetes', value: 'diabetes' },
        { label: 'Peripheral Artery Disease', value: 'pad' },
        { label: 'Smoker', value: 'smoker' }
      ],
      required: false
    }
  ],
  validate: (values: { [key: string]: string | boolean | number | undefined }) => {
    // Required fields
    if (!values.pao2) {
      return 'Please enter PaO₂ value';
    }

    // Validate numeric ranges
    const pao2 = parseFloat(values.pao2 as string);
    if (isNaN(pao2) || pao2 < 0) {
      return 'PaO₂ must be a positive number';
    }

    if (values.patientAge) {
      const age = parseFloat(values.patientAge as string);
      if (isNaN(age) || age < 0 || age > 120) {
        return 'Age must be between 0 and 120 years';
      }
    }

    if (values.temperature) {
      const temp = parseFloat(values.temperature as string);
      if (isNaN(temp) || temp < 20 || temp > 45) {
        return 'Temperature must be between 20°C and 45°C';
      }
    }

    return null;
  },
  calculate: (values: { [key: string]: string | boolean | number | undefined }) => {
    // Parse input values
    const pao2 = parseFloat(values.pao2 as string);
    const age = values.patientAge ? parseInt(values.patientAge as string) : 40; // Default to 40 if not provided
    const temp = values.temperature ? parseFloat(values.temperature as string) : 37; // Default to 37°C if not provided
    const location = values.location as string || 'chest';
    const condition = values.clinicalCondition as string || 'none';
    
    // Calculate expected TcPO2 (typically 10-20 mmHg lower than PaO2 in healthy adults)
    let tcpO2 = pao2 * 0.85; // Base estimation (85% of PaO2)
    
    // Adjust for age (TcPO2 decreases with age)
    const ageAdjustment = (age - 40) * -0.15; // Decrease by 0.15 mmHg per year over 40
    tcpO2 += ageAdjustment;
    
    // Adjust for temperature (TcPO2 increases with temperature)
    const tempAdjustment = (temp - 37) * 2.5; // Increase by ~2.5 mmHg per °C > 37°C
    tcpO2 += tempAdjustment;
    
    // Adjust for measurement location
    const locationAdjustments: { [key: string]: number } = {
      'chest': 0,
      'arm': -5,
      'thigh': -10,
      'calf': -15,
      'foot': -20,
      'other': -10
    };
    tcpO2 += locationAdjustments[location] || 0;
    
    // Adjust for clinical conditions
    const conditionAdjustments: { [key: string]: number } = {
      'none': 0,
      'wound': -10,
      'cli': -20,
      'diabetes': -15,
      'pad': -25,
      'smoker': -5
    };
    tcpO2 += conditionAdjustments[condition] || 0;
    
    // Ensure TcPO2 doesn't exceed PaO2
    tcpO2 = Math.min(tcpO2, pao2);
    
    // Determine interpretation
    let interpretation = '';
    let woundHealingPotential = '';
    
    if (tcpO2 >= 50) {
      interpretation = 'Normal tissue oxygenation';
      woundHealingPotential = 'Excellent';
    } else if (tcpO2 >= 40) {
      interpretation = 'Mild tissue hypoxia';
      woundHealingPotential = 'Good';
    } else if (tcpO2 >= 30) {
      interpretation = 'Moderate tissue hypoxia';
      woundHealingPotential = 'Possible, but may be delayed';
    } else if (tcpO2 >= 20) {
      interpretation = 'Severe tissue hypoxia';
      woundHealingPotential = 'Unlikely without intervention';
    } else {
      interpretation = 'Critical tissue hypoxia';
      woundHealingPotential = 'Very poor - revascularization likely needed';
    }
    
    // Clinical notes
    const notes = [
      '• Normal TcPO₂ is typically 10-20 mmHg lower than PaO₂',
      '• Values <30 mmHg suggest compromised tissue oxygenation',
      '• Values <20 mmHg indicate critical ischemia',
      '• Always interpret in clinical context with other assessments',
      `• Measurement site: ${location.charAt(0).toUpperCase() + location.slice(1)}`,
      condition !== 'none' ? `• Clinical factor: ${condition.charAt(0).toUpperCase() + condition.slice(1)}` : ''
    ].filter(Boolean).join('\n');
    
    return {
      result: tcpO2,
      interpretation: `Estimated TcPO₂: ${tcpO2.toFixed(1)} mmHg\n` +
                     `Interpretation: ${interpretation}\n` +
                     `Wound Healing Potential: ${woundHealingPotential}\n\n` +
                     `Input Parameters:\n` +
                     `• PaO₂: ${pao2} mmHg\n` +
                     `• Age: ${age} years\n` +
                     `• Skin Temperature: ${temp}°C\n\n` +
                     `Clinical Notes:\n${notes}`
    };
  },
  formula: 'Estimated TcPO₂ Calculation:\n\n' +
           'Base estimation:\n' +
           'TcPO₂ ≈ 0.85 × PaO₂\n\n' +
           'Adjustments:\n' +
           '• Age: -0.15 mmHg per year over 40\n' +
           '• Temperature: +2.5 mmHg per °C > 37°C\n\n' +
           'Location Adjustments:\n' +
           '• Chest: +0 mmHg (reference)\n' +
           '• Arm: -5 mmHg\n' +
           '• Thigh: -10 mmHg\n' +
           '• Calf: -15 mmHg\n' +
           '• Foot: -20 mmHg\n\n' +
           'Clinical Condition Adjustments:\n' +
           '• Chronic Wound: -10 mmHg\n' +
           '• Critical Limb Ischemia: -20 mmHg\n' +
           '• Diabetes: -15 mmHg\n' +
           '• PAD: -25 mmHg\n' +
           '• Smoker: -5 mmHg',
  references: [
    'Hauser CJ, Shoemaker WC. Use of a transcutaneous PO2 regional perfusion index to quantify tissue perfusion in peripheral vascular disease. Ann Surg. 1983;197(3):337-343.',
    'Fife CE, Buyukcakir C, Otto GH, et al. The predictive value of transcutaneous oxygen tension measurement in diabetic lower extremity wounds treated with hyperbaric oxygen therapy: a retrospective analysis of 1,144 patients. Wound Repair Regen. 2002;10(4):198-207.',
    'Kalani M, Brismar K, Fagrell B, et al. Transcutaneous oxygen tension and toe blood pressure as predictors for outcome of diabetic foot ulcers. Diabetes Care. 1999;22(1):147-151.'
  ],
  resultUnit: 'mmHg'
};

export default tcpo2Config;
