import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const gcsConfig: CalculatorConfig = {
  id: 'gcs',
  name: 'Glasgow Coma Scale (GCS)',
  description: 'Assesses the level of consciousness in patients with acute medical or trauma conditions.',
  category: 'neurology',
  fields: [
    {
      id: 'eyeOpening',
      label: 'Eye Opening (E)',
      type: 'select',
      placeholder: 'Select eye opening response',
      options: [
        { label: '4 - Spontaneous', value: '4' },
        { label: '3 - To speech', value: '3' },
        { label: '2 - To pain', value: '2' },
        { label: '1 - None', value: '1' }
      ],
      required: true
    },
    {
      id: 'verbalResponse',
      label: 'Verbal Response (V)',
      type: 'select',
      placeholder: 'Select verbal response',
      options: [
        { label: '5 - Oriented', value: '5' },
        { label: '4 - Confused', value: '4' },
        { label: '3 - Inappropriate words', value: '3' },
        { label: '2 - Incomprehensible sounds', value: '2' },
        { label: '1 - None', value: '1' }
      ],
      required: true
    },
    {
      id: 'motorResponse',
      label: 'Motor Response (M)',
      type: 'select',
      placeholder: 'Select motor response',
      options: [
        { label: '6 - Obeys commands', value: '6' },
        { label: '5 - Localizes to pain', value: '5' },
        { label: '4 - Withdraws from pain', value: '4' },
        { label: '3 - Abnormal flexion (decorticate)', value: '3' },
        { label: '2 - Abnormal extension (decerebrate)', value: '2' },
        { label: '1 - None', value: '1' }
      ],
      required: true
    }
  ],
  validate: (values: Record<string, string | boolean>) => {
    if (!values.eyeOpening) return 'Please select an Eye Opening score';
    if (!values.verbalResponse) return 'Please select a Verbal Response score';
    if (!values.motorResponse) return 'Please select a Motor Response score';
    return null;
  },
  calculate: (values: Record<string, string | boolean>) => {
    const eye = parseInt(values.eyeOpening as string);
    const verbal = parseInt(values.verbalResponse as string);
    const motor = parseInt(values.motorResponse as string);
    const score = eye + verbal + motor;
    
    let severity = '';
    let interpretation = '';
    
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (score === 15) {
      severity = 'Normal';
      interpretation = 'Fully conscious and oriented';
      status = 'success';
    } else if (score <= 8) {
      severity = 'Severe';
      interpretation = 'Consider immediate medical intervention and airway protection';
      status = 'danger';
    } else if (score <= 12) {
      severity = 'Moderate';
      interpretation = 'Requires close monitoring and frequent reassessment';
      status = 'warning';
    } else {
      severity = 'Mild';
      interpretation = 'Continue monitoring for any changes in status';
      status = 'warning';
    }
    
    return {
      result: score,
      status,
      interpretation: `${severity} (${score}/15): ${interpretation}`,
      resultDetails: [
        { label: 'Eye Opening', value: eye.toString(), status: 'info' },
        { label: 'Verbal Response', value: verbal.toString(), status: 'info' },
        { label: 'Motor Response', value: motor.toString(), status: 'info' },
        { label: 'Total GCS', value: score.toString(), status }
      ]
    };
  },
  formula: `GCS = Eye Opening (E) + Verbal Response (V) + Motor Response (M)

Scoring System:

Eye Opening (E):
4 - Spontaneous
3 - To speech
2 - To pain
1 - None

Verbal Response (V):
5 - Oriented
4 - Confused
3 - Inappropriate words
2 - Incomprehensible sounds
1 - None

Motor Response (M):
6 - Obeys commands
5 - Localizes to pain
4 - Withdraws from pain
3 - Abnormal flexion (decorticate)
2 - Abnormal extension (decerebrate)
1 - None

Interpretation:
13-15: Mild impairment
9-12: Moderate impairment
≤8: Severe impairment (consider intubation)

Note: The minimum score is 3 (deep coma or death) and the maximum is 15 (fully conscious).`,
  references: [
    'Teasdale G, Jennett B. Assessment of coma and impaired consciousness. Lancet. 1974;2(7872):81-84.',
    'Reith FC, Van den Brande R, Synnot A, et al. The reliability of the Glasgow Coma Scale: a systematic review. Intensive Care Med. 2016;42(1):3-15.',
    'American College of Surgeons. Advanced Trauma Life Support (ATLS) Student Course Manual. 10th ed. Chicago, IL: American College of Surgeons; 2018.'
  ],
  resultUnit: '/15',
};

export default gcsConfig;
