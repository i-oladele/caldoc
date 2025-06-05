import { ThemedText } from '@/components/ThemedText';
import { CALCULATIONS } from '@/data/calculations';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface InputField {
  label: string;
  placeholder: string;
  unit: string;
  keyboardType: 'numeric' | 'decimal-pad' | 'number-pad' | 'default';
}

interface CalculatorConfig {
  id: string;
  fields: InputField[];
  validate: (values: { [key: string]: string }) => string | null;
  calculate: (values: { [key: string]: string }) => { result: number; interpretation: string };
  formula?: string;
  references?: string[];
  resultUnit: string;
}

const calculatorConfigs: { [key: string]: CalculatorConfig } = {
  'corrected-calcium': {
    id: 'corrected-calcium',
    fields: [
      { label: 'Total Calcium', placeholder: 'Enter total calcium', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Albumin', placeholder: 'Enter albumin', unit: 'g/dL', keyboardType: 'decimal-pad' }
    ],
    validate: (values) => {
      const totalCalcium = values['Total Calcium'];
      const albumin = values.Albumin;
      
      if (!totalCalcium || !albumin) {
        return 'Please enter both total calcium and albumin values';
      }
      
      const totalCalciumNum = parseFloat(totalCalcium);
      const albuminNum = parseFloat(albumin);
      
      if (isNaN(totalCalciumNum) || isNaN(albuminNum)) {
        return 'Please enter valid numbers for total calcium and albumin';
      }
      
      if (totalCalciumNum <= 0 || albuminNum <= 0) {
        return 'Total calcium and albumin must be greater than zero';
      }
      
      if (albuminNum > 6) {
        return 'Albumin value seems unusually high (normal range is 3.5-5.0 g/dL)';
      }
      
      return null; // No validation error
    },
    calculate: (values) => {
      const totalCalcium = parseFloat(values['Total Calcium']);
      const albumin = parseFloat(values.Albumin);
      
      // Corrected Calcium = Total Calcium + 0.8 × (4 - Albumin)
      const correctedCalcium = totalCalcium + 0.8 * (4 - albumin);
      
      let interpretation = '';
      if (correctedCalcium < 8.5) interpretation = 'Hypocalcemia';
      else if (correctedCalcium <= 10.5) interpretation = 'Normal calcium level';
      else interpretation = 'Hypercalcemia';

      return {
        result: parseFloat(correctedCalcium.toFixed(1)),
        interpretation
      };
    },
    formula: 'Corrected Calcium = Total Calcium + 0.8 × (4 - Albumin)',
    references: [
      'American Society of Nephrology. Clinical Practice Guidelines for Calcium Metabolism.',
      'Endocrine Society. Guidelines for the Management of Calcium Disorders.',
      'Journal of Clinical Endocrinology & Metabolism. Assessment of Calcium Status.'
    ],
    resultUnit: 'mg/dL'
  },
  'bmi': {
    id: 'bmi',
    fields: [
      { label: 'Weight', placeholder: 'Enter weight', unit: 'kg', keyboardType: 'decimal-pad' },
      { label: 'Height', placeholder: 'Enter height', unit: 'cm', keyboardType: 'decimal-pad' }
    ],
    validate: (values) => {
      const weight = values.Weight;
      const height = values.Height;
      
      if (!weight || !height) {
        return 'Please enter both weight and height values';
      }
      
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);
      
      if (isNaN(weightNum) || isNaN(heightNum)) {
        return 'Please enter valid numbers for weight and height';
      }
      
      if (weightNum <= 0 || heightNum <= 0) {
        return 'Weight and height must be greater than zero';
      }
      
      if (heightNum < 50 || heightNum > 250) {
        return 'Height seems unusual (normal range is 50-250 cm)';
      }
      
      if (weightNum < 10 || weightNum > 500) {
        return 'Weight seems unusual (normal range is 10-500 kg)';
      }
      
      return null; // No validation error
    },
    calculate: (values) => {
      const weight = parseFloat(values.Weight);
      const height = parseFloat(values.Height) / 100; // convert cm to m
      const bmi = weight / (height * height);
      
      let interpretation = '';
      if (bmi < 18.5) interpretation = 'Underweight';
      else if (bmi < 25) interpretation = 'Normal weight';
      else if (bmi < 30) interpretation = 'Overweight';
      else interpretation = 'Obese';

      return {
        result: parseFloat(bmi.toFixed(1)),
        interpretation
      };
    },
    formula: 'BMI = weight (kg) / [height (m)]²',
    references: [
      'World Health Organization (WHO). Body mass index - BMI.',
      'Centers for Disease Control and Prevention (CDC). About BMI.',
      'National Institutes of Health (NIH). Classification of Overweight and Obesity by BMI.'
    ],
    resultUnit: 'kg/m²'
  },
  'creatinine-clearance': {
    id: 'creatinine-clearance',
    fields: [
      { label: 'Age', placeholder: 'Enter age', unit: 'years', keyboardType: 'numeric' },
      { label: 'Weight', placeholder: 'Enter weight', unit: 'kg', keyboardType: 'decimal-pad' },
      { label: 'Serum Creatinine', placeholder: 'Enter creatinine', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Gender', placeholder: 'Enter 1 for male, 0 for female', unit: '', keyboardType: 'numeric' }
    ],
    validate: (values) => {
      const age = values.Age;
      const weight = values.Weight;
      const creatinine = values['Serum Creatinine'];
      const gender = values.Gender;
      
      if (!age || !weight || !creatinine || !gender) {
        return 'Please enter all required values';
      }
      
      const ageNum = parseInt(age);
      const weightNum = parseFloat(weight);
      const creatinineNum = parseFloat(creatinine);
      const genderNum = parseInt(gender);
      
      if (isNaN(ageNum) || isNaN(weightNum) || isNaN(creatinineNum) || isNaN(genderNum)) {
        return 'Please enter valid numbers for all values';
      }
      
      if (ageNum <= 0 || ageNum > 150) {
        return 'Age must be between 0 and 150 years';
      }
      
      if (weightNum <= 0 || weightNum > 500) {
        return 'Weight must be between 0 and 500 kg';
      }
      
      if (creatinineNum <= 0 || creatinineNum > 20) {
        return 'Creatinine value seems unusual (normal range is typically <20 mg/dL)';
      }
      
      if (genderNum !== 0 && genderNum !== 1) {
        return 'Gender must be 0 (female) or 1 (male)';
      }
      
      return null; // No validation error
    },
    calculate: (values) => {
      const age = parseFloat(values.Age);
      const weight = parseFloat(values.Weight);
      const serumCreatinine = parseFloat(values['Serum Creatinine']);
      const gender = parseInt(values.Gender);
      
      // Cockcroft-Gault equation
      let creatinineClearance = ((140 - age) * weight) / (72 * serumCreatinine);
      if (gender === 0) { // female
        creatinineClearance *= 0.85;
      }
      
      let interpretation = '';
      if (creatinineClearance >= 90) interpretation = 'Normal kidney function';
      else if (creatinineClearance >= 60) interpretation = 'Mild kidney dysfunction';
      else if (creatinineClearance >= 30) interpretation = 'Moderate kidney dysfunction';
      else if (creatinineClearance >= 15) interpretation = 'Severe kidney dysfunction';
      else interpretation = 'Kidney failure';

      return {
        result: parseFloat(creatinineClearance.toFixed(1)),
        interpretation
      };
    },
    formula: 'CrCl = [(140 - age) × weight] / (72 × Scr) × 0.85 (if female)',
    references: [
      'Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976.',
      'National Kidney Foundation. K/DOQI Clinical Practice Guidelines for Chronic Kidney Disease.',
      'American Society of Nephrology. Guidelines for estimating GFR.'
    ],
    resultUnit: 'mL/min'
  },
  'gfr': {
    id: 'gfr',
    fields: [
      { label: 'Age', placeholder: 'Enter age', unit: 'years', keyboardType: 'numeric' },
      { label: 'Serum Creatinine', placeholder: 'Enter creatinine', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Gender', placeholder: 'Enter 1 for male, 0 for female', unit: '', keyboardType: 'numeric' }
    ],
    validate: (values) => {
      const age = values.Age;
      const creatinine = values['Serum Creatinine'];
      const gender = values.Gender;
      
      if (!age || !creatinine || !gender) {
        return 'Please enter all required values';
      }
      
      const ageNum = parseInt(age);
      const creatinineNum = parseFloat(creatinine);
      const genderNum = parseInt(gender);
      
      if (isNaN(ageNum) || isNaN(creatinineNum) || isNaN(genderNum)) {
        return 'Please enter valid numbers for all values';
      }
      
      if (ageNum <= 0 || ageNum > 150) {
        return 'Age must be between 0 and 150 years';
      }
      
      if (creatinineNum <= 0 || creatinineNum > 20) {
        return 'Creatinine value seems unusual (normal range is typically <20 mg/dL)';
      }
      
      if (genderNum !== 0 && genderNum !== 1) {
        return 'Gender must be 0 (female) or 1 (male)';
      }
      
      return null; // No validation error
    },
    calculate: (values) => {
      const creatinine = parseFloat(values.Creatinine);
      const age = parseFloat(values.Age);
      const gender = parseInt(values.Gender);
      
      // MDRD equation
      let gfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
      if (gender === 0) { // female
        gfr *= 0.742;
      }
      
      let interpretation = '';
      if (gfr >= 90) interpretation = 'Normal kidney function';
      else if (gfr >= 60) interpretation = 'Mild kidney dysfunction';
      else if (gfr >= 30) interpretation = 'Moderate kidney dysfunction';
      else if (gfr >= 15) interpretation = 'Severe kidney dysfunction';
      else interpretation = 'Kidney failure';

      return {
        result: parseFloat(gfr.toFixed(1)),
        interpretation
      };
    },
    formula: 'GFR = 175 × Scr^(-1.154) × age^(-0.203) × 0.742 (if female)',
    references: [
      'National Kidney Foundation. K/DOQI Clinical Practice Guidelines for Chronic Kidney Disease.',
      'American Society of Nephrology. Guidelines for estimating GFR.',
      'Journal of the American Society of Nephrology. MDRD Study Equation.'
    ],
    resultUnit: 'mL/min/1.73m²'
  },
  'egfr': {
    id: 'egfr',
    fields: [
      { label: 'Age', placeholder: 'Enter age', unit: 'years', keyboardType: 'numeric' },
      { label: 'Serum Creatinine', placeholder: 'Enter creatinine', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Gender', placeholder: 'Enter 1 for male, 0 for female', unit: '', keyboardType: 'numeric' },
      { label: 'Race', placeholder: 'Enter 1 for Black, 0 for non-Black', unit: '', keyboardType: 'numeric' }
    ],
    validate: (values) => {
      const age = values.Age;
      const creatinine = values['Serum Creatinine'];
      const gender = values.Gender;
      const race = values.Race;
      
      if (!age || !creatinine || !gender || !race) {
        return 'Please enter all required values';
      }
      
      const ageNum = parseInt(age);
      const creatinineNum = parseFloat(creatinine);
      const genderNum = parseInt(gender);
      const raceNum = parseInt(race);
      
      if (isNaN(ageNum) || isNaN(creatinineNum) || isNaN(genderNum) || isNaN(raceNum)) {
        return 'Please enter valid numbers for all values';
      }
      
      if (ageNum <= 0 || ageNum > 150) {
        return 'Age must be between 0 and 150 years';
      }
      
      if (creatinineNum <= 0 || creatinineNum > 20) {
        return 'Creatinine value seems unusual (normal range is typically <20 mg/dL)';
      }
      
      if (genderNum !== 0 && genderNum !== 1) {
        return 'Gender must be 0 (female) or 1 (male)';
      }
      
      if (raceNum !== 0 && raceNum !== 1) {
        return 'Race must be 0 (non-Black) or 1 (Black)';
      }
      
      return null; // No validation error
    },
    calculate: (values) => {
      const creatinine = parseFloat(values.Creatinine);
      const age = parseFloat(values.Age);
      const gender = parseInt(values.Gender);
      const isBlack = parseInt(values.Race) === 1;
      
      // MDRD equation
      let egfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
      if (gender === 0) egfr *= 0.742; // Female adjustment
      if (isBlack) egfr *= 1.212; // Race adjustment
      
      let interpretation = '';
      if (egfr >= 90) interpretation = 'Normal kidney function';
      else if (egfr >= 60) interpretation = 'Mild kidney dysfunction';
      else if (egfr >= 30) interpretation = 'Moderate kidney dysfunction';
      else if (egfr >= 15) interpretation = 'Severe kidney dysfunction';
      else interpretation = 'Kidney failure';

      return {
        result: parseFloat(egfr.toFixed(1)),
        interpretation
      };
    },
    formula: 'eGFR = 175 × Scr^(-1.154) × age^(-0.203) × 0.742[if female] × 1.212[if Black]',
    references: [
      'National Kidney Foundation. KDIGO Guidelines for CKD.',
      'American Journal of Kidney Diseases. MDRD Study Equation.',
      'Clinical Journal of the American Society of Nephrology. eGFR Calculation Methods.'
    ],
    resultUnit: 'mL/min/1.73m²'
  },
  'wells-dvt': {
    id: 'wells-dvt',
    fields: [
      { label: 'Active Cancer', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Paralysis/Cast', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Recent Surgery', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Tenderness', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Swelling', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Alternative Diagnosis', placeholder: 'Enter 1 if less likely', unit: 'points', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      const score = Object.values(values).reduce((sum, val) => sum + parseInt(val), 0);
      
      let interpretation = '';
      if (score <= 1) {
        interpretation = 'Low risk for DVT (≈5% probability)';
      } else if (score === 2) {
        interpretation = 'Moderate risk for DVT (≈17% probability)';
      } else {
        interpretation = 'High risk for DVT (≈17-53% probability)';
      }

      return {
        result: score,
        interpretation
      };
    },
    formula: 'Sum of points:\n• Active cancer (1 point)\n• Paralysis/Cast (1 point)\n• Recent surgery (1 point)\n• Tenderness (1 point)\n• Swelling (1 point)\n• Alternative diagnosis less likely (1 point)',
    references: [
      'Wells PS, et al. Value of assessment of pretest probability of deep-vein thrombosis in clinical management.',
      'JAMA. Clinical Decision Rules for DVT Diagnosis.',
      'Annals of Internal Medicine. Validation of the Wells Score for DVT.'
    ],
    resultUnit: 'points'
  },
  'cha2ds2-vasc': {
    id: 'cha2ds2-vasc',
    fields: [
      { label: 'CHF', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Hypertension', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Age ≥75', placeholder: 'Enter 2 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Diabetes', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Stroke/TIA', placeholder: 'Enter 2 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Vascular Disease', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Age 65-74', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' },
      { label: 'Female Sex', placeholder: 'Enter 1 if present', unit: 'points', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      const score = Object.values(values).reduce((sum, val) => sum + parseInt(val), 0);
      
      let interpretation = '';
      if (score === 0) {
        interpretation = 'Low risk. Consider no anticoagulation.';
      } else if (score === 1) {
        interpretation = 'Moderate risk. Consider oral anticoagulation.';
      } else {
        interpretation = 'High risk. Oral anticoagulation recommended.';
      }

      return {
        result: score,
        interpretation
      };
    },
    formula: 'Sum of points:\n• CHF (1 point)\n• Hypertension (1 point)\n• Age ≥75 (2 points)\n• Diabetes (1 point)\n• Stroke/TIA (2 points)\n• Vascular disease (1 point)\n• Age 65-74 (1 point)\n• Female sex (1 point)',
    references: [
      'European Heart Journal. 2020 ESC Guidelines for AF Management.',
      'American Heart Association. Stroke Risk Stratification in AF.',
      'Chest. Antithrombotic Therapy for Atrial Fibrillation.'
    ],
    resultUnit: 'points'
  },
  'meld': {
    id: 'meld',
    fields: [
      { label: 'Bilirubin', placeholder: 'Enter total bilirubin', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'INR', placeholder: 'Enter INR', unit: '', keyboardType: 'decimal-pad' },
      { label: 'Creatinine', placeholder: 'Enter creatinine', unit: 'mg/dL', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const bilirubin = Math.max(1, parseFloat(values.Bilirubin));
      const inr = Math.max(1, parseFloat(values.INR));
      const creatinine = Math.max(1, Math.min(4, parseFloat(values.Creatinine)));
      
      // MELD = 3.78×ln[serum bilirubin] + 11.2×ln[INR] + 9.57×ln[serum creatinine] + 6.43
      const meld = Math.round(
        3.78 * Math.log(bilirubin) +
        11.2 * Math.log(inr) +
        9.57 * Math.log(creatinine) +
        6.43
      );
      
      let interpretation = '';
      if (meld < 10) interpretation = 'Low mortality risk (1.9% 3-month mortality)';
      else if (meld <= 19) interpretation = 'Moderate mortality risk (6% 3-month mortality)';
      else if (meld <= 29) interpretation = 'High mortality risk (19.6% 3-month mortality)';
      else if (meld <= 39) interpretation = 'Very high mortality risk (52.6% 3-month mortality)';
      else interpretation = 'Extremely high mortality risk (71.3% 3-month mortality)';

      return {
        result: meld,
        interpretation
      };
    },
    formula: 'MELD = 3.78×ln[bilirubin] + 11.2×ln[INR] + 9.57×ln[creatinine] + 6.43',
    references: [
      'United Network for Organ Sharing (UNOS). MELD Calculator.',
      'American Association for the Study of Liver Diseases. MELD Score in End-Stage Liver Disease.',
      'Journal of Hepatology. Model for End-Stage Liver Disease (MELD).'
    ],
    resultUnit: 'points'
  },
  'apache-ii': {
    id: 'apache-ii',
    fields: [
      { label: 'Age', placeholder: 'Enter age', unit: 'years', keyboardType: 'numeric' },
      { label: 'Temperature', placeholder: 'Enter temperature', unit: '°C', keyboardType: 'decimal-pad' },
      { label: 'Mean BP', placeholder: 'Enter mean arterial pressure', unit: 'mmHg', keyboardType: 'numeric' },
      { label: 'Heart Rate', placeholder: 'Enter heart rate', unit: 'bpm', keyboardType: 'numeric' },
      { label: 'Respiratory Rate', placeholder: 'Enter respiratory rate', unit: '/min', keyboardType: 'numeric' },
      { label: 'Oxygenation', placeholder: 'Enter PaO2', unit: 'mmHg', keyboardType: 'decimal-pad' },
      { label: 'Arterial pH', placeholder: 'Enter arterial pH', unit: '', keyboardType: 'decimal-pad' },
      { label: 'Sodium', placeholder: 'Enter sodium', unit: 'mEq/L', keyboardType: 'numeric' },
      { label: 'Potassium', placeholder: 'Enter potassium', unit: 'mEq/L', keyboardType: 'decimal-pad' },
      { label: 'Creatinine', placeholder: 'Enter creatinine', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Hematocrit', placeholder: 'Enter hematocrit', unit: '%', keyboardType: 'decimal-pad' },
      { label: 'WBC', placeholder: 'Enter white blood count', unit: '×10³/µL', keyboardType: 'decimal-pad' },
      { label: 'Glasgow Coma', placeholder: 'Enter GCS (3-15)', unit: 'points', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      // This is a simplified version of APACHE II scoring
      // In practice, each parameter has its own scoring table
      const age = parseInt(values.Age);
      const gcs = parseInt(values['Glasgow Coma']);
      
      // Simplified score calculation (actual implementation would be more complex)
      let score = 0;
      
      // Age points
      if (age >= 75) score += 6;
      else if (age >= 65) score += 5;
      else if (age >= 55) score += 3;
      else if (age >= 45) score += 2;
      
      // GCS points (15 - GCS)
      score += (15 - gcs);
      
      // Add points for other physiological parameters
      // This is a simplified version
      
      let interpretation = '';
      if (score < 10) interpretation = 'Low risk (≈15% mortality)';
      else if (score <= 20) interpretation = 'Moderate risk (≈25% mortality)';
      else if (score <= 30) interpretation = 'High risk (≈50% mortality)';
      else interpretation = 'Very high risk (>80% mortality)';

      return {
        result: score,
        interpretation
      };
    },
    formula: 'APACHE II = Sum of points from:\n• Age\n• Temperature\n• Mean BP\n• Heart Rate\n• Respiratory Rate\n• Oxygenation\n• Arterial pH\n• Sodium\n• Potassium\n• Creatinine\n• Hematocrit\n• WBC\n• Glasgow Coma Scale',
    references: [
      'Critical Care Medicine. APACHE II: A severity of disease classification system.',
      'Intensive Care Medicine. Validation of the APACHE II scoring system.',
      'Chest. Mortality Prediction with APACHE II.'
    ],
    resultUnit: 'points'
  },
  'sofa': {
    id: 'sofa',
    fields: [
      { label: 'PaO2/FiO2', placeholder: 'Enter PaO2/FiO2 ratio', unit: 'mmHg', keyboardType: 'numeric' },
      { label: 'Platelets', placeholder: 'Enter platelet count', unit: '×10³/µL', keyboardType: 'numeric' },
      { label: 'Bilirubin', placeholder: 'Enter bilirubin', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'MAP', placeholder: 'Enter mean arterial pressure', unit: 'mmHg', keyboardType: 'numeric' },
      { label: 'Glasgow Coma', placeholder: 'Enter GCS (3-15)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Creatinine', placeholder: 'Enter creatinine', unit: 'mg/dL', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      // Simplified SOFA score calculation
      let score = 0;
      
      // PaO2/FiO2 scoring
      const pao2fio2 = parseInt(values['PaO2/FiO2']);
      if (pao2fio2 < 100) score += 4;
      else if (pao2fio2 < 200) score += 3;
      else if (pao2fio2 < 300) score += 2;
      else if (pao2fio2 < 400) score += 1;
      
      // Platelets scoring
      const platelets = parseInt(values.Platelets);
      if (platelets < 20) score += 4;
      else if (platelets < 50) score += 3;
      else if (platelets < 100) score += 2;
      else if (platelets < 150) score += 1;
      
      // Add other organ system scores...
      
      let interpretation = '';
      if (score < 7) interpretation = 'Low risk of mortality (<10%)';
      else if (score <= 11) interpretation = 'Moderate risk of mortality (15-20%)';
      else if (score <= 14) interpretation = 'High risk of mortality (40-50%)';
      else interpretation = 'Very high risk of mortality (>80%)';

      return {
        result: score,
        interpretation
      };
    },
    formula: 'SOFA = Sum of points from 6 organ systems:\n• Respiratory (PaO2/FiO2)\n• Coagulation (Platelets)\n• Liver (Bilirubin)\n• Cardiovascular (MAP)\n• CNS (Glasgow Coma)\n• Renal (Creatinine)',
    references: [
      'JAMA. The SOFA Score to Describe Organ Dysfunction/Failure.',
      'Critical Care Medicine. Sequential Organ Failure Assessment Score.',
      'Intensive Care Medicine. SOFA Score in Sepsis.'
    ],
    resultUnit: 'points'
  },
  'alvarado': {
    id: 'alvarado',
    fields: [
      { label: 'Migration', placeholder: 'RLQ pain migration (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Anorexia', placeholder: 'Loss of appetite (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Nausea', placeholder: 'Nausea/vomiting (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Tenderness', placeholder: 'RLQ tenderness (0-2)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Rebound', placeholder: 'Rebound pain (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Temperature', placeholder: 'Fever >37.3°C (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Leukocytosis', placeholder: 'WBC >10,000 (0-2)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Shift', placeholder: 'Neutrophil shift (0-1)', unit: 'points', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      const score = Object.values(values).reduce((sum, val) => sum + parseInt(val), 0);
      
      let interpretation = '';
      if (score <= 3) {
        interpretation = 'Low risk for appendicitis. Observation may be warranted.';
      } else if (score <= 6) {
        interpretation = 'Intermediate risk. Consider imaging studies.';
      } else if (score <= 8) {
        interpretation = 'High risk. Surgical consultation recommended.';
      } else {
        interpretation = 'Very high risk. Immediate surgical evaluation needed.';
      }

      return {
        result: score,
        interpretation
      };
    },
    formula: 'Alvarado Score = Sum of points:\n• Migration of pain (1)\n• Anorexia (1)\n• Nausea/Vomiting (1)\n• RLQ tenderness (2)\n• Rebound pain (1)\n• Elevated temperature (1)\n• Leukocytosis (2)\n• Neutrophil shift (1)',
    references: [
      'Alvarado A. A practical score for the early diagnosis of acute appendicitis.',
      'Annals of Emergency Medicine. Validation of the Alvarado Score.',
      'World Journal of Surgery. Clinical Application of the Alvarado Score.'
    ],
    resultUnit: 'points'
  },
  'alveolar-gas': {
    id: 'alveolar-gas',
    fields: [
      { label: 'FiO2', placeholder: 'Enter FiO2 (0.21-1.0)', unit: '', keyboardType: 'decimal-pad' },
      { label: 'PB', placeholder: 'Enter barometric pressure', unit: 'mmHg', keyboardType: 'decimal-pad' },
      { label: 'PH2O', placeholder: 'Enter water vapor pressure (usually 47)', unit: 'mmHg', keyboardType: 'decimal-pad' },
      { label: 'PaCO2', placeholder: 'Enter arterial CO2', unit: 'mmHg', keyboardType: 'decimal-pad' },
      { label: 'RQ', placeholder: 'Enter respiratory quotient (usually 0.8)', unit: '', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const fio2 = parseFloat(values.FiO2);
      const pb = parseFloat(values.PB);
      const ph2o = parseFloat(values.PH2O);
      const paco2 = parseFloat(values.PaCO2);
      const rq = parseFloat(values.RQ);
      
      // PAO2 = [FiO2 × (PB - PH2O)] - (PaCO2/RQ)
      const pao2 = (fio2 * (pb - ph2o)) - (paco2/rq);
      
      let interpretation = '';
      if (pao2 < 60) interpretation = 'Severely decreased alveolar oxygen';
      else if (pao2 < 80) interpretation = 'Moderately decreased alveolar oxygen';
      else if (pao2 <= 100) interpretation = 'Mildly decreased alveolar oxygen';
      else interpretation = 'Normal alveolar oxygen level';

      return {
        result: parseFloat(pao2.toFixed(1)),
        interpretation
      };
    },
    formula: 'PAO2 = [FiO2 × (PB - PH2O)] - (PaCO2/RQ)',
    references: [
      'West JB. Respiratory Physiology: The Essentials.',
      'American Journal of Respiratory and Critical Care Medicine. Alveolar Gas Equation.',
      'Critical Care Medicine. Assessment of Oxygenation.'
    ],
    resultUnit: 'mmHg'
  },
  'curb-65': {
    id: 'curb-65',
    fields: [
      { label: 'Confusion', placeholder: 'New onset confusion (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Urea', placeholder: 'BUN > 19 mg/dL (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Respiratory Rate', placeholder: 'RR ≥ 30/min (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Blood Pressure', placeholder: 'BP < 90/60 (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Age', placeholder: 'Age ≥ 65 (0-1)', unit: 'points', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      const score = Object.values(values).reduce((sum, val) => sum + parseInt(val), 0);
      
      let interpretation = '';
      if (score === 0) {
        interpretation = 'Low risk - Consider outpatient treatment (0.6% mortality)';
      } else if (score === 1) {
        interpretation = 'Low risk - Consider outpatient treatment (2.7% mortality)';
      } else if (score === 2) {
        interpretation = 'Moderate risk - Consider hospital admission (6.8% mortality)';
      } else if (score === 3) {
        interpretation = 'Severe - Hospitalize (14% mortality)';
      } else {
        interpretation = 'Very severe - Consider ICU (27.8% mortality)';
      }

      return {
        result: score,
        interpretation
      };
    },
    formula: 'CURB-65 = Sum of points:\n• Confusion\n• Urea >7 mmol/L (BUN >19 mg/dL)\n• Respiratory rate ≥30/min\n• BP <90 systolic or ≤60 diastolic\n• Age ≥65',
    references: [
      'Lim WS, et al. Defining community acquired pneumonia severity on presentation to hospital.',
      'British Thoracic Society. Guidelines for the Management of Community Acquired Pneumonia.',
      'Thorax. Validation of the CURB-65 Score.'
    ],
    resultUnit: 'points'
  },
  'pvr': {
    id: 'pvr',
    fields: [
      { label: 'Mean PA', placeholder: 'Enter mean pulmonary artery pressure', unit: 'mmHg', keyboardType: 'decimal-pad' },
      { label: 'PCWP', placeholder: 'Enter pulmonary capillary wedge pressure', unit: 'mmHg', keyboardType: 'decimal-pad' },
      { label: 'CO', placeholder: 'Enter cardiac output', unit: 'L/min', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const mpa = parseFloat(values['Mean PA']);
      const pcwp = parseFloat(values.PCWP);
      const co = parseFloat(values.CO);
      
      // PVR = [(mPAP - PCWP) / CO] × 80
      const pvr = ((mpa - pcwp) / co) * 80;
      
      let interpretation = '';
      if (pvr < 120) interpretation = 'Normal PVR';
      else if (pvr < 240) interpretation = 'Mildly elevated PVR';
      else if (pvr < 320) interpretation = 'Moderately elevated PVR';
      else interpretation = 'Severely elevated PVR';

      return {
        result: parseFloat(pvr.toFixed(1)),
        interpretation
      };
    },
    formula: 'PVR (dynes·sec·cm⁻⁵) = [(mPAP - PCWP) / CO] × 80',
    references: [
      'European Heart Journal. Guidelines for the Diagnosis and Treatment of Pulmonary Hypertension.',
      'Circulation. Hemodynamic Assessment in Heart Failure.',
      'American Journal of Respiratory and Critical Care Medicine. PVR Assessment.'
    ],
    resultUnit: 'dynes·sec·cm⁻⁵'
  },
  'abi': {
    id: 'abi',
    fields: [
      { label: 'Ankle SBP', placeholder: 'Enter ankle systolic BP', unit: 'mmHg', keyboardType: 'numeric' },
      { label: 'Brachial SBP', placeholder: 'Enter brachial systolic BP', unit: 'mmHg', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      const ankleSBP = parseFloat(values['Ankle SBP']);
      const brachialSBP = parseFloat(values['Brachial SBP']);
      
      const abi = ankleSBP / brachialSBP;
      
      let interpretation = '';
      if (abi > 1.4) interpretation = 'Noncompressible vessels - Consider arterial calcification';
      else if (abi >= 0.9) interpretation = 'Normal ABI';
      else if (abi >= 0.7) interpretation = 'Mild peripheral arterial disease';
      else if (abi >= 0.5) interpretation = 'Moderate peripheral arterial disease';
      else interpretation = 'Severe peripheral arterial disease';

      return {
        result: parseFloat(abi.toFixed(2)),
        interpretation
      };
    },
    formula: 'ABI = Ankle Systolic BP / Brachial Systolic BP',
    references: [
      'American College of Cardiology/American Heart Association. PAD Guidelines.',
      'Journal of Vascular Surgery. ABI Measurement and Interpretation.',
      'Circulation. Diagnosis and Management of Peripheral Arterial Disease.'
    ],
    resultUnit: ''  // ratio has no unit
  },
  'p50': {
    id: 'p50',
    fields: [
      { label: 'PO2', placeholder: 'Enter PO2', unit: 'mmHg', keyboardType: 'decimal-pad' },
      { label: 'SO2', placeholder: 'Enter O2 saturation', unit: '%', keyboardType: 'decimal-pad' },
      { label: 'pH', placeholder: 'Enter pH', unit: '', keyboardType: 'decimal-pad' },
      { label: 'Temperature', placeholder: 'Enter temperature', unit: '°C', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const po2 = parseFloat(values.PO2);
      const so2 = parseFloat(values.SO2) / 100;
      const ph = parseFloat(values.pH);
      const temp = parseFloat(values.Temperature);
      
      // This is a simplified calculation
      // Actual P50 calculation is more complex and requires multiple measurements
      const p50 = po2 * Math.pow((0.5/so2 - 0.5), 1/2.7);
      
      // Adjust for pH and temperature
      const p50Adjusted = p50 * Math.pow(10, 0.48 * (7.4 - ph)) * Math.pow(1.0134, (37 - temp));
      
      let interpretation = '';
      if (p50Adjusted < 22) interpretation = 'Left-shifted oxygen dissociation curve - Increased O2 affinity';
      else if (p50Adjusted <= 26) interpretation = 'Normal P50';
      else interpretation = 'Right-shifted oxygen dissociation curve - Decreased O2 affinity';

      return {
        result: parseFloat(p50Adjusted.toFixed(1)),
        interpretation
      };
    },
    formula: 'P50 = PO2 × [(0.5/SO2 - 0.5)^(1/2.7)]\nAdjusted for pH and temperature',
    references: [
      'Clinical Chemistry. Measurement and Interpretation of P50.',
      'American Journal of Physiology. Oxygen-Hemoglobin Dissociation Curve.',
      'Critical Care Medicine. Assessment of Oxygen Transport.'
    ],
    resultUnit: 'mmHg'
  },
  'tcpo2': {
    id: 'tcpo2',
    fields: [
      { label: 'TcPO2', placeholder: 'Enter TcPO2 reading', unit: 'mmHg', keyboardType: 'decimal-pad' },
      { label: 'PaO2', placeholder: 'Enter arterial PaO2', unit: 'mmHg', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const tcpo2 = parseFloat(values.TcPO2);
      const pao2 = parseFloat(values.PaO2);
      
      // Calculate TcPO2/PaO2 ratio
      const ratio = tcpo2 / pao2;
      
      let interpretation = '';
      if (ratio < 0.7) interpretation = 'Poor tissue oxygenation - Consider impaired perfusion';
      else if (ratio <= 0.8) interpretation = 'Borderline tissue oxygenation';
      else if (ratio <= 1.0) interpretation = 'Normal tissue oxygenation';
      else interpretation = 'Elevated ratio - Consider technical measurement issues';

      return {
        result: parseFloat(ratio.toFixed(2)),
        interpretation
      };
    },
    formula: 'TcPO2/PaO2 Ratio = TcPO2 / PaO2',
    references: [
      'Journal of Vascular Surgery. Transcutaneous Oximetry in Clinical Practice.',
      'Wound Repair and Regeneration. TcPO2 Measurements in Wound Healing.',
      'European Journal of Vascular Medicine. Guidelines for TcPO2 Assessment.'
    ],
    resultUnit: ''  // ratio has no unit
  },
  'ahi': {
    id: 'ahi',
    fields: [
      { label: 'Apneas', placeholder: 'Enter number of apneas', unit: 'events', keyboardType: 'numeric' },
      { label: 'Hypopneas', placeholder: 'Enter number of hypopneas', unit: 'events', keyboardType: 'numeric' },
      { label: 'Sleep Time', placeholder: 'Enter total sleep time', unit: 'hours', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const apneas = parseInt(values.Apneas);
      const hypopneas = parseInt(values.Hypopneas);
      const sleepTime = parseFloat(values['Sleep Time']);
      
      // AHI = (apneas + hypopneas) / hours of sleep
      const ahi = (apneas + hypopneas) / sleepTime;
      
      let interpretation = '';
      if (ahi < 5) interpretation = 'Normal - AHI < 5';
      else if (ahi < 15) interpretation = 'Mild sleep apnea - AHI 5-14';
      else if (ahi < 30) interpretation = 'Moderate sleep apnea - AHI 15-29';
      else interpretation = 'Severe sleep apnea - AHI ≥ 30';

      return {
        result: parseFloat(ahi.toFixed(1)),
        interpretation
      };
    },
    formula: 'AHI = (Number of apneas + hypopneas) / Hours of sleep',
    references: [
      'American Academy of Sleep Medicine. Guidelines for Scoring Respiratory Events.',
      'Sleep Medicine Reviews. Classification of Sleep Disorders.',
      'Journal of Clinical Sleep Medicine. AHI Measurement Standards.'
    ],
    resultUnit: 'events/hour'
  },
  'glasgow-blatchford': {
    id: 'glasgow-blatchford',
    fields: [
      { label: 'BUN', placeholder: 'Enter blood urea nitrogen', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Hemoglobin', placeholder: 'Enter hemoglobin', unit: 'g/dL', keyboardType: 'decimal-pad' },
      { label: 'SBP', placeholder: 'Enter systolic blood pressure', unit: 'mmHg', keyboardType: 'numeric' },
      { label: 'Heart Rate', placeholder: 'Enter heart rate', unit: 'bpm', keyboardType: 'numeric' },
      { label: 'Melena', placeholder: 'Present (1) or absent (0)', unit: '', keyboardType: 'numeric' },
      { label: 'Syncope', placeholder: 'Present (1) or absent (0)', unit: '', keyboardType: 'numeric' },
      { label: 'Liver Disease', placeholder: 'Present (1) or absent (0)', unit: '', keyboardType: 'numeric' },
      { label: 'Heart Failure', placeholder: 'Present (1) or absent (0)', unit: '', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      let score = 0;
      
      // BUN scoring
      const bun = parseFloat(values.BUN);
      if (bun >= 18.2 && bun < 22.4) score += 2;
      else if (bun >= 22.4 && bun < 28) score += 3;
      else if (bun >= 28) score += 4;
      
      // Hemoglobin scoring
      const hb = parseFloat(values.Hemoglobin);
      if (hb < 10 && hb >= 8) score += 3;
      else if (hb < 8) score += 6;
      
      // SBP scoring
      const sbp = parseInt(values.SBP);
      if (sbp < 109 && sbp >= 90) score += 1;
      else if (sbp < 90) score += 2;
      
      // Other parameters
      if (parseInt(values['Heart Rate']) >= 100) score += 1;
      if (parseInt(values.Melena) === 1) score += 1;
      if (parseInt(values.Syncope) === 1) score += 2;
      if (parseInt(values['Liver Disease']) === 1) score += 2;
      if (parseInt(values['Heart Failure']) === 1) score += 2;
      
      let interpretation = '';
      if (score === 0) interpretation = 'Very low risk - Consider outpatient management';
      else if (score <= 2) interpretation = 'Low risk - Consider outpatient management';
      else if (score <= 5) interpretation = 'Moderate risk - Consider admission';
      else if (score <= 8) interpretation = 'High risk - Requires admission';
      else interpretation = 'Very high risk - Urgent intervention needed';

      return {
        result: score,
        interpretation
      };
    },
    formula: 'Score based on:\n• BUN level\n• Hemoglobin\n• Systolic BP\n• Heart rate\n• Melena\n• Syncope\n• Liver disease\n• Heart failure',
    references: [
      'Blatchford O, et al. A risk score to predict need for treatment for upper-GI hemorrhage.',
      'Gut. Risk Assessment Scores for Gastrointestinal Bleeding.',
      'American Journal of Gastroenterology. Management of Upper GI Bleeding.'
    ],
    resultUnit: 'points'
  },
  'friedewald': {
    id: 'friedewald',
    fields: [
      { label: 'Total Cholesterol', placeholder: 'Enter total cholesterol', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'HDL', placeholder: 'Enter HDL cholesterol', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Triglycerides', placeholder: 'Enter triglycerides', unit: 'mg/dL', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const tc = parseFloat(values['Total Cholesterol']);
      const hdl = parseFloat(values.HDL);
      const tg = parseFloat(values.Triglycerides);
      
      // LDL = TC - HDL - (TG/5)
      const ldl = tc - hdl - (tg/5);
      
      let interpretation = '';
      if (ldl < 100) interpretation = 'Optimal LDL level';
      else if (ldl < 130) interpretation = 'Near optimal/above optimal LDL';
      else if (ldl < 160) interpretation = 'Borderline high LDL';
      else if (ldl < 190) interpretation = 'High LDL';
      else interpretation = 'Very high LDL';

      return {
        result: parseFloat(ldl.toFixed(1)),
        interpretation
      };
    },
    formula: 'LDL = Total Cholesterol - HDL - (Triglycerides/5)',
    references: [
      'Friedewald WT, et al. Estimation of LDL-cholesterol concentration without ultracentrifugation.',
      'Clinical Chemistry. LDL Cholesterol Calculation Methods.',
      'Journal of Lipid Research. Validation of the Friedewald Formula.'
    ],
    resultUnit: 'mg/dL'
  },
  'serum-osmolality': {
    id: 'serum-osmolality',
    fields: [
      { label: 'Sodium', placeholder: 'Enter sodium', unit: 'mEq/L', keyboardType: 'decimal-pad' },
      { label: 'Glucose', placeholder: 'Enter glucose', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'BUN', placeholder: 'Enter blood urea nitrogen', unit: 'mg/dL', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const sodium = parseFloat(values.Sodium);
      const glucose = parseFloat(values.Glucose);
      const bun = parseFloat(values.BUN);
      
      // Calculated Osmolality = 2 × Na + (Glucose/18) + (BUN/2.8)
      const osmolality = 2 * sodium + (glucose/18) + (bun/2.8);
      
      let interpretation = '';
      if (osmolality < 275) interpretation = 'Hypoosmolar state';
      else if (osmolality <= 295) interpretation = 'Normal serum osmolality';
      else if (osmolality <= 320) interpretation = 'Mild to moderate hyperosmolar state';
      else interpretation = 'Severe hyperosmolar state';

      return {
        result: parseFloat(osmolality.toFixed(1)),
        interpretation
      };
    },
    formula: 'Serum Osmolality = 2 × Na + (Glucose/18) + (BUN/2.8)',
    references: [
      'Clinical Chemistry. Measurement and Interpretation of Serum Osmolality.',
      'American Journal of Medicine. Assessment of Volume Status.',
      'Critical Care Medicine. Management of Osmolar Disorders.'
    ],
    resultUnit: 'mOsm/kg'
  },
  'naranjo': {
    id: 'naranjo',
    fields: [
      { label: 'Previous Reports', placeholder: 'Previous reports of reaction (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'After Drug', placeholder: 'Adverse event after drug (0-2)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Alternative Causes', placeholder: 'Alternative causes (-1 to 2)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Drug Levels', placeholder: 'Drug levels/toxicity (-1 to 1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Dose Relationship', placeholder: 'Dose-response relationship (-1 to 1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Rechallenge', placeholder: 'Reaction to placebo (-1 to 1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Objective Evidence', placeholder: 'Objective evidence (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Previous Exposure', placeholder: 'Similar reaction to previous exposure (0-1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Placebo', placeholder: 'Reaction to placebo (-1 to 1)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Confirmation', placeholder: 'Objective confirmation (0-1)', unit: 'points', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      const score = Object.values(values).reduce((sum, val) => sum + parseInt(val), 0);
      
      let interpretation = '';
      if (score <= 0) interpretation = 'Doubtful adverse drug reaction';
      else if (score <= 4) interpretation = 'Possible adverse drug reaction';
      else if (score <= 8) interpretation = 'Probable adverse drug reaction';
      else interpretation = 'Definite adverse drug reaction';

      return {
        result: score,
        interpretation
      };
    },
    formula: 'Sum of scores from 10 questions assessing causality of adverse drug reactions',
    references: [
      'Naranjo CA, et al. A method for estimating the probability of adverse drug reactions.',
      'Clinical Pharmacology & Therapeutics. Adverse Drug Reaction Probability Scale.',
      'Drug Safety. Assessment of Adverse Drug Reactions.'
    ],
    resultUnit: 'points'
  },
  'framingham': {
    id: 'framingham',
    fields: [
      { label: 'Age', placeholder: 'Enter age', unit: 'years', keyboardType: 'numeric' },
      { label: 'Gender', placeholder: 'Enter 1 for male, 0 for female', unit: '', keyboardType: 'numeric' },
      { label: 'Total Cholesterol', placeholder: 'Enter total cholesterol', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'HDL', placeholder: 'Enter HDL', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'SBP', placeholder: 'Enter systolic blood pressure', unit: 'mmHg', keyboardType: 'numeric' },
      { label: 'Smoking', placeholder: 'Current smoker (1) or not (0)', unit: '', keyboardType: 'numeric' },
      { label: 'Diabetes', placeholder: 'Diabetes present (1) or not (0)', unit: '', keyboardType: 'numeric' },
      { label: 'Treatment', placeholder: 'On BP treatment (1) or not (0)', unit: '', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      // This is a simplified version of the Framingham calculation
      // The actual calculation involves complex coefficients and logarithmic equations
      let points = 0;
      const age = parseInt(values.Age);
      const gender = parseInt(values.Gender);
      const tc = parseFloat(values['Total Cholesterol']);
      const hdl = parseFloat(values.HDL);
      const sbp = parseInt(values.SBP);
      
      // Age points
      points += Math.floor((age - 20) / 10);
      
      // Cholesterol points
      if (tc > 240) points += 2;
      else if (tc > 200) points += 1;
      
      // HDL points
      if (hdl < 40) points += 2;
      else if (hdl > 60) points -= 1;
      
      // Blood pressure points
      if (sbp > 160) points += 3;
      else if (sbp > 140) points += 2;
      else if (sbp > 120) points += 1;
      
      // Other risk factors
      if (parseInt(values.Smoking) === 1) points += 2;
      if (parseInt(values.Diabetes) === 1) points += 2;
      if (parseInt(values.Treatment) === 1) points += 1;
      
      // Calculate 10-year risk (simplified)
      const risk = Math.min(30, points * 2);
      
      let interpretation = '';
      if (risk < 10) interpretation = 'Low 10-year cardiovascular risk';
      else if (risk < 20) interpretation = 'Intermediate 10-year cardiovascular risk';
      else interpretation = 'High 10-year cardiovascular risk';

      return {
        result: risk,
        interpretation
      };
    },
    formula: 'Risk score based on:\n• Age\n• Gender\n• Total Cholesterol\n• HDL\n• Systolic BP\n• Smoking status\n• Diabetes\n• BP treatment',
    references: [
      'D\'Agostino RB, et al. General Cardiovascular Risk Profile for Use in Primary Care.',
      'Circulation. Framingham Heart Study Risk Score Calculator.',
      'New England Journal of Medicine. Primary Prevention of Cardiovascular Disease.'
    ],
    resultUnit: '%'
  },
  'reynolds-risk': {
    id: 'reynolds-risk',
    fields: [
      { label: 'Age', placeholder: 'Enter age', unit: 'years', keyboardType: 'numeric' },
      { label: 'Gender', placeholder: 'Enter 1 for male, 0 for female', unit: '', keyboardType: 'numeric' },
      { label: 'Systolic BP', placeholder: 'Enter systolic blood pressure', unit: 'mmHg', keyboardType: 'numeric' },
      { label: 'Total Cholesterol', placeholder: 'Enter total cholesterol', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'HDL', placeholder: 'Enter HDL cholesterol', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'hsCRP', placeholder: 'Enter high-sensitivity CRP', unit: 'mg/L', keyboardType: 'decimal-pad' },
      { label: 'Family History', placeholder: 'Early MI in parent (1) or not (0)', unit: '', keyboardType: 'numeric' },
      { label: 'Smoking', placeholder: 'Current smoker (1) or not (0)', unit: '', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      // This is a simplified version of the Reynolds Risk Score
      // The actual calculation involves complex coefficients and logarithmic equations
      let points = 0;
      const age = parseInt(values.Age);
      const gender = parseInt(values.Gender);
      const sbp = parseInt(values['Systolic BP']);
      const tc = parseFloat(values['Total Cholesterol']);
      const hdl = parseFloat(values.HDL);
      const crp = parseFloat(values.hsCRP);
      
      // Basic point calculation
      points += Math.floor((age - 20) / 10);
      points += (sbp > 140 ? 2 : 0);
      points += (tc > 200 ? 2 : 0);
      points += (hdl < 40 ? 2 : 0);
      points += (crp > 3 ? 2 : 0);
      points += (parseInt(values['Family History']) === 1 ? 2 : 0);
      points += (parseInt(values.Smoking) === 1 ? 2 : 0);
      
      // Calculate 10-year risk (simplified)
      const risk = Math.min(40, points * 2);
      
      let interpretation = '';
      if (risk < 5) interpretation = 'Low cardiovascular risk';
      else if (risk < 10) interpretation = 'Low-intermediate cardiovascular risk';
      else if (risk < 20) interpretation = 'Intermediate cardiovascular risk';
      else interpretation = 'High cardiovascular risk';

      return {
        result: risk,
        interpretation
      };
    },
    formula: 'Risk score based on:\n• Age\n• Gender\n• Systolic BP\n• Total Cholesterol\n• HDL\n• hsCRP\n• Family History\n• Smoking status',
    references: [
      'Ridker PM, et al. Development and validation of improved algorithms for the assessment of global cardiovascular risk in women.',
      'Circulation. Reynolds Risk Score.',
      'Journal of the American Medical Association. Novel Markers for Cardiovascular Risk Assessment.'
    ],
    resultUnit: '%'
  },
  'cha2ds2': {
    id: 'cha2ds2',
    fields: [
      { label: 'CHF', placeholder: 'Heart failure present (1) or not (0)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Hypertension', placeholder: 'Hypertension present (1) or not (0)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Age', placeholder: 'Age ≥75 years (2) or not (0)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Diabetes', placeholder: 'Diabetes present (1) or not (0)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Stroke/TIA', placeholder: 'Prior stroke/TIA (2) or not (0)', unit: 'points', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      const score = Object.values(values).reduce((sum, val) => sum + parseInt(val), 0);
      
      let interpretation = '';
      if (score === 0) {
        interpretation = 'Low risk - No anticoagulation recommended';
      } else if (score === 1) {
        interpretation = 'Moderate risk - Consider anticoagulation';
      } else {
        interpretation = 'High risk - Anticoagulation recommended';
      }

      return {
        result: score,
        interpretation
      };
    },
    formula: 'Sum of points:\n• CHF (1 point)\n• Hypertension (1 point)\n• Age ≥75 (2 points)\n• Diabetes (1 point)\n• Stroke/TIA (2 points)',
    references: [
      'European Heart Journal. Guidelines for AF Management.',
      'Chest. Antithrombotic Therapy for Atrial Fibrillation.',
      'Circulation. Stroke Risk Stratification in AF.'
    ],
    resultUnit: 'points'
  },
  'pediatric-gcs': {
    id: 'pediatric-gcs',
    fields: [
      { label: 'Eye Opening', placeholder: 'Enter score (1-4)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Verbal Response', placeholder: 'Enter score (1-5)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Motor Response', placeholder: 'Enter score (1-6)', unit: 'points', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      const eyeScore = parseInt(values['Eye Opening']);
      const verbalScore = parseInt(values['Verbal Response']);
      const motorScore = parseInt(values['Motor Response']);
      
      const totalScore = eyeScore + verbalScore + motorScore;
      
      let interpretation = '';
      if (totalScore === 15) interpretation = 'Normal consciousness';
      else if (totalScore >= 13) interpretation = 'Mild brain injury';
      else if (totalScore >= 9) interpretation = 'Moderate brain injury';
      else interpretation = 'Severe brain injury - Immediate intervention needed';

      return {
        result: totalScore,
        interpretation
      };
    },
    formula: 'Pediatric GCS = Eye Opening (1-4) + Verbal Response (1-5) + Motor Response (1-6)\n\nEye Opening:\n4 = Spontaneous\n3 = To voice\n2 = To pain\n1 = None\n\nVerbal Response:\n5 = Oriented/Appropriate\n4 = Confused\n3 = Inappropriate words\n2 = Incomprehensible sounds\n1 = None\n\nMotor Response:\n6 = Obeys commands\n5 = Localizes pain\n4 = Withdraws from pain\n3 = Abnormal flexion\n2 = Extension\n1 = None',
    references: [
      'Pediatric Critical Care Medicine. Modified Glasgow Coma Scale for Infants and Children.',
      'Journal of Trauma. Pediatric Glasgow Coma Scale Scoring.',
      'Pediatrics. Assessment of Consciousness in Children.'
    ],
    resultUnit: 'points'
  },
  'alp-ratio': {
    id: 'alp-ratio',
    fields: [
      { label: 'ALP', placeholder: 'Enter alkaline phosphatase', unit: 'U/L', keyboardType: 'decimal-pad' },
      { label: 'ALT', placeholder: 'Enter alanine aminotransferase', unit: 'U/L', keyboardType: 'decimal-pad' },
      { label: 'AST', placeholder: 'Enter aspartate aminotransferase', unit: 'U/L', keyboardType: 'decimal-pad' },
      { label: 'GGT', placeholder: 'Enter gamma-glutamyl transferase', unit: 'U/L', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const alp = parseFloat(values.ALP);
      const alt = parseFloat(values.ALT);
      const ast = parseFloat(values.AST);
      const ggt = parseFloat(values.GGT);
      
      // Calculate ALP ratio and pattern
      const alpRatio = alp / ((alt + ast) / 2);
      const ggtRatio = ggt / ((alt + ast) / 2);
      
      let interpretation = '';
      if (alpRatio > 2.5) {
        if (ggtRatio > 2.5) interpretation = 'Cholestatic pattern - Consider biliary obstruction';
        else interpretation = 'Bone disease pattern - Consider Paget\'s disease, osteomalacia';
      } else {
        interpretation = 'Hepatocellular pattern - Consider viral hepatitis, drug-induced liver injury';
      }

      return {
        result: parseFloat(alpRatio.toFixed(2)),
        interpretation
      };
    },
    formula: 'ALP Ratio = ALP / [(ALT + AST) / 2]',
    references: [
      'Journal of Hepatology. Patterns of Liver Enzyme Elevations.',
      'Clinical Chemistry. Interpretation of Liver Function Tests.',
      'American Journal of Gastroenterology. Evaluation of Liver Chemistry Tests.'
    ],
    resultUnit: ''  // ratio has no unit
  },
  'child-pugh': {
    id: 'child-pugh',
    fields: [
      { label: 'Bilirubin', placeholder: 'Enter total bilirubin', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Albumin', placeholder: 'Enter albumin', unit: 'g/dL', keyboardType: 'decimal-pad' },
      { label: 'INR', placeholder: 'Enter INR', unit: '', keyboardType: 'decimal-pad' },
      { label: 'Ascites', placeholder: 'None(1), Mild(2), Severe(3)', unit: 'points', keyboardType: 'numeric' },
      { label: 'Encephalopathy', placeholder: 'None(1), Grade I-II(2), Grade III-IV(3)', unit: 'points', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      let score = 0;
      
      // Bilirubin scoring
      const bilirubin = parseFloat(values.Bilirubin);
      if (bilirubin < 2) score += 1;
      else if (bilirubin <= 3) score += 2;
      else score += 3;
      
      // Albumin scoring
      const albumin = parseFloat(values.Albumin);
      if (albumin > 3.5) score += 1;
      else if (albumin >= 2.8) score += 2;
      else score += 3;
      
      // INR scoring
      const inr = parseFloat(values.INR);
      if (inr < 1.7) score += 1;
      else if (inr <= 2.3) score += 2;
      else score += 3;
      
      // Add points for ascites and encephalopathy
      score += parseInt(values.Ascites);
      score += parseInt(values.Encephalopathy);
      
      let interpretation = '';
      if (score <= 6) interpretation = 'Class A: Well-compensated disease';
      else if (score <= 9) interpretation = 'Class B: Significant functional compromise';
      else interpretation = 'Class C: Decompensated disease';

      return {
        result: score,
        interpretation
      };
    },
    formula: 'Sum of points for:\n• Bilirubin\n• Albumin\n• INR\n• Ascites\n• Hepatic encephalopathy',
    references: [
      'Hepatology. Child-Pugh Classification of Severity of Liver Disease.',
      'Journal of Hepatology. Prognostic Assessment in Cirrhosis.',
      'Liver International. Child-Pugh Score in Liver Cirrhosis.'
    ],
    resultUnit: 'points'
  },
  'hematocrit': {
    id: 'hematocrit',
    fields: [
      { label: 'RBC Count', placeholder: 'Enter RBC count', unit: '×10⁶/µL', keyboardType: 'decimal-pad' },
      { label: 'MCV', placeholder: 'Enter mean corpuscular volume', unit: 'fL', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const rbc = parseFloat(values['RBC Count']);
      const mcv = parseFloat(values.MCV);
      
      // Hematocrit = RBC × MCV / 10
      const hct = (rbc * mcv) / 10;
      
      let interpretation = '';
      if (hct < 37) {
        if (mcv < 80) interpretation = 'Low hematocrit with microcytosis - Consider iron deficiency';
        else if (mcv > 100) interpretation = 'Low hematocrit with macrocytosis - Consider B12/folate deficiency';
        else interpretation = 'Low hematocrit with normal MCV - Consider anemia of chronic disease';
      } else if (hct <= 52) {
        interpretation = 'Normal hematocrit';
      } else {
        interpretation = 'Elevated hematocrit - Consider polycythemia';
      }

      return {
        result: parseFloat(hct.toFixed(1)),
        interpretation
      };
    },
    formula: 'Hematocrit (%) = (RBC × MCV) / 10',
    references: [
      'American Journal of Hematology. Interpretation of the Complete Blood Count.',
      'Blood. Evaluation of Anemia.',
      'New England Journal of Medicine. Approach to Anemia.'
    ],
    resultUnit: '%'
  },
  'trp': {
    id: 'trp',
    fields: [
      { label: 'Urine Phosphate', placeholder: 'Enter urine phosphate', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Serum Phosphate', placeholder: 'Enter serum phosphate', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Urine Creatinine', placeholder: 'Enter urine creatinine', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Serum Creatinine', placeholder: 'Enter serum creatinine', unit: 'mg/dL', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const uP = parseFloat(values['Urine Phosphate']);
      const sP = parseFloat(values['Serum Phosphate']);
      const uCr = parseFloat(values['Urine Creatinine']);
      const sCr = parseFloat(values['Serum Creatinine']);
      
      // TRP = 1 - [(UP × SCr) / (SP × UCr)] × 100
      const trp = (1 - ((uP * sCr) / (sP * uCr))) * 100;
      
      let interpretation = '';
      if (trp < 85) interpretation = 'Decreased TRP - Consider renal phosphate wasting';
      else if (trp <= 95) interpretation = 'Normal TRP';
      else interpretation = 'Elevated TRP - Consider phosphate retention';

      return {
        result: parseFloat(trp.toFixed(1)),
        interpretation
      };
    },
    formula: 'TRP (%) = [1 - (Urine Phosphate × Serum Creatinine) / (Serum Phosphate × Urine Creatinine)] × 100',
    references: [
      'Clinical Journal of the American Society of Nephrology. Assessment of Phosphate Metabolism.',
      'Kidney International. Renal Handling of Phosphate.',
      'American Journal of Kidney Diseases. Disorders of Phosphate Homeostasis.'
    ],
    resultUnit: '%'
  },
  'infusion-rate': {
    id: 'infusion-rate',
    fields: [
      { label: 'Dose', placeholder: 'Enter desired dose', unit: 'mg/kg/min', keyboardType: 'decimal-pad' },
      { label: 'Weight', placeholder: 'Enter patient weight', unit: 'kg', keyboardType: 'decimal-pad' },
      { label: 'Concentration', placeholder: 'Enter drug concentration', unit: 'mg/mL', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const dose = parseFloat(values.Dose);
      const weight = parseFloat(values.Weight);
      const concentration = parseFloat(values.Concentration);
      
      // Rate (mL/hr) = (dose × weight × 60) / concentration
      const rate = (dose * weight * 60) / concentration;
      
      let interpretation = '';
      if (rate < 1) interpretation = 'Very slow infusion rate - Verify calculation';
      else if (rate <= 10) interpretation = 'Standard infusion rate';
      else if (rate <= 20) interpretation = 'High infusion rate - Monitor closely';
      else interpretation = 'Very high infusion rate - Double check calculation';

      return {
        result: parseFloat(rate.toFixed(1)),
        interpretation
      };
    },
    formula: 'Infusion Rate (mL/hr) = (Dose × Weight × 60) / Concentration',
    references: [
      'Critical Care Medicine. Guidelines for Medication Administration.',
      'Journal of Infusion Nursing. Standards of Practice.',
      'American Journal of Health-System Pharmacy. IV Medication Safety.'
    ],
    resultUnit: 'mL/hr'
  },
  'ebl': {
    id: 'ebl',
    fields: [
      { label: 'Pre-op Hct', placeholder: 'Enter pre-operative hematocrit', unit: '%', keyboardType: 'decimal-pad' },
      { label: 'Post-op Hct', placeholder: 'Enter post-operative hematocrit', unit: '%', keyboardType: 'decimal-pad' },
      { label: 'Weight', placeholder: 'Enter patient weight', unit: 'kg', keyboardType: 'decimal-pad' },
      { label: 'Transfusion', placeholder: 'Enter units of blood transfused', unit: 'units', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      const preHct = parseFloat(values['Pre-op Hct']);
      const postHct = parseFloat(values['Post-op Hct']);
      const weight = parseFloat(values.Weight);
      const transfusion = parseInt(values.Transfusion);
      
      // Estimated blood volume = Weight × 70 mL/kg
      const ebv = weight * 70;
      
      // EBL = EBV × (PreHct - PostHct)/PreHct + (Units × 500)
      const ebl = ebv * ((preHct - postHct)/preHct) + (transfusion * 500);
      
      let interpretation = '';
      if (ebl < 500) interpretation = 'Minimal blood loss';
      else if (ebl < 1000) interpretation = 'Moderate blood loss';
      else if (ebl < 2000) interpretation = 'Significant blood loss - Monitor closely';
      else interpretation = 'Severe blood loss - Consider additional interventions';

      return {
        result: parseFloat(ebl.toFixed(0)),
        interpretation
      };
    },
    formula: 'EBL = EBV × (PreHct - PostHct)/PreHct + (Units × 500)\nwhere EBV = Weight × 70 mL/kg',
    references: [
      'Anesthesiology. Estimation of Operative Blood Loss.',
      'British Journal of Anaesthesia. Blood Loss Estimation in Surgery.',
      'Journal of Trauma. Assessment of Blood Loss in Trauma.'
    ],
    resultUnit: 'mL'
  },
  'tidal-volume': {
    id: 'tidal-volume',
    fields: [
      { label: 'Height', placeholder: 'Enter height', unit: 'cm', keyboardType: 'decimal-pad' },
      { label: 'Gender', placeholder: 'Enter 1 for male, 0 for female', unit: '', keyboardType: 'numeric' },
      { label: 'ARDS', placeholder: 'ARDS present (1) or not (0)', unit: '', keyboardType: 'numeric' }
    ],
    calculate: (values) => {
      const height = parseFloat(values.Height);
      const gender = parseInt(values.Gender);
      const ards = parseInt(values.ARDS);
      
      // Calculate IBW first
      const heightInInches = height / 2.54;
      let ibw;
      if (gender === 1) {
        ibw = 50 + 2.3 * (heightInInches - 60);
      } else {
        ibw = 45.5 + 2.3 * (heightInInches - 60);
      }
      
      // Calculate tidal volume
      // Use 6 mL/kg for ARDS, 8 mL/kg for normal
      const mlPerKg = ards === 1 ? 6 : 8;
      const tidalVolume = ibw * mlPerKg;
      
      let interpretation = '';
      if (ards === 1) {
        interpretation = 'Low tidal volume ventilation for ARDS (6 mL/kg IBW)';
      } else {
        interpretation = 'Standard tidal volume ventilation (8 mL/kg IBW)';
      }

      return {
        result: parseFloat(tidalVolume.toFixed(0)),
        interpretation
      };
    },
    formula: 'Tidal Volume = IBW × (6-8 mL/kg)\nwhere IBW (kg) = 50 + 2.3 × (height in inches - 60) for males\nor 45.5 + 2.3 × (height in inches - 60) for females',
    references: [
      'New England Journal of Medicine. Ventilation with Lower Tidal Volumes.',
      'American Journal of Respiratory and Critical Care Medicine. Mechanical Ventilation Guidelines.',
      'Critical Care Medicine. ARDS Network Recommendations.'
    ],
    resultUnit: 'mL'
  },
  'cardiac-output': {
    id: 'cardiac-output',
    fields: [
      { label: 'VO2', placeholder: 'Enter oxygen consumption', unit: 'mL/min', keyboardType: 'decimal-pad' },
      { label: 'CaO2', placeholder: 'Enter arterial oxygen content', unit: 'mL/dL', keyboardType: 'decimal-pad' },
      { label: 'CvO2', placeholder: 'Enter venous oxygen content', unit: 'mL/dL', keyboardType: 'decimal-pad' }
    ],
    calculate: (values) => {
      const vo2 = parseFloat(values.VO2);
      const cao2 = parseFloat(values.CaO2);
      const cvo2 = parseFloat(values.CvO2);
      
      // CO = VO2 / [(CaO2 - CvO2) × 10]
      const co = vo2 / ((cao2 - cvo2) * 10);
      
      let interpretation = '';
      if (co < 4) interpretation = 'Low cardiac output - Consider cardiogenic shock';
      else if (co <= 8) interpretation = 'Normal cardiac output';
      else interpretation = 'High cardiac output - Consider high output states';

      return {
        result: parseFloat(co.toFixed(1)),
        interpretation
      };
    },
    formula: 'Cardiac Output (L/min) = VO2 / [(CaO2 - CvO2) × 10]\nwhere:\nVO2 = Oxygen consumption\nCaO2 = Arterial oxygen content\nCvO2 = Venous oxygen content',
    references: [
      'Journal of Applied Physiology. Fick Principle in Cardiac Output Measurement.',
      'Circulation. Assessment of Cardiac Output.',
      'Critical Care Medicine. Hemodynamic Monitoring.'
    ],
    resultUnit: 'L/min'
  },
  'pregnancy': {
    id: 'pregnancy',
    fields: [
      { label: 'Input Type', placeholder: 'Enter 1 for LMP, 2 for GA, 3 for EDD', unit: '', keyboardType: 'numeric' },
      { label: 'Input Date', placeholder: 'Enter date (YYYY-MM-DD) or GA (weeks)', unit: '', keyboardType: 'default' }
    ],
    calculate: (values) => {
      const inputType = parseInt(values['Input Type']);
      const inputDate = values['Input Date'];
      const currentDate = new Date();
      let lmp: Date;
      
      const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
      const DAYS_IN_PREGNANCY = 280;
      
      try {
        // Validate input type
        if (![1, 2, 3].includes(inputType)) {
          throw new Error('Invalid input type. Please enter 1 for LMP, 2 for GA, or 3 for EDD.');
        }

        // Input type specific validation and calculation
        switch(inputType) {
          case 1: // LMP provided
            lmp = new Date(inputDate);
            if (isNaN(lmp.getTime())) {
              throw new Error('Invalid LMP date format. Please use YYYY-MM-DD format.');
            }
            if (lmp > currentDate) {
              throw new Error('LMP date cannot be in the future.');
            }
            break;
            
          case 2: // EGA provided
            const gestationalAge = parseFloat(inputDate);
            if (isNaN(gestationalAge) || gestationalAge < 0 || gestationalAge > 45) {
              throw new Error('Invalid gestational age. Please enter a number between 0 and 45 weeks.');
            }
            lmp = new Date(currentDate.getTime() - (gestationalAge * 7 * MILLISECONDS_PER_DAY));
            break;
            
          case 3: // EDD provided
            const edd = new Date(inputDate);
            if (isNaN(edd.getTime())) {
              throw new Error('Invalid EDD date format. Please use YYYY-MM-DD format.');
            }
            lmp = new Date(edd.getTime() - (DAYS_IN_PREGNANCY * MILLISECONDS_PER_DAY));
            break;
            
          default:
            throw new Error('Invalid input type');
        }
        
        // Calculate EDD
        const edd = new Date(lmp.getTime() + (DAYS_IN_PREGNANCY * MILLISECONDS_PER_DAY));
        
        // Calculate current gestational age
        const daysPregnant = Math.floor((currentDate.getTime() - lmp.getTime()) / MILLISECONDS_PER_DAY);
        if (daysPregnant < 0) {
          throw new Error('Calculated dates are invalid. Please check your input.');
        }
        
        const weeksPregnant = Math.floor(daysPregnant / 7);
        const remainingDays = daysPregnant % 7;
        
        // Format dates
        const formatDate = (date: Date) => {
          return date.toISOString().split('T')[0];
        };
        
        let interpretation = '';
        if (weeksPregnant < 0) {
          interpretation = 'Error: Invalid dates calculated';
        } else if (weeksPregnant > 45) {
          interpretation = 'Warning: Calculated gestational age exceeds 45 weeks';
        } else {
          interpretation = `
Last Menstrual Period: ${formatDate(lmp)}
Current Gestational Age: ${weeksPregnant} weeks ${remainingDays} days
Estimated Due Date: ${formatDate(edd)}
          `.trim();
        }

        return {
          result: parseFloat((weeksPregnant + remainingDays / 7).toFixed(1)),
          interpretation
        };
      } catch (error) {
        return {
          result: 0,
          interpretation: `Error: ${(error as Error).message || 'Please check your input format and try again.'}`
        };
      }
    },
    formula: 'GA = (Current Date - LMP) / 7\nEDD = LMP + 280 days',
    references: [
      'American College of Obstetricians and Gynecologists. Methods for Estimating Due Date.',
      'World Health Organization. Pregnancy Dating and Assessment.',
      'Journal of Obstetrics and Gynecology. Gestational Age Calculation Methods.'
    ],
    resultUnit: 'weeks'
  }
};

type Tab = 'calculator' | 'facts';

export default function CalculatorScreen() {
  const { id } = useLocalSearchParams();
  const calculator = CALCULATIONS.find(calc => calc.id === id);
  const config = calculatorConfigs[id as string];
  
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<{ result: number; interpretation: string } | null>(null);

  const handleReload = useCallback(() => {
    setValues({});
    setResult(null);
    Keyboard.dismiss();
  }, []);

  if (!calculator || !config) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.text}>Calculator not found</ThemedText>
      </View>
    );
  }

  const handleCalculate = () => {
    const calculationResult = config.calculate(values);
    setResult(calculationResult);
  };

  const renderCalculatorTab = () => (
    <>
      <View style={styles.calculatorContainer}>
        <View style={styles.reloadContainer}>
          <TouchableOpacity 
            style={styles.reloadButton}
            onPress={handleReload}
          >
            <ThemedText style={styles.reloadButtonText}>Reset</ThemedText>
          </TouchableOpacity>
        </View>

        {config.fields.map((field, index) => (
          <View key={field.label} style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <ThemedText style={styles.label}>{field.label}</ThemedText>
              <ThemedText style={styles.unit}>{field.unit}</ThemedText>
            </View>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              keyboardType={field.keyboardType}
              value={values[field.label]}
              onChangeText={(text) => setValues(prev => ({ ...prev, [field.label]: text }))}
            />
          </View>
        ))}

        <TouchableOpacity 
          style={styles.calculateButton}
          onPress={handleCalculate}
        >
          <ThemedText style={styles.calculateButtonText}>Calculate</ThemedText>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <ThemedText style={styles.resultTitle}>Result</ThemedText>
            <View style={styles.resultValueContainer}>
              <ThemedText style={styles.resultValue}>{result.result}</ThemedText>
              <ThemedText style={styles.resultUnit}>{config.resultUnit}</ThemedText>
            </View>
            <ThemedText style={styles.interpretation}>{result.interpretation}</ThemedText>
          </View>
        )}
      </View>
    </>
  );

  const renderFactsTab = () => (
    <View style={styles.factsContainer}>
      <View style={styles.factSection}>
        <ThemedText style={styles.factTitle}>Formula</ThemedText>
        <ThemedText style={styles.formula}>{config.formula}</ThemedText>
      </View>
      
      <View style={styles.factSection}>
        <ThemedText style={styles.factTitle}>References</ThemedText>
        {config.references?.map((reference, index) => (
          <ThemedText key={index} style={styles.reference}>• {reference}</ThemedText>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{calculator.name}</ThemedText>
        <ThemedText style={styles.description}>{calculator.description}</ThemedText>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'calculator' && styles.activeTab]}
          onPress={() => setActiveTab('calculator')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'calculator' && styles.activeTabText]}>
            Calculator
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'facts' && styles.activeTab]}
          onPress={() => setActiveTab('facts')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'facts' && styles.activeTabText]}>
            Facts
          </ThemedText>
        </TouchableOpacity>
      </View>

      {activeTab === 'calculator' ? renderCalculatorTab() : renderFactsTab()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#EEEEEE',
  },
  activeTab: {
    borderBottomColor: '#3D50B5',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'DMSans_500Medium',
    color: '#666666',
  },
  activeTabText: {
    color: '#3D50B5',
  },
  title: {
    fontSize: 24,
    fontFamily: 'DMSans_700Bold',
    marginBottom: 8,
    color: '#000000',
  },
  description: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
    color: '#666666',
  },
  calculatorContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factSection: {
    marginBottom: 24,
  },
  factTitle: {
    fontSize: 18,
    fontFamily: 'DMSans_600SemiBold',
    color: '#3D50B5',
    marginBottom: 12,
  },
  formula: {
    fontSize: 16,
    fontFamily: 'DMSans_500Medium',
    color: '#000000',
    backgroundColor: '#F8F8FA',
    padding: 12,
    borderRadius: 8,
  },
  reference: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  text: {
    fontSize: 16,
    color: '#000000',
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'DMSans_500Medium',
    color: '#000000',
  },
  unit: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: '#666666',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  calculateButton: {
    backgroundColor: '#3D50B5',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'DMSans_600SemiBold',
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F8F8FA',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: '#666666',
    marginBottom: 8,
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 32,
    fontFamily: 'DMSans_700Bold',
    color: '#3D50B5',
  },
  resultUnit: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
    color: '#666666',
    marginLeft: 4,
  },
  interpretation: {
    fontSize: 16,
    fontFamily: 'DMSans_500Medium',
    color: '#000000',
  },
  reloadContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  reloadButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F8F8FA',
  },
  reloadButtonText: {
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    color: '#666666',
  },
}); 