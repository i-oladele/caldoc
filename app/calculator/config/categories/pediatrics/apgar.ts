import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const apgarConfig: CalculatorConfig = {
  id: 'apgar',
  name: 'APGAR Score',
  description: 'Evaluates the health of newborns based on appearance, pulse, grimace, activity, and respiration.',
  category: 'pediatrics',
  fields: [
    {
      id: 'appearance',
      label: 'Appearance (Skin Color)',
      type: 'radio',
      options: [
        { label: '0: Bluish-gray or pale all over', value: '0' },
        { label: '1: Normal color (hands/feet bluish)', value: '1' },
        { label: '2: Normal color all over', value: '2' }
      ],
      value: '2',
      placeholder: 'Select appearance score',
      required: true
    },
    {
      id: 'pulse',
      label: 'Pulse (Heart Rate)',
      type: 'radio',
      options: [
        { label: '0: Absent (no pulse)', value: '0' },
        { label: '1: Below 100 bpm', value: '1' },
        { label: '2: Normal (>100 bpm)', value: '2' }
      ],
      value: '2',
      placeholder: 'Select pulse score',
      required: true
    },
    {
      id: 'grimace',
      label: 'Grimace (Reflex Irritability)',
      type: 'radio',
      options: [
        { label: '0: No response', value: '0' },
        { label: '1: Grimace/weak cry', value: '1' },
        { label: '2: Pulls away/sneezes/coughs', value: '2' }
      ],
      value: '2',
      placeholder: 'Select grimace score',
      required: true
    },
    {
      id: 'activity',
      label: 'Activity (Muscle Tone)',
      type: 'radio',
      options: [
        { label: '0: Limp/floppy', value: '0' },
        { label: '1: Some flexion', value: '1' },
        { label: '2: Active movement', value: '2' }
      ],
      value: '2',
      placeholder: 'Select activity score',
      required: true
    },
    {
      id: 'respiration',
      label: 'Respiration (Breathing Effort)',
      type: 'radio',
      options: [
        { label: '0: Absent breathing', value: '0' },
        { label: '1: Weak/irregular', value: '1' },
        { label: '2: Good cry', value: '2' }
      ],
      value: '2',
      placeholder: 'Select respiration score',
      required: true
    }
  ],
  validate: (values) => {
    const fields = ['appearance', 'pulse', 'grimace', 'activity', 'respiration'];
    for (const field of fields) {
      const score = parseInt(values[field] || '');
      if (isNaN(score) || score < 0 || score > 2) {
        return `Please select a score for ${field}`;
      }
    }
    return null;
  },
  calculate: (values) => {
    const totalScore = ['appearance', 'pulse', 'grimace', 'activity', 'respiration']
      .reduce((sum, field) => sum + parseInt(values[field] || '0'), 0);
    
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (totalScore <= 3) {
      interpretation = 'Severely depressed - Requires immediate resuscitation';
      status = 'danger';
    } else if (totalScore <= 6) {
      interpretation = 'Moderately depressed - May need some resuscitation';
      status = 'warning';
    } else {
      interpretation = 'Normal - Routine care';
      status = 'success';
    }
    
    return {
      result: totalScore,
      interpretation: `APGAR Score: ${totalScore}/10\n${interpretation}`,
      status
    };
  },
  formula: `APGAR Score = Appearance + Pulse + Grimace + Activity + Respiration

Scoring Criteria (0-2 points each):
- Appearance (Skin Color)
  - 2: Normal color all over (hands and feet pink)
  - 1: Normal color (but hands and feet bluish)
  - 0: Bluish-gray or pale all over

- Pulse (Heart Rate)
  - 2: Normal (above 100 beats per minute)
  - 1: Below 100 beats per minute
  - 0: Absent (no pulse)

- Grimace (Reflex Irritability)
  - 2: Pulls away, sneezes, or coughs with stimulation
  - 1: Grimace or weak cry with stimulation
  - 0: No response to stimulation

- Activity (Muscle Tone)
  - 2: Active, spontaneous movement
  - 1: Arms and legs flexed with little movement
  - 0: Limp or floppy

- Respiration (Breathing Effort)
  - 2: Normal rate and effort, good cry
  - 1: Slow or irregular breathing, weak cry
  - 0: Absent breathing

Total Score: 0-10
- 7-10: Normal
- 4-6: Moderately depressed
- 0-3: Severely depressed`,
  references: [
    'Pediatrics. Neonatal Assessment.',
    'American Academy of Pediatrics. APGAR Score.',
    'Journal of Perinatology. Neonatal Resuscitation.'
  ],
  resultUnit: 'points'
};

export default apgarConfig;