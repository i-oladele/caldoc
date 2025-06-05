export interface Calculation {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const CALCULATIONS: Calculation[] = [
  {
    id: 'bmi',
    name: 'Body Mass Index (BMI)',
    description: 'Calculate BMI using weight and height',
    category: 'General'
  },
  {
    id: 'creatinine-clearance',
    name: 'Creatinine Clearance',
    description: 'Estimates kidney function using age, weight, and serum creatinine',
    category: 'Nephrology'
  },
  {
    id: 'gcs',
    name: 'Glasgow Coma Scale (GCS)',
    description: 'Evaluates level of consciousness through eye, verbal, and motor responses',
    category: 'Neurology'
  },
  {
    id: 'map',
    name: 'Mean Arterial Pressure (MAP)',
    description: 'Calculates average blood pressure during a cardiac cycle',
    category: 'Cardiology'
  },
  {
    id: 'anion-gap',
    name: 'Anion Gap',
    description: 'Evaluates metabolic acidosis by measuring cation-anion difference',
    category: 'Metabolism'
  },
  {
    id: 'corrected-calcium',
    name: 'Corrected Calcium',
    description: 'Adjusts serum calcium levels based on albumin concentration',
    category: 'Metabolism'
  },
  {
    id: 'warfarin-dose',
    name: 'Warfarin Dose Adjustment',
    description: 'Adjusts warfarin dose based on INR and target range',
    category: 'Hematology'
  },
  {
    id: 'fen',
    name: 'Fractional Excretion of Sodium (FENa)',
    description: 'Assesses kidney function and differentiates prerenal from intrinsic AKI',
    category: 'Nephrology'
  },
  {
    id: 'child-dose',
    name: 'Pediatric Dose Calculator',
    description: 'Calculates adjusted doses for pediatric patients',
    category: 'Pediatrics'
  },
  {
    id: 'alveolar-gas',
    name: 'Alveolar Gas Equation',
    description: 'Estimates alveolar oxygen pressure for assessing gas exchange efficiency in the lungs.',
    category: 'Respiratory'
  },
  {
    id: 'shock-index',
    name: 'Shock Index',
    description: 'A quick indicator of hemodynamic instability or shock using heart rate and systolic blood pressure.',
    category: 'Critical Care'
  },
  {
    id: 'bsa',
    name: 'Body Surface Area (Mosteller formula)',
    description: 'Estimates the body surface area used for dosing medications and assessments.',
    category: 'General'
  },
  {
    id: 'apgar',
    name: 'APGAR Score',
    description: 'Evaluates the health of newborns based on appearance, pulse, grimace, activity, and respiration.',
    category: 'Pediatrics'
  },
  {
    id: 'oxygenation-index',
    name: 'Oxygenation Index',
    description: 'Measures severity of hypoxic respiratory failure in ventilated patients.',
    category: 'Respiratory'
  },
  {
    id: 'ibw',
    name: 'Ideal Body Weight (Devine formula)',
    description: 'Estimates ideal body weight for dosing or nutritional assessment.',
    category: 'General'
  },
  {
    id: 'qtc',
    name: 'Corrected QT Interval',
    description: 'Adjusts the QT interval on ECG for heart rate variability.',
    category: 'Cardiology'
  },
  {
    id: 'bmi-percentile',
    name: 'BMI Percentile (for children)',
    description: 'Compares BMI relative to peers of the same age and sex.',
    category: 'Pediatrics'
  },
  {
    id: 'shock-volume',
    name: 'Shock Volume Calculation',
    description: 'Calculates volume of fluids needed during shock resuscitation.',
    category: 'Critical Care'
  },
  {
    id: 'egfr',
    name: 'Estimated Glomerular Filtration Rate (eGFR)',
    description: 'Estimates kidney function from serum creatinine and demographics.',
    category: 'Nephrology'
  },
  {
    id: 'wells-dvt',
    name: 'Wells Score (for DVT)',
    description: 'Estimates probability of deep vein thrombosis.',
    category: 'Hematology'
  },
  {
    id: 'cha2ds2-vasc',
    name: 'CHA2DS2-VASc Score',
    description: 'Assesses stroke risk in patients with atrial fibrillation.',
    category: 'Cardiology'
  },
  {
    id: 'meld',
    name: 'MELD Score',
    description: 'Predicts mortality risk in patients with liver disease.',
    category: 'Hepatology'
  },
  {
    id: 'apache-ii',
    name: 'APACHE II Score',
    description: 'Predicts mortality in ICU patients based on physiological measurements.',
    category: 'Critical Care'
  },
  {
    id: 'sofa',
    name: 'SOFA Score',
    description: 'Assesses organ failure in septic patients.',
    category: 'Critical Care'
  },
  {
    id: 'alvarado',
    name: 'Alvarado Score',
    description: 'Predicts likelihood of appendicitis based on symptoms and signs.',
    category: 'Surgery'
  },
  {
    id: 'curb-65',
    name: 'CURB-65 Score',
    description: 'Assesses severity and need for hospitalization in community-acquired pneumonia.',
    category: 'Respiratory'
  },
  {
    id: 'pvr',
    name: 'Pulmonary Vascular Resistance',
    description: 'Calculates resistance in pulmonary circulation.',
    category: 'Cardiology'
  },
  {
    id: 'abi',
    name: 'Ankle-Brachial Index',
    description: 'Evaluates peripheral arterial disease by comparing ankle and arm blood pressures.',
    category: 'Cardiology'
  },
  {
    id: 'p50',
    name: 'P50 Oxygen Saturation',
    description: 'Measures hemoglobin\'s oxygen affinity.',
    category: 'Respiratory'
  },
  {
    id: 'tcpo2',
    name: 'Transcutaneous Oxygen Measurement (TcPO2)',
    description: 'Estimates oxygen levels through the skin.',
    category: 'Respiratory'
  },
  {
    id: 'ahi',
    name: 'Apnea-Hypopnea Index',
    description: 'Quantifies severity of sleep apnea episodes per hour.',
    category: 'Respiratory'
  },
  {
    id: 'glasgow-blatchford',
    name: 'Glasgow-Blatchford Score',
    description: 'Predicts need for intervention in upper gastrointestinal bleeding.',
    category: 'Gastroenterology'
  },
  {
    id: 'friedewald',
    name: 'Friedewald Formula',
    description: 'Estimates LDL cholesterol level from lipid panel.',
    category: 'Cardiology'
  },
  {
    id: 'serum-osmolality',
    name: 'Serum Osmolality Calculation',
    description: 'Estimates osmolality based on serum electrolytes and glucose.',
    category: 'Metabolism'
  },
  {
    id: 'corrected-anion-gap',
    name: 'Anion Gap Corrected for Albumin',
    description: 'More accurate metabolic acidosis evaluation adjusting for low albumin.',
    category: 'Metabolism'
  },
  {
    id: 'naranjo',
    name: 'Naranjo Algorithm',
    description: 'Determines likelihood of adverse drug reactions.',
    category: 'Pharmacology'
  },
  {
    id: 'framingham',
    name: 'Cardiovascular Risk (Framingham Score)',
    description: 'Estimates 10-year cardiovascular risk based on various factors.',
    category: 'Cardiology'
  },
  {
    id: 'reynolds-risk',
    name: 'Reynolds Risk Score',
    description: 'Another cardiovascular risk calculator including CRP and family history.',
    category: 'Cardiology'
  },
  {
    id: 'cha2ds2',
    name: 'CHA2DS2 Score (without VASc)',
    description: 'Stroke risk assessment variant for atrial fibrillation patients.',
    category: 'Cardiology'
  },
  {
    id: 'pediatric-gcs',
    name: 'Pediatric Glasgow Coma Scale',
    description: 'Modified GCS adapted for children.',
    category: 'Neurology'
  },
  {
    id: 'alp-ratio',
    name: 'Alkaline Phosphatase Ratio',
    description: 'Assesses bone vs liver origin of elevated alkaline phosphatase.',
    category: 'Hepatology'
  },
  {
    id: 'child-pugh',
    name: 'Liver Function Score (Child-Pugh)',
    description: 'Predicts prognosis in liver cirrhosis patients.',
    category: 'Hepatology'
  },
  {
    id: 'hematocrit',
    name: 'Hematocrit Calculation',
    description: 'Measures proportion of red blood cells in blood.',
    category: 'Hematology'
  },
  {
    id: 'corrected-anion-gap-2',
    name: 'Corrected Anion Gap',
    description: 'Adjusts anion gap for albumin and other factors.',
    category: 'Metabolism'
  },
  {
    id: 'corrected-calcium',
    name: 'Albumin-Corrected Calcium',
    description: 'Refines calcium measurement based on albumin levels.',
    category: 'Metabolism'
  },
  {
    id: 'lactate-clearance',
    name: 'Lactate Clearance',
    description: 'Measures improvement or worsening in tissue oxygenation.',
    category: 'Critical Care'
  },
  {
    id: 'blood-oxygen',
    name: 'Oxygen Content of Blood',
    description: 'Calculates total oxygen carried in blood by hemoglobin and dissolved oxygen.',
    category: 'Respiratory'
  },
  {
    id: 'trp',
    name: 'Tubular Reabsorption of Phosphate (TRP)',
    description: 'Assesses renal phosphate handling.',
    category: 'Nephrology'
  },
  {
    id: 'infusion-rate',
    name: 'Infusion Rate Calculation',
    description: 'Calculates rate of IV medication or fluid infusion.',
    category: 'General'
  },
  {
    id: 'ebl',
    name: 'Estimated Blood Loss (EBL)',
    description: 'Estimates blood loss during surgery or trauma.',
    category: 'Surgery'
  },
  {
    id: 'tidal-volume',
    name: 'Tidal Volume (Ideal Body Weight)',
    description: 'Calculates appropriate ventilation volume based on IBW.',
    category: 'Respiratory'
  },
  {
    id: 'cardiac-output',
    name: 'Cardiac Output (Fick Principle)',
    description: 'Measures cardiac output based on oxygen consumption.',
    category: 'Cardiology'
  }
]; 