import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const qtcConfig: CalculatorConfig = {
  id: 'qtc',
  name: 'Corrected QT Interval (QTc)',
  description: 'Calculate corrected QT interval (QTc) using Bazett\'s formula',
  category: 'cardiology',
  fields: [
    {
      id: 'qt',
      type: 'number',
      label: 'QT Interval',
      placeholder: 'Enter QT interval (ms)',
      unit: 'ms',
      keyboardType: 'decimal-pad',
      min: 200,
      max: 1000
    },
    {
      id: 'hr',
      type: 'number',
      label: 'Heart Rate',
      placeholder: 'Enter heart rate (bpm)',
      unit: 'bpm',
      keyboardType: 'decimal-pad',
      min: 30,
      max: 250
    },
    {
      id: 'gender',
      type: 'radio',
      label: 'Gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ],
      value: 'male'
    }
  ],
  validate: (values) => {
    const errors: Record<string, string> = {};
    const qt = parseFloat(values.qt as string);
    const hr = parseFloat(values.hr as string);
    
    if (isNaN(qt) || qt <= 0) {
      errors.qt = 'QT interval must be positive';
    }
    if (isNaN(hr) || hr <= 0) {
      errors.hr = 'Heart rate must be positive';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: Record<string, string | boolean>) => {
    // Get values using the correct field IDs from the form
    const qt = parseFloat(values.qt as string);
    const hr = parseFloat(values.hr as string);
    const isFemale = values.gender === 'female';
    
    // Using Bazett's formula: QTc = QT / √(RR in seconds)
    // RR interval in seconds = 60 / HR
    const rrSeconds = 60 / hr;
    const qtc = qt / Math.sqrt(rrSeconds);
    
    // Gender-specific normal ranges
    const normalRange = isFemale ? '≤460 ms' : '≤450 ms';
    const borderlineRange = isFemale ? '>460-470 ms' : '>450-470 ms';
    const prolongedRange = '>470 ms';
    
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (qtc < 350) {
      interpretation = 'Short QT interval (Risk of arrhythmias)';
      status = 'danger';
    } else if (qtc <= (isFemale ? 460 : 450)) {
      interpretation = 'Normal QT interval';
      status = 'success';
    } else if (qtc <= 500) {
      interpretation = 'Mildly prolonged QT interval';
      status = 'warning';
    } else {
      interpretation = 'Markedly prolonged QT interval (High risk of Torsades de Pointes)';
      status = 'danger';
    }
    
    return {
      result: parseFloat(qtc.toFixed(0)), // Round to nearest ms
      interpretation: `QTc: ${qtc.toFixed(0)} ms\n` +
        `• Interpretation: ${interpretation}\n` +
        `• Normal range: ${normalRange}\n` +
        `• Borderline: ${borderlineRange}\n` +
        `• Prolonged: ${prolongedRange}`,
      status,
      resultUnit: 'ms'
    };
  },
  formula: 'Bazett\'s Formula:\n' +
    'QTc = QT / √(RR in seconds)\n\n' +
    'Where:\n' +
    '• QTc = Corrected QT interval (ms)\n' +
    '• QT = Measured QT interval (ms)\n' +
    '• RR = RR interval in seconds (60 / Heart Rate)\n\n' +
    'Normal Ranges:\n' +
    '• Men: ≤450 ms\n' +
    '• Women: ≤460 ms\n' +
    '• Borderline: 450-470 ms (men), 460-470 ms (women)\n' +
    '• Prolonged: >470 ms (both genders)\n\n' +
    'Note: Bazett\'s formula may overcorrect at high heart rates (>100 bpm)\n' +
    'and undercorrect at low heart rates (<60 bpm).',
  references: [
    'Journal of the American College of Cardiology. QT Interval.',
    'Heart Rhythm. QT Interval Analysis.',
    'Clinical Cardiology. QT Prolongation.'
  ],
  resultUnit: 'ms'
};

export default qtcConfig;
