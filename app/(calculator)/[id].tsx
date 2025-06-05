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
      { label: 'Total Calcium', placeholder: 'Enter total calcium (mg/dL)', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Albumin', placeholder: 'Enter albumin (g/dL)', unit: 'g/dL', keyboardType: 'decimal-pad' }
    ],
    validate: (values: { [key: string]: string }) => {
      const totalCalcium = parseFloat(values['Total Calcium']);
      const albumin = parseFloat(values.Albumin);
      
      if (isNaN(totalCalcium) || totalCalcium <= 0) {
        return 'Total calcium must be positive';
      }
      if (isNaN(albumin) || albumin <= 0) {
        return 'Albumin must be positive';
      }
      return null;
    },
    calculate: (values: { [key: string]: string }) => {
      const totalCalcium = parseFloat(values['Total Calcium']);
      const albumin = parseFloat(values.Albumin);
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
      'Clinical Chemistry. Interpretation of Calcium Levels.',
      'American Journal of Medicine. Assessment of Calcium Disorders.',
      'Journal of Clinical Endocrinology & Metabolism. Calcium Homeostasis.'
    ],
    resultUnit: 'mg/dL'
  },
  'estimated-blood-volume': {
    id: 'estimated-blood-volume',
    fields: [
      { label: 'Weight', placeholder: 'Enter weight (kg)', unit: 'kg', keyboardType: 'numeric' }
    ],
    validate: (values: { [key: string]: string }) => {
      const weight = parseFloat(values.Weight);
      if (isNaN(weight) || weight <= 0) {
        return 'Weight must be positive';
      }
      return null;
    },
    calculate: (values: { [key: string]: string }) => {
      const weight = parseFloat(values.Weight);
      // Estimated blood volume = Weight × 70 mL/kg
      const ebv = weight * 70;
      return {
        result: parseFloat(ebv.toFixed(0)),
        interpretation: `Estimated blood volume: ${ebv} mL`
      };
    },
    formula: 'EBV = Weight × 70 mL/kg',
    references: [
      'Anesthesiology. Estimation of Operative Blood Loss.',
      'British Journal of Anaesthesia. Blood Loss Estimation in Surgery.',
      'Journal of Trauma. Assessment of Blood Loss in Trauma.'
    ],
    resultUnit: 'mL'
  },

  'naranjo': {
    id: 'naranjo',
    fields: [
      { label: 'Known Reaction', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
      { label: 'Previous Reaction', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
      { label: 'Epidemiological Evidence', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
      { label: 'Exclusion of Other Causes', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
      { label: 'Occurrence After Drug', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
      { label: 'Challenge/Dechallenge', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
      { label: 'Dose-Response', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
      { label: 'Biological Plausibility', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' }
    ],
    validate: (values: { [key: string]: string }) => {
      for (const key in values) {
        const value = parseInt(values[key]);
        if (isNaN(value)) {
          return `Please enter a valid number for ${key}`;
        }
        if (value < 0 || value > 1) {
          return `${key} must be 0 or 1`;
        }
      }
      return null;
    },
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
    formula: 'Sum of scores from 8 questions assessing causality of adverse drug reactions',
    references: [
      'Naranjo CA, et al. A method for estimating the probability of adverse drug reactions.',
      'Clinical Pharmacology & Therapeutics. Adverse Drug Reaction Probability Scale.',
      'Drug Safety. Assessment of Adverse Drug Reactions.'
    ],
    resultUnit: 'points'
  },

  'tcpo2-pao2': {
    id: 'tcpo2-pao2',
    fields: [
      { label: 'TcPO2', placeholder: 'Enter transcutaneous PO2', unit: 'mmHg', keyboardType: 'decimal-pad' },
      { label: 'PaO2', placeholder: 'Enter arterial PO2', unit: 'mmHg', keyboardType: 'decimal-pad' }
    ],
    validate: (values: { [key: string]: string }) => {
      const tcPo2 = parseFloat(values.TcPO2);
      const paO2 = parseFloat(values.PaO2);

      if (isNaN(tcPo2) || tcPo2 <= 0) {
        return 'Transcutaneous PO2 must be positive';
      }
      if (isNaN(paO2) || paO2 <= 0) {
        return 'Arterial PO2 must be positive';
      }
      return null;
    },
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

  'friedewald': {
    id: 'friedewald',
    fields: [
      { label: 'Total Cholesterol', placeholder: 'Enter total cholesterol', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'HDL', placeholder: 'Enter HDL', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Triglycerides', placeholder: 'Enter triglycerides', unit: 'mg/dL', keyboardType: 'decimal-pad' }
    ],
    validate: (values: { [key: string]: string }) => {
      const totalChol = parseFloat(values['Total Cholesterol']);
      const hdl = parseFloat(values.HDL);
      const trig = parseFloat(values.Triglycerides);

      if (isNaN(totalChol) || totalChol < 0) {
        return 'Total cholesterol must be non-negative';
      }
      if (isNaN(hdl) || hdl < 0) {
        return 'HDL must be non-negative';
      }
      if (isNaN(trig) || trig < 0) {
        return 'Triglycerides must be non-negative';
      }
      return null;
    },
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
    id: 'osmolality',
    fields: [
      { label: 'Na', placeholder: 'Enter sodium', unit: 'mEq/L', keyboardType: 'decimal-pad' },
      { label: 'Glucose', placeholder: 'Enter glucose', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'BUN', placeholder: 'Enter BUN', unit: 'mg/dL', keyboardType: 'decimal-pad' }
    ],
    validate: (values: { [key: string]: string }) => {
      const na = parseFloat(values.Na);
      const glucose = parseFloat(values.Glucose);
      const bun = parseFloat(values.BUN);

      if (isNaN(na) || na < 100 || na > 160) {
        return 'Sodium must be between 100 and 160 mEq/L';
      }
      if (isNaN(glucose) || glucose < 0) {
        return 'Glucose must be non-negative';
      }
      if (isNaN(bun) || bun < 0) {
        return 'BUN must be non-negative';
      }
      return null;
    },
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

  'hematocrit': {
    id: 'hematocrit',
    fields: [
      { label: 'RBC', placeholder: 'Enter RBC count', unit: 'cells/µL', keyboardType: 'decimal-pad' },
      { label: 'MCV', placeholder: 'Enter MCV', unit: 'fL', keyboardType: 'decimal-pad' }
    ],
    validate: (values: { [key: string]: string }) => {
      const rbc = parseFloat(values.RBC);
      const mcv = parseFloat(values.MCV);

      if (isNaN(rbc) || rbc <= 0) {
        return 'RBC count must be positive';
      }
      if (isNaN(mcv) || mcv <= 0) {
        return 'MCV must be positive';
      }
      return null;
    },
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
      { label: 'Serum Creatinine', placeholder: 'Enter serum creatinine', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Serum Phosphate', placeholder: 'Enter serum phosphate', unit: 'mg/dL', keyboardType: 'decimal-pad' },
      { label: 'Urine Creatinine', placeholder: 'Enter urine creatinine', unit: 'mg/dL', keyboardType: 'decimal-pad' }
    ],
    validate: (values: { [key: string]: string }) => {
      const urinePhos = parseFloat(values['Urine Phosphate']);
      const serumCreat = parseFloat(values['Serum Creatinine']);
      const serumPhos = parseFloat(values['Serum Phosphate']);
      const urineCreat = parseFloat(values['Urine Creatinine']);

      if (isNaN(urinePhos) || urinePhos < 0) {
        return 'Urine phosphate must be non-negative';
      }
      if (isNaN(serumCreat) || serumCreat <= 0) {
        return 'Serum creatinine must be positive';
      }
      if (isNaN(serumPhos) || serumPhos < 0) {
        return 'Serum phosphate must be non-negative';
      }
      if (isNaN(urineCreat) || urineCreat <= 0) {
        return 'Urine creatinine must be positive';
      }
      return null;
    },
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
      { label: 'Dose', placeholder: 'Enter dose', unit: 'mg/kg/hr', keyboardType: 'decimal-pad' },
      { label: 'Weight', placeholder: 'Enter weight', unit: 'kg', keyboardType: 'decimal-pad' },
      { label: 'Concentration', placeholder: 'Enter concentration', unit: 'mg/mL', keyboardType: 'decimal-pad' }
    ],
    validate: (values: { [key: string]: string }) => {
      const dose = parseFloat(values.Dose);
      const weight = parseFloat(values.Weight);
      const concentration = parseFloat(values.Concentration);

      if (isNaN(dose) || dose <= 0) {
        return 'Dose must be positive';
      }
      if (isNaN(weight) || weight <= 0) {
        return 'Weight must be positive';
      }
      if (isNaN(concentration) || concentration <= 0) {
        return 'Concentration must be positive';
      }
      return null;
    },
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
      { label: 'PreHct', placeholder: 'Enter preoperative hematocrit', unit: '%', keyboardType: 'decimal-pad' },
      { label: 'PostHct', placeholder: 'Enter postoperative hematocrit', unit: '%', keyboardType: 'decimal-pad' },
      { label: 'Units', placeholder: 'Enter units transfused', unit: 'units', keyboardType: 'numeric' }
    ],
    validate: (values: { [key: string]: string }) => {
      const preHct = parseFloat(values.PreHct);
      const postHct = parseFloat(values.PostHct);
      const units = parseInt(values.Units);

      if (isNaN(preHct) || preHct < 0 || preHct > 100) {
        return 'Preoperative hematocrit must be between 0 and 100%';
      }
      if (isNaN(postHct) || postHct < 0 || postHct > 100) {
        return 'Postoperative hematocrit must be between 0 and 100%';
      }
      if (isNaN(units) || units < 0) {
        return 'Units transfused must be non-negative';
      }
      return null;
    },
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
    validate: (values: { [key: string]: string }) => {
      const height = parseFloat(values.Height);
      const gender = parseInt(values.Gender);
      const ards = parseInt(values.ARDS);
      
      if (isNaN(height) || height <= 0) {
        return 'Height must be a positive number';
      }
      if (gender !== 0 && gender !== 1) {
        return 'Gender must be 0 (female) or 1 (male)';
      }
      if (ards !== 0 && ards !== 1) {
        return 'ARDS must be 0 (no) or 1 (yes)';
      }
      return null;
    },
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
    validate: (values: { [key: string]: string }) => {
      const vo2 = parseFloat(values.VO2);
      const cao2 = parseFloat(values.CaO2);
      const cvo2 = parseFloat(values.CvO2);
      
      if (isNaN(vo2) || vo2 <= 0) {
        return 'VO2 must be a positive number';
      }
      if (isNaN(cao2) || cao2 <= 0) {
        return 'CaO2 must be a positive number';
      }
      if (isNaN(cvo2) || cvo2 <= 0) {
        return 'CvO2 must be a positive number';
      }
      if (cao2 <= cvo2) {
        return 'CaO2 must be greater than CvO2';
      }
      return null;
    },
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
    validate: (values: { [key: string]: string }) => {
      const inputType = parseInt(values['Input Type']);
      const inputDate = values['Input Date'];
      
      if (isNaN(inputType) || ![1, 2, 3].includes(inputType)) {
        return 'Input Type must be 1 (LMP), 2 (GA), or 3 (EDD)';
      }
      
      if (inputType === 1) { // LMP
        if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(inputDate)) {
          return 'Please enter a valid date in YYYY-MM-DD format';
        }
      } else if (inputType === 2) { // GA
        const ga = parseInt(inputDate);
        if (isNaN(ga) || ga < 0 || ga > 42) {
          return 'Gestational age must be between 0 and 42 weeks';
        }
      } else if (inputType === 3) { // EDD
        if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(inputDate)) {
          return 'Please enter a valid date in YYYY-MM-DD format';
        }
      }
      return null;
    },
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