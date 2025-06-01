export interface Calculation {
  id: string;          // Unique identifier, e.g., 'bmi'
  name: string;        // Display name, e.g., 'Body Mass Index (BMI)'
  description: string; // Brief description of what the calculator does
  category?: string;   // Optional category for grouping calculators
  favorite?: boolean;  // Optional favorite status
}

// Example of how the data should be structured
export const SAMPLE_CALCULATION: Calculation = {
  id: 'bmi',
  name: 'Body Mass Index (BMI)',
  description: 'Calculate BMI using weight and height',
};

// This is where all calculations are defined
export const CALCULATIONS: Calculation[] = [
  {
    id: 'pregnancy-dates',
    name: 'Pregnancy Date Calculator',
    description: 'Calculate pregnancy dates including Last Menstrual Period (LMP), Estimated Gestational Age (EGA), and Estimated Due Date (EDD). Enter any known date to calculate the others.',
    category: 'Obstetrics',
    favorite: false
  },
  {
    id: 'bmi',
    name: 'Body Mass Index (BMI)',
    description: 'Assesses body fat based on weight and height to classify underweight, normal, overweight, or obesity.',
  },
  {
    id: 'creatinine-clearance',
    name: 'Creatinine Clearance',
    description: 'Estimates kidney function by measuring creatinine clearance using age, weight, and serum creatinine.',
  },
  {
    id: 'gcs',
    name: 'Glasgow Coma Scale (GCS)',
    description: 'Evaluates level of consciousness in trauma or neurological patients through eye, verbal, and motor responses.',
  },
  {
    id: 'map',
    name: 'Mean Arterial Pressure (MAP)',
    description: 'Estimates average blood pressure during a single cardiac cycle.',
  },
  {
    id: 'anion-gap',
    name: 'Anion Gap',
    description: 'Helps evaluate metabolic acidosis by measuring the difference between primary measured cations and anions.',
  },
  {
    id: 'alveolar-gas',
    name: 'Alveolar Gas Equation',
    description: 'Estimates alveolar oxygen pressure for assessing gas exchange efficiency in the lungs.',
  },
  {
    id: 'corrected-calcium',
    name: 'Corrected Calcium',
    description: 'Adjusts serum calcium levels for low albumin concentration.',
  },
  {
    id: 'warfarin-dose',
    name: 'Warfarin Dose Adjustment (INR)',
    description: 'Guides warfarin dosing to achieve therapeutic anticoagulation based on INR levels.',
  },
  {
    id: 'shock-index',
    name: 'Shock Index',
    description: 'A quick indicator of hemodynamic instability or shock using heart rate and systolic blood pressure.',
  },
  {
    id: 'fena',
    name: 'Fractional Excretion of Sodium (FENa)',
    description: 'Differentiates between prerenal and intrinsic renal causes of acute kidney injury.',
  },
  {
    id: 'bsa',
    name: 'Body Surface Area (Mosteller formula)',
    description: 'Estimates the body surface area used for dosing medications and assessments.',
  },
  {
    id: 'apgar',
    name: 'APGAR Score',
    description: 'Evaluates the health of newborns based on appearance, pulse, grimace, activity, and respiration.',
  },
  {
    id: 'pediatric-dosage',
    name: 'Pediatric Dosage Calculation (Clark\'s Rule)',
    description: 'Calculates child medication doses based on weight.',
  },
  {
    id: 'oxygenation-index',
    name: 'Oxygenation Index',
    description: 'Measures severity of hypoxic respiratory failure in ventilated patients.',
  },
  {
    id: 'ibw',
    name: 'Ideal Body Weight (Devine formula)',
    description: 'Estimates ideal body weight for dosing or nutritional assessment.',
  },
  {
    id: 'qtc',
    name: 'Corrected QT Interval',
    description: 'Adjusts the QT interval on ECG for heart rate variability.',
  },
  {
    id: 'bmi-percentile',
    name: 'BMI Percentile (for children)',
    description: 'Compares BMI relative to peers of the same age and sex.',
  },
  {
    id: 'shock-volume',
    name: 'Shock Volume Calculation',
    description: 'Calculates volume of fluids needed during shock resuscitation.',
  },
  {
    id: 'egfr',
    name: 'Estimated Glomerular Filtration Rate (eGFR)',
    description: 'Estimates kidney function from serum creatinine and demographics.',
  },
  {
    id: 'wells-dvt',
    name: 'Wells Score (for DVT)',
    description: 'Estimates probability of deep vein thrombosis.',
  },
  {
    id: 'cha2ds2-vasc',
    name: 'CHA2DS2-VASc Score',
    description: 'Assesses stroke risk in patients with atrial fibrillation.',
  },
  {
    id: 'meld',
    name: 'MELD Score',
    description: 'Predicts mortality risk in patients with liver disease.',
  },
  {
    id: 'apache-ii',
    name: 'APACHE II Score',
    description: 'Predicts mortality in ICU patients based on physiological measurements.',
  },
  {
    id: 'sofa',
    name: 'SOFA Score',
    description: 'Assesses organ failure in septic patients.',
  },
  {
    id: 'alvarado',
    name: 'Alvarado Score',
    description: 'Predicts likelihood of appendicitis based on symptoms and signs.',
  },
  {
    id: 'curb-65',
    name: 'CURB-65 Score',
    description: 'Assesses severity and need for hospitalization in community-acquired pneumonia.',
  },
  {
    id: 'pvr',
    name: 'Pulmonary Vascular Resistance',
    description: 'Calculates resistance in pulmonary circulation.',
  },
  {
    id: 'abi',
    name: 'Ankle-Brachial Index',
    description: 'Evaluates peripheral arterial disease by comparing ankle and arm blood pressures.',
  },
  {
    id: 'p50',
    name: 'P50 Oxygen Saturation',
    description: 'Measures hemoglobin\'s oxygen affinity.',
  },
  {
    id: 'tcpo2',
    name: 'Transcutaneous Oxygen Measurement (TcPO2)',
    description: 'Estimates oxygen levels through the skin.',
  },
  {
    id: 'ahi',
    name: 'Apnea-Hypopnea Index',
    description: 'Quantifies severity of sleep apnea episodes per hour.',
  },
  {
    id: 'glasgow-blatchford',
    name: 'Glasgow-Blatchford Score',
    description: 'Predicts need for intervention in upper gastrointestinal bleeding.',
  },
  {
    id: 'friedewald',
    name: 'Friedewald Formula',
    description: 'Estimates LDL cholesterol level from lipid panel.',
  },
  {
    id: 'serum-osmolality',
    name: 'Serum Osmolality Calculation',
    description: 'Estimates osmolality based on serum electrolytes and glucose.',
  },
  {
    id: 'corrected-anion-gap',
    name: 'Anion Gap Corrected for Albumin',
    description: 'More accurate metabolic acidosis evaluation adjusting for low albumin.',
  },
  {
    id: 'naranjo',
    name: 'Naranjo Algorithm',
    description: 'Determines likelihood of adverse drug reactions.',
  },
  {
    id: 'framingham',
    name: 'Cardiovascular Risk (Framingham Score)',
    description: 'Estimates 10-year cardiovascular risk based on various factors.',
  },
  {
    id: 'reynolds-risk',
    name: 'Reynolds Risk Score',
    description: 'Another cardiovascular risk calculator including CRP and family history.',
  },
  {
    id: 'cha2ds2',
    name: 'CHA2DS2 Score (without VASc)',
    description: 'Stroke risk assessment variant for atrial fibrillation patients.',
  },
  {
    id: 'pediatric-gcs',
    name: 'Pediatric Glasgow Coma Scale',
    description: 'Modified GCS adapted for children.',
  },
  {
    id: 'alp-ratio',
    name: 'Alkaline Phosphatase Ratio',
    description: 'Assesses bone vs liver origin of elevated alkaline phosphatase.',
  },
  {
    id: 'child-pugh',
    name: 'Liver Function Score (Child-Pugh)',
    description: 'Predicts prognosis in liver cirrhosis patients.',
  },
  {
    id: 'hematocrit',
    name: 'Hematocrit Calculation',
    description: 'Measures proportion of red blood cells in blood.',
  },
  {
    id: 'corrected-anion-gap-2',
    name: 'Corrected Anion Gap',
    description: 'Adjusts anion gap for albumin and other factors.',
  },
  {
    id: 'albumin-calcium',
    name: 'Albumin-Corrected Calcium',
    description: 'Refines calcium measurement based on albumin levels.',
  },
  {
    id: 'lactate-clearance',
    name: 'Lactate Clearance',
    description: 'Measures improvement or worsening in tissue oxygenation.',
  },
  {
    id: 'blood-oxygen',
    name: 'Oxygen Content of Blood',
    description: 'Calculates total oxygen carried in blood by hemoglobin and dissolved oxygen.',
  },
  {
    id: 'trp',
    name: 'Tubular Reabsorption of Phosphate (TRP)',
    description: 'Assesses renal phosphate handling.',
  },
  {
    id: 'infusion-rate',
    name: 'Infusion Rate Calculation',
    description: 'Calculates rate of IV medication or fluid infusion.',
  },
  {
    id: 'ebl',
    name: 'Estimated Blood Loss (EBL)',
    description: 'Estimates blood loss during surgery or trauma.',
  },
  {
    id: 'tidal-volume',
    name: 'Tidal Volume (Ideal Body Weight)',
    description: 'Calculates appropriate ventilation volume based on IBW.',
  },
  {
    id: 'cardiac-output',
    name: 'Cardiac Output (Fick Principle)',
    description: 'Measures cardiac output based on oxygen consumption.',
  }
]; 