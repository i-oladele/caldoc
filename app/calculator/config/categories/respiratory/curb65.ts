import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const curb65Config: CalculatorConfig = {
  id: 'curb-65',
  name: 'CURB-65 Score',
  description: 'Assesses severity and need for hospitalization in community-acquired pneumonia.',
  category: 'Respiratory',
  fields: [
    // Confusion
    {
      id: 'confusion',
      type: 'checkbox',
      label: 'Confusion (new disorientation to person/place/time)',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    // Urea
    {
      id: 'urea',
      type: 'number',
      label: 'Blood Urea Nitrogen',
      placeholder: 'Enter BUN (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad',
      min: 0,
      step: 0.1
    },
    // Respiratory rate
    {
      id: 'respiratoryRate',
      type: 'number',
      label: 'Respiratory Rate',
      placeholder: 'Enter breaths/min',
      unit: '/min',
      keyboardType: 'number-pad',
      min: 0
    },
    // Blood pressure
    {
      id: 'systolicBP',
      type: 'number',
      label: 'Systolic BP',
      placeholder: 'Enter SBP (mmHg)',
      unit: 'mmHg',
      keyboardType: 'number-pad',
      min: 0
    },
    {
      id: 'diastolicBP',
      type: 'number',
      label: 'Diastolic BP',
      placeholder: 'Enter DBP (mmHg)',
      unit: 'mmHg',
      keyboardType: 'number-pad',
      min: 0
    },
    // Age
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter age (years)',
      unit: 'years',
      min: 0,
          max: 120
    }
  ],
  validate: (values: { [key: string]: string | boolean | number | undefined }) => {
    const requiredFields = ['urea', 'respiratoryRate', 'systolicBP', 'diastolicBP', 'age'];
    
    for (const field of requiredFields) {
    const value = values[field];
    if (value === '' || value === undefined || value === null) {
      return `Please fill in the ${field} field`;
        }
    }
  
    // Validate numeric ranges
    const numericChecks = [
    { field: 'urea', min: 0, max: 200 },
    { field: 'respiratoryRate', min: 0, max: 60 },
    { field: 'systolicBP', min: 0, max: 300 },
    { field: 'diastolicBP', min: 0, max: 200 },
    { field: 'age', min: 0, max: 120 }
      ];
  
    for (const check of numericChecks) {
    const value = parseFloat(values[check.field] as string);
  if (isNaN(value) || value < check.min || (check.max !== undefined && value > check.max)) {
    return `${check.field} must be between ${check.min} and ${check.max}`;
  }
  }
  
  // Validate SBP > DBP
  const sbp = parseFloat(values.systolicBP as string);
  const dbp = parseFloat(values.diastolicBP as string);
  if (dbp >= sbp) {
    return 'Diastolic BP must be less than systolic BP';
  }
  
  return null;
  },
  calculate: (values: { [key: string]: string | boolean | number | undefined }) => {
    // Calculate score (1 point for each)
    const confusion = values.confusion ? 1 : 0;
      const urea = parseFloat(values.urea as string) > 19 ? 1 : 0; // BUN > 19 mg/dL (7 mmol/L)
      const respiratoryRate = parseFloat(values.respiratoryRate as string) >= 30 ? 1 : 0;
      const bloodPressure = (parseFloat(values.systolicBP as string) < 90 || 
                           parseFloat(values.diastolicBP as string) <= 60) ? 1 : 0;
      const age = parseFloat(values.age as string) >= 65 ? 1 : 0;
  
      const score = confusion + urea + respiratoryRate + bloodPressure + age;
  
      // Determine mortality risk and management
      let mortalityRisk = '';
      let management = '';
      let location = '';
      
      if (score === 0) {
        mortalityRisk = '0.6% 30-day mortality';
        management = 'Consider outpatient treatment';
        location = 'Outpatient';
      } else if (score === 1) {
        mortalityRisk = '3% 30-day mortality';
        management = 'Consider hospital-supervised treatment or short inpatient stay';
        location = 'Hospitalization/Short Stay';
      } else if (score === 2) {
        mortalityRisk = '13% 30-day mortality';
        management = 'Hospitalize for inpatient care';
        location = 'Inpatient Ward';
      } else if (score >= 3) {
        mortalityRisk = '17-40% 30-day mortality';
        management = 'Consider ICU admission';
        location = 'ICU Consideration';
      }
  
      // Additional clinical notes
      const notes = [
        '• Consider comorbidities (e.g., COPD, CHF, DM) which may warrant admission with lower scores.',
        '• Consider social factors (e.g., ability to take oral medications, follow-up).',
        '• In patients with score 0-1, consider pneumonia severity index (PSI) for further risk stratification if needed.',
        '• Always consider clinical judgment over score alone.'
      ].join('\n');
  
      return {
        result: score,
        interpretation: `CURB-65 Score: ${score}/6\n` +
                       `Mortality Risk: ${mortalityRisk}\n` +
                       `Recommended Management: ${management}\n` +
                       `Suggested Location: ${location}\n\n` +
                       `Component Scores:\n` +
                       `• Confusion: ${confusion}\n` +
                       `• Urea >19 mg/dL: ${urea}\n` +
                       `• RR ≥30/min: ${respiratoryRate}\n` +
                       `• BP <90/60 mmHg: ${bloodPressure}\n` +
                       `• Age ≥65: ${age}\n\n` +
                       `Clinical Notes:\n${notes}`
      };
  },
  formula: 'CURB-65 Score Components (1 point each):\n\n' +
           '• C: New onset Confusion (abbreviated mental test score ≤8/10 or new disorientation in person/place/time)\n' +
           '• U: Blood Urea Nitrogen >19 mg/dL (7 mmol/L)\n' +
           '• R: Respiratory rate ≥30 breaths/min\n' +
           '• B: Blood pressure (SBP <90 mmHg or DBP ≤60 mmHg)\n' +
           '• 65: Age ≥65 years\n\n' +
           'Scoring and Mortality Risk:\n' +
           '• 0: 0.6% mortality - Consider outpatient treatment\n' +
           '• 1: 3% mortality - Consider hospital-supervised treatment\n' +
           '• 2: 13% mortality - Hospitalize\n' +
           '• 3-5: 17-40% mortality - Consider ICU admission',
  references: [
    'Lim WS, van der Eerden MM, Laing R, et al. Defining community acquired pneumonia severity on presentation to hospital: an international derivation and validation study. Thorax. 2003;58(5):377-382.',
    'Fine MJ, Auble TE, Yealy DM, et al. A prediction rule to identify low-risk patients with community-acquired pneumonia. N Engl J Med. 1997;336(4):243-250.',
    'Mandell LA, Wunderink RG, Anzueto A, et al. Infectious Diseases Society of America/American Thoracic Society consensus guidelines on the management of community-acquired pneumonia in adults. Clin Infect Dis. 2007;44 Suppl 2:S27-S72.'
  ],
  resultUnit: 'points (0-5)'
};

export default curb65Config;
