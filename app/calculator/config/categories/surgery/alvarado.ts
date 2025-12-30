import { CalculationStatus, CalculatorConfig } from '@/app/calculator/config/calculator';

export const alvaradoConfig: CalculatorConfig = {
  id: 'alvarado',
  name: 'Alvarado Score',
  description: 'Predicts likelihood of appendicitis based on symptoms and signs.',
  category: 'Surgery',
  fields: [
    // Symptoms
    {
      id: 'migratoryPain',
      type: 'checkbox',
      label: 'Migratory pain to RLQ',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'anorexia',
      type: 'checkbox',
      label: 'Anorexia',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'nauseaVomiting',
      type: 'checkbox',
      label: 'Nausea/Vomiting',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    // Signs
    {
      id: 'tendernessRLQ',
      type: 'checkbox',
      label: 'Tenderness in RLQ',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'reboundTenderness',
      type: 'checkbox',
      label: 'Rebound tenderness',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'elevatedTemp',
      type: 'checkbox',
      label: 'Temperature > 37.3°C (99.1°F)',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    // Lab
    {
      id: 'leukocytosis',
      type: 'checkbox',
      label: 'Leukocytosis > 10,000/μL',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    },
    {
      id: 'leftShift',
      type: 'checkbox',
      label: 'Left shift (>75% neutrophils)',
      placeholder: '',
      unit: '',
      keyboardType: 'default'
    }
  ],
  validate: (values: { [key: string]: string | boolean }) => {
    // No specific validation needed for checkboxes
    return null;
  },
  calculate: (values: { [key: string]: string | boolean }) => {
    // Calculate score (1 point for each positive finding)
    const score =
      (values.migratoryPain ? 1 : 0) +
      (values.anorexia ? 1 : 0) +
      (values.nauseaVomiting ? 1 : 0) +
      (values.tendernessRLQ ? 2 : 0) +
      (values.reboundTenderness ? 1 : 0) +
      (values.elevatedTemp ? 1 : 0) +
      (values.leukocytosis ? 2 : 0) +
      (values.leftShift ? 1 : 0);

    // Determine likelihood of appendicitis
    let probability = '';
    let recommendation = '';
    
    let status: CalculationStatus = 'success';

    if (score <= 4) {
      probability = 'Low probability (≈15% risk)';
      recommendation = 'Consider alternative diagnoses. Observation or further imaging may be appropriate.';
      status = 'success';
    } else if (score <= 6) {
      probability = 'Moderate probability (≈40-50% risk)';
      recommendation = 'Consider imaging (ultrasound or CT) to confirm diagnosis.';
      status = 'warning';
    } else {
      probability = 'High probability (≈85-95% risk)';
      recommendation = 'Surgical consultation recommended. Consider appendectomy.';
      status = 'danger';
    }
    
    // Additional clinical notes
    const notes = [
      '• The Alvarado Score is most accurate in men and less reliable in women of childbearing age.',
      '• Consider pregnancy test in women of childbearing age.',
      '• In children, consider pediatric appendicitis score (PAS) for better accuracy.',
      '• In elderly patients, clinical presentation may be atypical.'
    ].join('\n');

    return {
      result: score,
      interpretation: `Alvarado Score: ${score}/10\n` +
                     `Probability of Appendicitis: ${probability}\n\n` +
                     `Recommendation: ${recommendation}\n\n` +
                     `Clinical Notes:\n${notes}`,
      status,
    };
  },
  formula: 'Alvarado Score Components (1 point each):\n\n' +
           'Symptoms:\n' +
           '• Migratory pain to RLQ\n' +
           '• Anorexia\n' +
           '• Nausea/Vomiting\n\n' +
           'Signs:\n' +
           '• Tenderness in RLQ (2 points)\n' +
           '• Rebound tenderness\n' +
           '• Temperature > 37.3°C (99.1°F)\n\n' +
           'Lab:\n' +
           '• Leukocytosis > 10,000/μL (2 points)\n' +
           '• Left shift (>75% neutrophils)\n\n' +
           'Scoring:\n' +
           '• 5-6: Moderate probability (consider imaging)\n' +
           '• 7-10: High probability (surgical consultation)',
  references: [
    'Alvarado A. A practical score for the early diagnosis of acute appendicitis. Ann Emerg Med. 1986;15(5):557-564.',
    'Ohle R, O\'Reilly F, O\'Brien KK, et al. The Alvarado score for predicting acute appendicitis: a systematic review. BMC Med. 2011;9:139.',
    'Tiwari MM, Reynoso JF, Tsang AW, Oleynikov D. Comparison of outcomes of laparoscopic and open appendectomy in management of uncomplicated and complicated appendicitis. Ann Surg. 2011;254(6):927-932.'
  ],
  resultUnit: 'points (0-10)'
};

export default alvaradoConfig;
