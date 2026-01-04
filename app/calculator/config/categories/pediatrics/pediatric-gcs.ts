import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const pediatricGcsConfig: CalculatorConfig = {
  id: 'pediatric-gcs',
  name: 'Pediatric Glasgow Coma Scale',
  description: 'Modified GCS adapted for children, particularly those under 2 years old.',
  category: 'Pediatrics',
  fields: [
    {
      id: 'eyeOpening',
      type: 'select',
      label: 'Eye Opening',
      options: [
        { label: '4 - Spontaneous', value: '4' },
        { label: '3 - To voice', value: '3' },
        { label: '2 - To pain', value: '2' },
        { label: '1 - None', value: '1' }
      ],
      required: true
    },
    {
      id: 'verbalResponse',
      type: 'select',
      label: 'Verbal Response',
      placeholder: 'Verbal Response',
      options: [
        { label: '5 - Coos, babbles (normal activity)', value: '5' },
        { label: '4 - Irritable cry', value: '4' },
        { label: '3 - Cries to pain', value: '3' },
        { label: '2 - Moans to pain', value: '2' },
        { label: '1 - None', value: '1' }
      ],
      required: true
    },
    {
      id: 'motorResponse',
      type: 'select',
      label: 'Motor Response',
      options: [
        { label: '6 - Normal spontaneous movements (obeys commands if verbal)', value: '6' },
        { label: '5 - Localizes to pain', value: '5' },
        { label: '4 - Withdraws from pain', value: '4' },
        { label: '3 - Abnormal flexion (decorticate)', value: '3' },
        { label: '2 - Abnormal extension (decerebrate)', value: '2' },
        { label: '1 - None', value: '1' }
      ],
      required: true
    },
  ],
  validate: (values) => {
    if (!values.eyeOpening) return 'Please select an Eye Opening score';
    if (!values.verbalResponse) return 'Please select a Verbal Response score';
    if (!values.motorResponse) return 'Please select a Motor Response score';
    return null;
  },
  calculate: (values: Record<string, string | boolean>) => {
    const eyeScore = parseInt(values.eyeOpening as string);
    const verbalScore = parseInt(values.verbalResponse as string);
    const motorScore = parseInt(values.motorResponse as string);
    const totalScore = eyeScore + verbalScore + motorScore;
    
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (totalScore <= 8) {
      interpretation = 'Severe brain injury';
      status = 'danger';
    } else if (totalScore <= 12) {
      interpretation = 'Moderate brain injury';
      status = 'warning';
    } else {
      interpretation = 'Minor brain injury';
      status = 'success';
    }
    
    return {
      result: totalScore,
      status,
      interpretation: `${interpretation} (${totalScore}/15)`,
      resultDetails: [
        { label: 'Eye Opening', value: eyeScore.toString() },
        { label: 'Verbal Response', value: verbalScore.toString() },
        { label: 'Motor Response', value: motorScore.toString() },
        { label: 'Total GCS', value: totalScore.toString(), status }
      ]
    };
  },
  formula: 'Pediatric GCS = Eye Opening + Verbal Response + Motor Response\n\nScoring:\n\nEye Opening (1-4):\n4 - Spontaneous\n3 - To voice\n2 - To pain\n1 - None\n\nVerbal Response (1-5 for infants):\n5 - Coos, babbles (normal activity)\n4 - Irritable cry\n3 - Cries to pain\n2 - Moans to pain\n1 - None\n\nMotor Response (1-6):\n6 - Normal spontaneous movements\n5 - Localizes to pain\n4 - Withdraws from pain\n3 - Abnormal flexion (decorticate)\n2 - Abnormal extension (decerebrate)\n1 - None',
  references: [
    'Reilly PL, Simpson DA, Sprod R, Thomas L. Assessing the conscious level in infants and young children: a paediatric version of the Glasgow Coma Scale. Childs Nerv Syst. 1988;4(1):30-33.',
    'Holmes JF, Palchak MJ, MacFarlane T, Kuppermann N. Performance of the pediatric Glasgow coma scale in children with blunt head trauma. Acad Emerg Med. 2005;12(9):814-819.'
  ],
  resultUnit: 'points'
};
