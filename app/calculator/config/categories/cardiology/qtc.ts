import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const qtcConfig: CalculatorConfig = {
  id: 'qtc',
  fields: [
    {
      label: 'QT Interval',
      placeholder: 'Enter QT interval (ms)',
      unit: 'ms',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Heart Rate',
      placeholder: 'Enter heart rate (bpm)',
      unit: 'bpm',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const qt = parseFloat(values['QT Interval']);
    const hr = parseFloat(values['Heart Rate']);
    
    if (isNaN(qt) || qt <= 0) {
      return 'QT interval must be positive';
    }
    if (isNaN(hr) || hr <= 0) {
      return 'Heart rate must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const qt = parseFloat(values['QT Interval']);
    const hr = parseFloat(values['Heart Rate']);
    // Using Bazett's formula: QTc = QT / √RR
    // RR interval = 60000 / HR (in ms)
    const rr = 60000 / hr;
    const qtc = qt / Math.sqrt(rr);
    
    let interpretation = '';
    if (qtc < 400) {
      interpretation = 'Short QT interval';
    } else if (qtc <= 450) {
      interpretation = 'Normal QT interval';
    } else {
      interpretation = 'Long QT interval';
    }
    
    return {
      result: parseFloat(qtc.toFixed(1)),
      interpretation
    };
  },
  formula: 'QTc = QT / √RR',
  references: [
    'Journal of the American College of Cardiology. QT Interval.',
    'Heart Rhythm. QT Interval Analysis.',
    'Clinical Cardiology. QT Prolongation.'
  ],
  resultUnit: 'ms'
};

export default qtcConfig;
