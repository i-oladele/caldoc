import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const ahiConfig: CalculatorConfig = {
  id: 'ahi',
  name: 'Apnea-Hypopnea Index',
  description: 'Quantifies severity of sleep apnea episodes per hour.',
  category: 'Respiratory',
  fields: [
    // Required inputs
    {
      id: 'totalEvents',
      type: 'number',
      label: 'Total Apnea/Hypopnea Events',
      placeholder: 'Enter total number of events',
      unit: 'events',
      keyboardType: 'number-pad',
      min: 0
    },
    {
      id: 'sleepDuration',
      type: 'number',
      label: 'Total Sleep Time',
      placeholder: 'Enter sleep duration (hours)',
      unit: 'hours',
      keyboardType: 'decimal-pad',
      min: 0.1,
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
      id: 'sex',
      type: 'select',
      label: 'Sex',
      placeholder: 'Select sex',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other/Prefer not to say', value: 'other' }
      ],
      required: false
    },
    {
      id: 'bmi',
      type: 'number',
      label: 'BMI',
      placeholder: 'Enter BMI (optional)',
      unit: 'kg/m²',
      keyboardType: 'decimal-pad',
      min: 10,
      max: 70,
      step: 0.1,
      required: false
    },
    {
      id: 'symptoms',
      type: 'checkbox',
      label: 'Symptoms',
      placeholder: 'Select all that apply',
      options: [
        { label: 'Excessive Daytime Sleepiness', value: 'sleepiness' },
        { label: 'Loud Snoring', value: 'snoring' },
        { label: 'Witnessed Apneas', value: 'apneas' },
        { label: 'Morning Headaches', value: 'headaches' },
        { label: 'Nocturia', value: 'nocturia' },
        { label: 'Impaired Concentration', value: 'concentration' },
        { label: 'Irritability', value: 'irritability' }
      ],
      required: false
    }
  ],
  validate: (values: { [key: string]: string | boolean | number | undefined }) => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!values.totalEvents) {
      errors.totalEvents = 'Please enter total number of events';
    }
    if (!values.sleepDuration) {
      errors.sleepDuration = 'Please enter total sleep time';
    }

    // Validate numeric ranges
    if (values.totalEvents) {
      const totalEvents = parseInt(values.totalEvents as string);
      if (isNaN(totalEvents) || totalEvents < 0) {
        errors.totalEvents = 'Total events must be a positive number';
      }
    }

    if (values.sleepDuration) {
      const sleepDuration = parseFloat(values.sleepDuration as string);
      if (isNaN(sleepDuration) || sleepDuration <= 0) {
        errors.sleepDuration = 'Sleep duration must be greater than 0 hours';
      } else if (sleepDuration > 24) {
        errors.sleepDuration = 'Sleep duration cannot exceed 24 hours';
      }
    }

    // Validate optional fields if provided
    if (values.patientAge) {
      const age = parseInt(values.patientAge as string);
      if (isNaN(age) || age < 0 || age > 120) {
        errors.patientAge = 'Age must be between 0 and 120 years';
      }
    }

    if (values.bmi) {
      const bmi = parseFloat(values.bmi as string);
      if (isNaN(bmi) || bmi < 10 || bmi > 70) {
        errors.bmi = 'BMI must be between 10 and 70 kg/m²';
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string | boolean | number | undefined }) => {
    // Parse input values
    const totalEvents = parseInt(values.totalEvents as string);
    const sleepDuration = parseFloat(values.sleepDuration as string);
    const age = values.patientAge ? parseInt(values.patientAge as string) : 40; // Default to 40 if not provided
    const sex = values.sex as string || 'male'; // Default to male if not provided
    const bmi = values.bmi ? parseFloat(values.bmi as string) : 25; // Default to 25 if not provided
    const symptoms = Array.isArray(values.symptoms) 
      ? values.symptoms as string[]
      : values.symptoms ? [values.symptoms.toString()] : [];
    
    // Calculate AHI (events per hour)
    const ahi = totalEvents / sleepDuration;
    
    // Determine severity
    let severity = '';
    let clinicalImplications = '';
    let treatmentRecommendations = '';
    
    if (ahi < 5) {
      severity = 'Normal';
      clinicalImplications = 'No significant sleep-disordered breathing';
      treatmentRecommendations = 'No treatment needed for sleep apnea';
    } else if (ahi < 15) {
      severity = 'Mild';
      clinicalImplications = 'Mild sleep apnea';
      treatmentRecommendations = 'Lifestyle modifications, positional therapy, consider CPAP if symptomatic';
    } else if (ahi < 30) {
      severity = 'Moderate';
      clinicalImplications = 'Moderate sleep apnea';
      treatmentRecommendations = 'CPAP therapy recommended, weight loss if overweight, avoid alcohol/sedatives';
    } else {
      severity = 'Severe';
      clinicalImplications = 'Severe sleep apnea';
      treatmentRecommendations = 'CPAP strongly recommended, consider ENT evaluation, weight management';
    }
    
    // Additional risk factors
    const riskFactors = [];
    if (bmi >= 30) riskFactors.push(`• BMI ≥30 (${bmi.toFixed(1)} kg/m²) - Major risk factor`);
    if (age > 50) riskFactors.push(`• Age >50 years (${age} years)`);
    if (sex === 'male') riskFactors.push('• Male sex (2-3x higher risk)');
    if (symptoms.includes('snoring')) riskFactors.push('• Loud snoring (common symptom)');
    if (symptoms.includes('apneas')) riskFactors.push('• Witnessed apneas (highly specific)');
    
    // Common symptoms
    const commonSymptoms = [
      'Common symptoms include:',
      '• Excessive daytime sleepiness',
      '• Loud snoring',
      '• Witnessed breathing pauses',
      '• Gasping/choking at night',
      '• Morning headaches',
      '• Difficulty concentrating',
      '• Mood changes',
      '• High blood pressure',
      '• Decreased libido'
    ];
    
    // Clinical notes
    const notes = [
      '• AHI ≥5 with symptoms or AHI ≥15 regardless of symptoms is diagnostic for OSA',
      '• Severe OSA (AHI ≥30) is associated with increased cardiovascular risk',
      '• Consider sleep study for patients with symptoms and multiple risk factors',
      '• CPAP is first-line treatment for moderate to severe OSA',
      '• Weight loss of 10% can reduce AHI by 26% in obese patients'
    ];
    
    return {
      result: ahi,
      interpretation: `Apnea-Hypopnea Index (AHI): ${ahi.toFixed(1)} events/hour\n` +
                     `Severity: ${severity} Sleep Apnea\n` +
                     `Clinical Implications: ${clinicalImplications}\n\n` +
                     `Treatment Recommendations:\n${treatmentRecommendations}\n\n` +
                     (riskFactors.length > 0 ? `Patient Risk Factors:\n${riskFactors.join('\n')}\n\n` : '') +
                     `Clinical Notes:\n${notes.join('\n')}\n\n` +
                     `Common Symptoms of Sleep Apnea:\n${commonSymptoms.join('\n')}`
    };
  },
  formula: 'Apnea-Hypopnea Index (AHI) Calculation:\n\n' +
           'AHI = (Total Number of Apneas + Hypopneas) / Total Sleep Time (hours)\n\n' +
           'Event Definitions:\n' +
           '• Apnea: ≥90% drop in airflow for ≥10 seconds\n' +
           '• Hypopnea: ≥30% drop in airflow for ≥10 seconds with ≥3% oxygen desaturation or arousal\n\n' +
           'Severity Classification:\n' +
           '• Normal: <5 events/hour\n' +
           '• Mild: 5-14.9 events/hour\n' +
           '• Moderate: 15-29.9 events/hour\n' +
           '• Severe: ≥30 events/hour\n\n' +
           'Key Risk Factors:\n' +
           '• Obesity (BMI ≥30 kg/m²)\n' +
           '• Male sex\n' +
           '• Age >50 years\n' +
           '• Neck circumference >17" (men) or >16" (women)\n' +
           '• Family history of sleep apnea\n' +
           '• Alcohol/sedative use\n' +
           '• Smoking\n' +
           '• Nasal congestion',
  references: [
    'Epstein LJ, Kristo D, Strollo PJ Jr, et al. Clinical guideline for the evaluation, management and long-term care of obstructive sleep apnea in adults. J Clin Sleep Med. 2009;5(3):263-276.',
    'American Academy of Sleep Medicine. International Classification of Sleep Disorders. 3rd ed. Darien, IL: American Academy of Sleep Medicine; 2014.',
    'Peppard PE, Young T, Barnet JH, et al. Increased prevalence of sleep-disordered breathing in adults. Am J Epidemiol. 2013;177(9):1006-1014.'
  ],
  resultUnit: 'events/hour'
};

export default ahiConfig;
