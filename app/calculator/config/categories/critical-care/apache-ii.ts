import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const apacheIIConfig: CalculatorConfig = {
  id: 'apache-ii',
  name: 'APACHE II Score',
  description: 'Predicts mortality in ICU patients based on physiological measurements.',
  category: 'Critical Care',
  fields: [
    // Temperature (Celsius)
    {
      id: 'temperature',
      type: 'number',
      label: 'Temperature',
      placeholder: 'Enter temperature (°C)',
      unit: '°C',
      keyboardType: 'decimal-pad',
      min: 20,
      max: 45
    },
    // Mean Arterial Pressure (mmHg)
    {
      id: 'map',
      type: 'number',
      label: 'Mean Arterial Pressure',
      placeholder: 'Enter MAP (mmHg)',
      unit: 'mmHg',
      keyboardType: 'number-pad',
      min: 40,
      max: 200
    },
    // Heart Rate (bpm)
    {
      id: 'heartRate',
      type: 'number',
      label: 'Heart Rate',
      placeholder: 'Enter heart rate (bpm)',
      unit: 'bpm',
      keyboardType: 'number-pad',
      min: 0,
      max: 300
    },
    // Respiratory Rate (breaths/min)
    {
      id: 'respRate',
      type: 'number',
      label: 'Respiratory Rate',
      placeholder: 'Enter respiratory rate',
      unit: '/min',
      keyboardType: 'number-pad',
      min: 0,
      max: 60
    },
    // Oxygenation (PaO2 in mmHg or A-aDO2)
    {
      id: 'oxygenationType',
      type: 'select',
      label: 'Oxygenation Parameter',
      placeholder: 'Select parameter',
      options: [
        { label: 'PaO2 (FiO2 < 0.5)', value: 'pao2' },
        { label: 'A-aDO2 (FiO2 ≥ 0.5)', value: 'aado2' }
      ]
    },
    {
      id: 'oxygenationValue',
      type: 'number',
      label: 'Oxygenation Value',
      placeholder: 'Enter value',
      unit: 'mmHg',
      keyboardType: 'number-pad',
      min: 0,
      max: 700
    },
    // Arterial pH
    {
      id: 'arterialPH',
      type: 'number',
      label: 'Arterial pH',
      placeholder: 'Enter arterial pH',
      unit: '',
      keyboardType: 'decimal-pad',
      min: 6.5,
      max: 8.0,
      step: 0.01
    },
    // Serum Sodium (mEq/L)
    {
      id: 'sodium',
      type: 'number',
      label: 'Serum Sodium',
      placeholder: 'Enter sodium level',
      unit: 'mEq/L',
      keyboardType: 'number-pad',
      min: 100,
      max: 200
    },
    // Serum Potassium (mEq/L)
    {
      id: 'potassium',
      type: 'number',
      label: 'Serum Potassium',
      placeholder: 'Enter potassium level',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad',
      min: 1,
      max: 10,
      step: 0.1
    },
    // Serum Creatinine (mg/dL)
    {
      id: 'creatinine',
      type: 'number',
      label: 'Serum Creatinine',
      placeholder: 'Enter creatinine level',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad',
      min: 0.1,
      step: 0.1
    },
    // Hematocrit (%)
    {
      id: 'hematocrit',
      type: 'number',
      label: 'Hematocrit',
      placeholder: 'Enter hematocrit',
      unit: '%',
      keyboardType: 'number-pad',
      min: 10,
      max: 70
    },
    // White Blood Cell Count (x10³/µL)
    {
      id: 'wbc',
      type: 'number',
      label: 'WBC Count',
      placeholder: 'Enter WBC count',
      unit: 'x10³/µL',
      keyboardType: 'decimal-pad',
      min: 0.1,
      step: 0.1
    },
    // Glasgow Coma Scale
    {
      id: 'gcs',
      type: 'number',
      label: 'Glasgow Coma Scale',
      placeholder: 'Enter GCS (3-15)',
      unit: '',
      keyboardType: 'number-pad',
      min: 3,
      max: 15
    },
    // Age (years)
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter age in years',
      unit: 'years',
      keyboardType: 'number-pad',
      min: 0,
      max: 120
    },
    // Chronic Health Points
    {
      id: 'chronicHealth',
      type: 'select',
      label: 'Chronic Health Status',
      placeholder: 'Select if applicable',
      options: [
        { label: 'No chronic conditions', value: 'none' },
        { label: 'Immunocompromised', value: 'immuno' },
        { label: 'Severe organ insufficiency', value: 'organ' },
        { label: 'Cirrhosis with portal hypertension', value: 'cirrhosis' },
        { label: 'Metastatic cancer', value: 'cancer' },
        { label: 'Chronic dialysis', value: 'dialysis' }
      ]
    }
  ],
  validate: (values: { [key: string]: string | boolean }) => {
    // Check all required fields are filled
    const requiredFields = [
      'temperature', 'map', 'heartRate', 'respRate', 'oxygenationType',
      'oxygenationValue', 'arterialPH', 'sodium', 'potassium', 'creatinine',
      'hematocrit', 'wbc', 'gcs', 'age', 'chronicHealth'
    ];
    
    for (const field of requiredFields) {
      if (values[field] === '') {
        return `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`;
      }
    }
    
    // Additional validation for numeric ranges
    const numericChecks = [
      { field: 'temperature', min: 20, max: 45 },
      { field: 'map', min: 40, max: 200 },
      { field: 'heartRate', min: 0, max: 300 },
      { field: 'respRate', min: 0, max: 60 },
      { field: 'oxygenationValue', min: 0, max: 700 },
      { field: 'arterialPH', min: 6.5, max: 8.0 },
      { field: 'sodium', min: 100, max: 200 },
      { field: 'potassium', min: 1, max: 10 },
      { field: 'creatinine', min: 0.1 },
      { field: 'hematocrit', min: 10, max: 70 },
      { field: 'wbc', min: 0.1 },
      { field: 'gcs', min: 3, max: 15 },
      { field: 'age', min: 0, max: 120 }
    ];
    
    for (const check of numericChecks) {
      const value = parseFloat(values[check.field] as string);
      if (isNaN(value) || value < check.min || (check.max !== undefined && value > check.max)) {
        return `${check.field.replace(/([A-Z])/g, ' $1')} must be between ${check.min}${check.max ? ` and ${check.max}` : '+'}`;
      }
    }
    
    return null;
  },
  calculate: (values: { [key: string]: string | boolean }) => {
    // Calculate APACHE II score (0-71)
    let score = 0;
    
    // Temperature score (0-4)
    const temp = parseFloat(values.temperature as string);
    if (temp >= 41) score += 4;
    else if (temp >= 39) score += 3;
    else if (temp >= 38.5) score += 1;
    else if (temp <= 29.9) score += 4;
    else if (temp <= 31.9) score += 3;
    else if (temp <= 33.9) score += 2;
    else if (temp <= 35.9) score += 1;
    
    // MAP score (0-4)
    const map = parseFloat(values.map as string);
    if (map >= 160) score += 4;
    else if (map >= 130) score += 3;
    else if (map >= 110) score += 2;
    else if (map >= 70) score += 0;
    else if (map >= 50) score += 2;
    else score += 4;
    
    // Heart rate score (0-4)
    const hr = parseFloat(values.heartRate as string);
    if (hr >= 180) score += 4;
    else if (hr >= 140) score += 3;
    else if (hr >= 110) score += 2;
    else if (hr >= 70) score += 0;
    else if (hr >= 55) score += 2;
    else if (hr >= 40) score += 3;
    else score += 4;
    
    // Respiratory rate score (0-4)
    const rr = parseFloat(values.respRate as string);
    if (rr >= 50) score += 4;
    else if (rr >= 35) score += 3;
    else if (rr >= 25) score += 1;
    else if (rr >= 12) score += 0;
    else if (rr >= 10) score += 1;
    else if (rr >= 6) score += 2;
    else score += 4;
    
    // Oxygenation score (0-4)
    const oxyValue = parseFloat(values.oxygenationValue as string);
    if (values.oxygenationType === 'pao2') {
      // Using PaO2 (FiO2 < 0.5)
      if (oxyValue > 70) score += 0;
      else if (oxyValue > 61) score += 1;
      else if (oxyValue > 55) score += 3;
      else score += 4;
    } else {
      // Using A-aDO2 (FiO2 ≥ 0.5)
      if (oxyValue < 200) score += 0;
      else if (oxyValue < 350) score += 2;
      else if (oxyValue < 500) score += 3;
      else score += 4;
    }
    
    // Arterial pH score (0-4)
    const ph = parseFloat(values.arterialPH as string);
    if (ph >= 7.7) score += 4;
    else if (ph >= 7.6) score += 3;
    else if (ph >= 7.5) score += 1;
    else if (ph >= 7.33) score += 0;
    else if (ph >= 7.15) score += 2;
    else score += 4;
    
    // Serum sodium score (0-4)
    const na = parseFloat(values.sodium as string);
    if (na >= 180) score += 4;
    else if (na >= 160) score += 3;
    else if (na >= 155) score += 2;
    else if (na >= 150) score += 1;
    else if (na >= 130) score += 0;
    else if (na >= 120) score += 2;
    else score += 4;
    
    // Serum potassium score (0-4)
    const k = parseFloat(values.potassium as string);
    if (k >= 7) score += 4;
    else if (k >= 6) score += 3;
    else if (k >= 5.5) score += 1;
    else if (k >= 3.5) score += 0;
    else if (k >= 3) score += 1;
    else if (k >= 2.5) score += 2;
    else score += 4;
    
    // Creatinine score (0-4)
    const cr = parseFloat(values.creatinine as string);
    if (cr >= 3.5) score += 4;
    else if (cr >= 2) score += 3;
    else if (cr >= 1.5) score += 2;
    else if (cr >= 0.6) score += 0;
    else score += 2;
    
    // Hematocrit score (0-4)
    const hct = parseFloat(values.hematocrit as string);
    if (hct >= 60) score += 4;
    else if (hct >= 50) score += 2;
    else if (hct >= 46) score += 1;
    else if (hct >= 30) score += 0;
    else if (hct >= 20) score += 2;
    else score += 4;
    
    // WBC score (0-4)
    const wbc = parseFloat(values.wbc as string);
    if (wbc >= 40) score += 4;
    else if (wbc >= 20) score += 1;
    else if (wbc >= 15) score += 0;
    else if (wbc >= 3) score += 0;
    else if (wbc >= 1) score += 2;
    else score += 4;
    
    // GCS score (0-12, but we subtract from 15 to get the points to add)
    const gcs = 15 - parseFloat(values.gcs as string);
    score += gcs;
    
    // Age points (0-6)
    const age = parseFloat(values.age as string);
    if (age >= 75) score += 6;
    else if (age >= 65) score += 5;
    else if (age >= 55) score += 3;
    else if (age >= 45) score += 2;
    
    // Chronic health points (0-5)
    const chronicHealth = values.chronicHealth as string;
    if (chronicHealth === 'immuno') score += 5;
    else if (chronicHealth === 'organ') score += 5;
    else if (chronicHealth === 'cirrhosis') score += 5;
    else if (chronicHealth === 'cancer') score += 5;
    else if (chronicHealth === 'dialysis') score += 2;
    
    // Calculate predicted mortality
    let mortalityRisk = 0;
    let interpretation = '';
    
    // This is a simplified estimation - actual APACHE II mortality prediction uses diagnosis-specific formulas
    if (score <= 4) {
      mortalityRisk = 4;
      interpretation = 'Low risk';
    } else if (score <= 9) {
      mortalityRisk = 8;
      interpretation = 'Low-moderate risk';
    } else if (score <= 14) {
      mortalityRisk = 15;
      interpretation = 'Moderate risk';
    } else if (score <= 19) {
      mortalityRisk = 25;
      interpretation = 'Moderate-high risk';
    } else if (score <= 24) {
      mortalityRisk = 40;
      interpretation = 'High risk';
    } else if (score <= 29) {
      mortalityRisk = 55;
      interpretation = 'Very high risk';
    } else if (score <= 34) {
      mortalityRisk = 73;
      interpretation = 'Extremely high risk';
    } else {
      mortalityRisk = 85;
      interpretation = 'Critical risk';
    }
    
    return {
      result: score,
      interpretation: `APACHE II Score: ${score}\n` +
                     `Estimated Hospital Mortality: ~${mortalityRisk}%\n` +
                     `Risk Level: ${interpretation}\n\n` +
                     `Note: For more accurate mortality prediction, diagnosis-specific formulas should be used.`
    };
  },
  formula: 'APACHE II Score = (Acute Physiology Score) + (Age Points) + (Chronic Health Points)\n\n' +
           'Acute Physiology Score (0-60) includes:\n' +
           '• Temperature (0-4)\n' +
           '• Mean Arterial Pressure (0-4)\n' +
           '• Heart Rate (0-4)\n' +
           '• Respiratory Rate (0-4)\n' +
           '• Oxygenation: PaO2 or A-aDO2 (0-4)\n' +
           '• Arterial pH (0-4)\n' +
           '• Sodium (0-4)\n' +
           '• Potassium (0-4)\n' +
           '• Creatinine (0-4)\n' +
           '• Hematocrit (0-4)\n' +
           '• White Blood Cell Count (0-4)\n' +
           '• Glasgow Coma Scale (0-12, calculated as 15 - GCS)\n\n' +
           'Age Points (0-6):\n' +
           '• ≤44: 0\n' +
           '• 45-54: 2\n' +
           '• 55-64: 3\n' +
           '• 65-74: 5\n' +
           '• ≥75: 6\n\n' +
           'Chronic Health Points (0-5):\n' +
           '• Severe organ insufficiency: 5\n' +
           '• Immunosuppression: 5\n' +
           '• Cirrhosis with portal hypertension: 5\n' +
           '• Metastatic cancer: 5\n' +
           '• Chronic dialysis: 2',
  references: [
    'Knaus WA, et al. APACHE II: a severity of disease classification system. Crit Care Med. 1985;13(10):818-829.',
    'Knaus WA, et al. The APACHE III prognostic system. Risk prediction of hospital mortality for critically ill hospitalized adults. Chest. 1991;100(6):1619-1636.',
    'Zimmerman JE, et al. Acute Physiology and Chronic Health Evaluation (APACHE) IV: hospital mortality assessment for today\'s critically ill patients. Crit Care Med. 2006;34(5):1297-1310.'
  ],
  resultUnit: 'points'
};

export default apacheIIConfig;
