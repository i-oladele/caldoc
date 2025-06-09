import { CalculatorConfig } from '../../calculator';

export const childPughConfig: CalculatorConfig = {
  id: 'child-pugh',
  name: 'Liver Function Score (Child-Pugh)',
  description: 'Predicts prognosis in liver cirrhosis patients.',
  category: 'Hepatology',
  resultUnit: 'Class (A/B/C)',
  fields: [
    {
      id: 'bilirubin',
      type: 'number',
      label: 'Bilirubin (mg/dL)',
      placeholder: 'Enter bilirubin level',
      required: true,
      min: 0,
      step: 0.1,
      unit: 'mg/dL'
    },
    {
      id: 'albumin',
      type: 'number',
      label: 'Albumin (g/dL)',
      placeholder: 'Enter albumin level',
      required: true,
      min: 0,
      step: 0.1,
      unit: 'g/dL'
    },
    {
      id: 'inr',
      type: 'number',
      label: 'INR',
      placeholder: 'Enter INR',
      required: true,
      min: 0.1,
      step: 0.01,
      unit: ''
    },
    {
      id: 'ascites',
      type: 'select',
      label: 'Ascites',
      required: true,
      options: [
        { value: 'none', label: 'None' },
        { value: 'mild', label: 'Mild' },
        { value: 'moderate', label: 'Moderate to Severe' }
      ]
    },
    {
      id: 'encephalopathy',
      type: 'select',
      label: 'Hepatic Encephalopathy',
      required: true,
      options: [
        { value: 'none', label: 'None' },
        { value: 'grade1-2', label: 'Grade 1-2' },
        { value: 'grade3-4', label: 'Grade 3-4' }
      ]
    }
  ],
  validate: (values) => {
    const errors: Record<string, string> = {};
    if (!values.bilirubin) errors.bilirubin = 'Bilirubin is required';
    if (!values.albumin) errors.albumin = 'Albumin is required';
    if (!values.inr) errors.inr = 'INR is required';
    if (!values.ascites) errors.ascites = 'Ascites status is required';
    if (!values.encephalopathy) errors.encephalopathy = 'Encephalopathy status is required';
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values) => {
    let score = 0;
    
    // Bilirubin scoring
    const bilirubin = parseFloat(values.bilirubin);
    if (bilirubin < 2) score += 1;
    else if (bilirubin >= 2 && bilirubin <= 3) score += 2;
    else score += 3;
    
    // Albumin scoring
    const albumin = parseFloat(values.albumin);
    if (albumin > 3.5) score += 1;
    else if (albumin >= 2.8 && albumin <= 3.5) score += 2;
    else score += 3;
    
    // INR scoring
    const inr = parseFloat(values.inr);
    if (inr < 1.7) score += 1;
    else if (inr >= 1.7 && inr <= 2.3) score += 2;
    else score += 3;
    
    // Ascites scoring
    if (values.ascites === 'mild') score += 2;
    else if (values.ascites === 'moderate') score += 3;
    else score += 1;
    
    // Encephalopathy scoring
    if (values.encephalopathy === 'grade1-2') score += 2;
    else if (values.encephalopathy === 'grade3-4') score += 3;
    else score += 1;
    
    // Determine class
    let classification = '';
    if (score <= 6) classification = 'A';
    else if (score <= 9) classification = 'B';
    else classification = 'C';
    
    return {
      result: score,  // Return the numeric score as the result
      interpretation: `Child-Pugh Class ${classification} (Score: ${score}/15). ${getInterpretation(classification)}`
    };
  },
  formula: 'Child-Pugh Score = Sum of points from 5 parameters\n\n' +
           'Parameters:\n' +
           '• Bilirubin (mg/dL): <2=1, 2-3=2, >3=3\n' +
           '• Albumin (g/dL): >3.5=1, 2.8-3.5=2, <2.8=3\n' +
           '• INR: <1.7=1, 1.7-2.3=2, >2.3=3\n' +
           '• Ascites: None=1, Mild=2, Moderate-Severe=3\n' +
           '• Encephalopathy: None=1, Grade 1-2=2, Grade 3-4=3\n\n' +
           'Classification:\n' +
           '• Class A: 5-6 points (1-year survival ~100%)\n' +
           '• Class B: 7-9 points (1-year survival ~80%)\n' +
           '• Class C: 10-15 points (1-year survival ~45%)',
  references: [
    'Pugh RN, Murray-Lyon IM, Dawson JL, et al. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg. 1973;60(8):646-649.',
    'Child CG, Turcotte JG. Surgery and portal hypertension. Major Probl Clin Surg. 1964;1:1-85.'
  ]
};

function getInterpretation(classification: string): string {
  switch(classification) {
    case 'A':
      return 'Well-compensated disease';
    case 'B':
      return 'Significant functional compromise';
    case 'C':
      return 'Decompensated disease';
    default:
      return 'Unable to determine';
  }
}
