import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const ahiConfig: CalculatorConfig = {
  id: 'ahi',
  name: 'Apnea-Hypopnea Index',
  description: 'Quantifies severity of sleep apnea episodes per hour.',
  category: 'respiratory',
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
    }
  ],
  validate: (values: { [key: string]: string | boolean | number | undefined }): Record<string, string> | null => {
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
        errors.sleepDuration = 'Sleep duration must be greater than 0';
      } else if (sleepDuration > 24) {
        errors.sleepDuration = 'Sleep duration seems unusually long';
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string | boolean | number | undefined }) => {
    // Parse input values
    const totalEvents = parseInt(values.totalEvents as string);
    const sleepDuration = parseFloat(values.sleepDuration as string);
    
    // Calculate AHI (events per hour)
    const ahi = totalEvents / sleepDuration;
    
    // Determine severity and status for color coding
    let severity = '';
    let clinicalImplications = '';
    let treatmentRecommendations = '';
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (ahi < 5) {
      severity = 'Normal';
      clinicalImplications = 'No significant sleep-disordered breathing';
      treatmentRecommendations = 'No treatment needed for sleep apnea';
      status = 'success'; // Green for normal
    } else if (ahi < 15) {
      severity = 'Mild';
      clinicalImplications = 'Mild sleep apnea';
      treatmentRecommendations = 'Lifestyle modifications, positional therapy, consider CPAP if symptomatic';
      status = 'warning'; // Yellow for mild
    } else if (ahi < 30) {
      severity = 'Moderate';
      clinicalImplications = 'Moderate sleep apnea';
      treatmentRecommendations = 'CPAP therapy recommended, weight loss if overweight, avoid alcohol/sedatives';
      status = 'danger'; // Red for moderate
    } else {
      severity = 'Severe';
      clinicalImplications = 'Severe sleep apnea';
      treatmentRecommendations = 'CPAP strongly recommended, consider ENT evaluation, weight management';
      status = 'danger'; // Red for severe
    }
    
    // Common symptoms of sleep apnea
    const commonSymptoms = [
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
      status,
      interpretation: `Apnea-Hypopnea Index (AHI): ${ahi.toFixed(1)} events/hour\n` +
                     `Severity: ${severity} Sleep Apnea\n` +
                     `Clinical Implications: ${clinicalImplications}\n\n` +
                     `Treatment Recommendations:\n${treatmentRecommendations}\n\n` +
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
