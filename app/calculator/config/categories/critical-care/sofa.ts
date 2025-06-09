import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const sofaConfig: CalculatorConfig = {
  id: 'sofa',
  name: 'SOFA Score',
  description: 'Assesses organ failure in septic patients.',
  category: 'Critical Care',
  fields: [
    // Respiratory System (PaO2/FiO2)
    {
      id: 'pao2',
      type: 'number',
      label: 'PaO2',
      placeholder: 'Enter PaO2 (mmHg)',
      unit: 'mmHg',
      keyboardType: 'number-pad',
      min: 0
    },
    {
      id: 'fio2',
      type: 'number',
      label: 'FiO2 (%)',
      placeholder: 'Enter FiO2 (21-100)',
      unit: '%',
      keyboardType: 'number-pad',
      min: 21,
      max: 100
    },
    // Coagulation (Platelets)
    {
      id: 'platelets',
      type: 'number',
      label: 'Platelet Count',
      placeholder: 'Enter platelet count (x10³/µL)',
      unit: 'x10³/µL',
      keyboardType: 'number-pad',
      min: 0
    },
    // Liver (Bilirubin)
    {
      id: 'bilirubin',
      type: 'number',
      label: 'Bilirubin',
      placeholder: 'Enter total bilirubin (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad',
      min: 0,
      step: 0.1
    },
    // Cardiovascular (MAP or vasopressors)
    {
      id: 'map',
      type: 'number',
      label: 'Mean Arterial Pressure',
      placeholder: 'Enter MAP (mmHg)',
      unit: 'mmHg',
      keyboardType: 'number-pad',
      min: 0
    },
    {
      id: 'vasopressors',
      type: 'select',
      label: 'Vasopressors',
      placeholder: 'Select if applicable',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Dopamine ≤5 or dobutamine (any dose)', value: 'dopamine' },
        { label: 'Dopamine >5, epinephrine ≤0.1, or norepinephrine ≤0.1', value: 'moderate' },
        { label: 'Dopamine >15, epinephrine >0.1, or norepinephrine >0.1', value: 'high' }
      ]
    },
    // Central Nervous System (GCS)
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
    // Renal (Creatinine or Urine Output)
    {
      id: 'creatinine',
      type: 'number',
      label: 'Creatinine',
      placeholder: 'Enter creatinine (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad',
      min: 0,
      step: 0.1
    },
    {
      id: 'urineOutput',
      type: 'number',
      label: 'Urine Output (last 24h)',
      placeholder: 'Enter urine output (mL)',
      unit: 'mL',
      keyboardType: 'number-pad',
      min: 0,
      required: false
    }
  ],
  validate: (values: { [key: string]: string | boolean }) => {
    const requiredFields = ['pao2', 'fio2', 'platelets', 'bilirubin', 'map', 'gcs', 'creatinine'];
    
    for (const field of requiredFields) {
      if (values[field] === '') {
        return `Please fill in the ${field} field`;
      }
    }
    
    const numericChecks = [
      { field: 'pao2', min: 0 },
      { field: 'fio2', min: 21, max: 100 },
      { field: 'platelets', min: 0 },
      { field: 'bilirubin', min: 0 },
      { field: 'map', min: 0 },
      { field: 'gcs', min: 3, max: 15 },
      { field: 'creatinine', min: 0 }
    ];
    
    for (const check of numericChecks) {
      const value = parseFloat(values[check.field] as string);
      if (isNaN(value) || value < check.min || (check.max !== undefined && value > check.max)) {
        return `${check.field} must be between ${check.min}${check.max ? ` and ${check.max}` : '+'}`;
      }
    }
    
    return null;
  },
  calculate: (values: { [key: string]: string | boolean }) => {
    // Parse input values
    const pao2 = parseFloat(values.pao2 as string);
    const fio2 = parseFloat(values.fio2 as string) / 100; // Convert to fraction
    const platelets = parseFloat(values.platelets as string);
    const bilirubin = parseFloat(values.bilirubin as string);
    const map = parseFloat(values.map as string);
    const gcs = parseFloat(values.gcs as string);
    const creatinine = parseFloat(values.creatinine as string);
    const urineOutput = values.urineOutput ? parseFloat(values.urineOutput as string) : null;
    const vasopressors = values.vasopressors as string;
    
    // Calculate individual component scores
    const scores = {
      respiratory: 0,
      coagulation: 0,
      liver: 0,
      cardiovascular: 0,
      cns: 0,
      renal: 0
    };
    
    // 1. Respiratory (PaO2/FiO2 in mmHg)
    const pao2FiO2 = pao2 / fio2;
    if (pao2FiO2 < 100) scores.respiratory = 4;
    else if (pao2FiO2 < 200) scores.respiratory = 3;
    else if (pao2FiO2 < 300) scores.respiratory = 2;
    else if (pao2FiO2 < 400) scores.respiratory = 1;
    
    // 2. Coagulation (Platelets x10³/µL)
    if (platelets < 20) scores.coagulation = 4;
    else if (platelets < 50) scores.coagulation = 3;
    else if (platelets < 100) scores.coagulation = 2;
    else if (platelets < 150) scores.coagulation = 1;
    
    // 3. Liver (Bilirubin mg/dL)
    if (bilirubin >= 12) scores.liver = 4;
    else if (bilirubin >= 6) scores.liver = 3;
    else if (bilirubin >= 2) scores.liver = 2;
    else if (bilirubin >= 1.2) scores.liver = 1;
    
    // 4. Cardiovascular (MAP or vasopressors)
    if (vasopressors === 'high') scores.cardiovascular = 4;
    else if (vasopressors === 'moderate') scores.cardiovascular = 3;
    else if (vasopressors === 'dopamine') scores.cardiovascular = 2;
    else if (map < 70) scores.cardiovascular = 1;
    
    // 5. CNS (Glasgow Coma Scale)
    if (gcs < 6) scores.cns = 4;
    else if (gcs < 10) scores.cns = 3;
    else if (gcs < 13) scores.cns = 2;
    else if (gcs < 15) scores.cns = 1;
    
    // 6. Renal (Creatinine or urine output)
    if (urineOutput !== null && urineOutput < 200) {
      // Use urine output if available and <500ml/24h
      if (urineOutput < 200) scores.renal = 4;
      else if (urineOutput < 500) scores.renal = 3;
    } else {
      // Otherwise use creatinine
      if (creatinine >= 5) scores.renal = 4;
      else if (creatinine >= 3.5) scores.renal = 3;
      else if (creatinine >= 2) scores.renal = 2;
      else if (creatinine >= 1.2) scores.renal = 1;
    }
    
    // Calculate total SOFA score
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    // Interpret the score
    let interpretation = '';
    if (totalScore === 0) {
      interpretation = 'No organ failure';
    } else if (totalScore <= 6) {
      interpretation = 'Mild organ failure';
    } else if (totalScore <= 11) {
      interpretation = 'Moderate organ failure';
    } else {
      interpretation = 'Severe organ failure';
    }
    
    // Check for sepsis-3 criteria (SOFA ≥ 2 points from baseline)
    // Note: Baseline SOFA is typically 0 unless the patient has chronic organ dysfunction
    const sepsisRisk = totalScore >= 2 ? 'High risk of sepsis-related mortality' : 'Low risk of sepsis-related mortality';
    
    return {
      result: totalScore,
      interpretation: `SOFA Score: ${totalScore}\n` +
                     `Interpretation: ${interpretation}\n` +
                     `Sepsis Risk: ${sepsisRisk}\n\n` +
                     `Component Scores:\n` +
                     `• Respiratory: ${scores.respiratory}\n` +
                     `• Coagulation: ${scores.coagulation}\n` +
                     `• Liver: ${scores.liver}\n` +
                     `• Cardiovascular: ${scores.cardiovascular}\n` +
                     `• CNS: ${scores.cns}\n` +
                     `• Renal: ${scores.renal}`
    };
  },
  formula: 'SOFA Score Components (0-4 points each):\n\n' +
           '1. Respiratory (PaO2/FiO2 in mmHg):\n' +
           '   • <100 (4)\n' +
           '   • <200 (3)\n' +
           '   • <300 (2)\n' +
           '   • <400 (1)\n' +
           '   • ≥400 (0)\n\n' +
           '2. Coagulation (Platelets x10³/µL):\n' +
           '   • <20 (4)\n' +
           '   • <50 (3)\n' +
           '   • <100 (2)\n' +
           '   • <150 (1)\n' +
           '   • ≥150 (0)\n\n' +
           '3. Liver (Bilirubin mg/dL):\n' +
           '   • ≥12 (4)\n' +
           '   • 6-11.9 (3)\n' +
           '   • 2-5.9 (2)\n' +
           '   • 1.2-1.9 (1)\n' +
           '   • <1.2 (0)\n\n' +
           '4. Cardiovascular (MAP or vasopressors):\n' +
           '   • Dopamine >15, epinephrine >0.1, or norepinephrine >0.1 (4)\n' +
           '   • Dopamine >5, epinephrine ≤0.1, or norepinephrine ≤0.1 (3)\n' +
           '   • Dopamine ≤5 or dobutamine any dose (2)\n' +
           '   • MAP <70 (1)\n' +
           '   • None (0)\n\n' +
           '5. CNS (Glasgow Coma Scale):\n' +
           '   • <6 (4)\n' +
           '   • 6-9 (3)\n' +
           '   • 10-12 (2)\n' +
           '   • 13-14 (1)\n' +
           '   • 15 (0)\n\n' +
           '6. Renal (Creatinine mg/dL or Urine Output):\n' +
           '   • Creatinine ≥5 or Urine Output <200mL/24h (4)\n' +
           '   • Creatinine 3.5-4.9 or Urine Output <500mL/24h (3)\n' +
           '   • Creatinine 2-3.4 (2)\n' +
           '   • Creatinine 1.2-1.9 (1)\n' +
           '   • None (0)',
  references: [
    'Vincent JL, et al. The SOFA (Sepsis-related Organ Failure Assessment) score to describe organ dysfunction/failure. Intensive Care Med. 1996;22(7):707-710.',
    'Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016;315(8):801-810.',
    'Raith EP, et al. Prognostic Accuracy of the SOFA Score, SIRS Criteria, and qSOFA Score for In-Hospital Mortality Among Adults With Suspected Infection Admitted to the Intensive Care Unit. JAMA. 2017;317(3):290-300.'
  ],
  resultUnit: 'points (0-24)'
};

export default sofaConfig;
