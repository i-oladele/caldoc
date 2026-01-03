import { CalculatorConfig, CalculatorValues } from '../../calculator';

const parseNumber = (value: string | boolean): number => {
  if (typeof value === 'boolean') return 0;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const parseBoolean = (value: string | boolean): boolean => {
  if (typeof value === 'boolean') return value;
  return value === 'true';
};

export const framinghamConfig: CalculatorConfig = {
  id: 'framingham',
  name: 'Cardiovascular Risk (Framingham Score)',
  description: 'Estimates 10-year cardiovascular risk based on various factors.',
  category: 'Cardiology',
  fields: [
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      min: 30,
      max: 79,
      step: 1,
      required: true,
      placeholder: 'Enter age (30-79 years)',
      unit: 'years'
    },
    {
      id: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]
    },
    {
      id: 'totalCholesterol',
      label: 'Total Cholesterol',
      type: 'number',
      min: 0,
      step: 1,
      required: true,
      placeholder: 'Enter total cholesterol',
      unit: 'mg/dL'
    },
    {
      id: 'hdlCholesterol',
      label: 'HDL Cholesterol',
      type: 'number',
      min: 0,
      step: 1,
      required: true,
      placeholder: 'Enter HDL cholesterol',
      unit: 'mg/dL'
    },
    {
      id: 'systolicBP',
      label: 'Systolic BP',
      type: 'number',
      min: 90,
      max: 200,
      step: 1,
      required: true,
      placeholder: 'Enter systolic blood pressure',
      unit: 'mmHg'
    },
    {
      id: 'treatedBP',
      label: 'On BP Treatment',
      type: 'checkbox',
      required: true,
      placeholder: 'Patient is on blood pressure medication'
    },
    {
      id: 'smoker',
      label: 'Current Smoker',
      type: 'checkbox',
      required: true,
      placeholder: 'Patient currently smokes'
    },
    {
      id: 'diabetes',
      label: 'Diabetes',
      type: 'checkbox',
      required: true,
      placeholder: 'Patient has diabetes'
    }
  ],
  validate: (values: CalculatorValues) => {
    const errors: Record<string, string> = {};
    
    // Age validation
    if (values.age === undefined || values.age === '' || values.age === false) {
      errors.age = 'Age is required';
    } else if (isNaN(Number(values.age))) {
      errors.age = 'Age must be a valid number';
    } else {
      const age = parseNumber(values.age);
      if (age < 30 || age > 79) {
        errors.age = 'Age must be between 30 and 79 years';
      } else if (age < 0) {
        errors.age = 'Age cannot be negative';
      }
    }
    
    // Gender validation
    if (values.gender === undefined || values.gender === '' || values.gender === false) {
      errors.gender = 'Gender is required';
    }
    
    // Total Cholesterol validation
    if (values.totalCholesterol === undefined || values.totalCholesterol === '' || values.totalCholesterol === false) {
    } else if (isNaN(Number(values.totalCholesterol))) {
      errors.totalCholesterol = 'Must be a valid number';
    } else if (Number(values.totalCholesterol) < 0) {
      errors.totalCholesterol = 'Cannot be negative';
    } else if (Number(values.totalCholesterol) > 1000) {
      errors.totalCholesterol = 'Value seems too high';
    }
    
    // HDL Cholesterol validation
    const hdlCholesterol = parseNumber(values.hdlCholesterol);
    if (values.hdlCholesterol === undefined || values.hdlCholesterol === '' || values.hdlCholesterol === false) {
      errors.hdlCholesterol = 'HDL cholesterol is required';
    } else if (isNaN(Number(values.hdlCholesterol))) {
      errors.hdlCholesterol = 'Must be a valid number';
    } else if (Number(values.hdlCholesterol) < 0) {
      errors.hdlCholesterol = 'Cannot be negative';
    } else if (Number(values.hdlCholesterol) > 200) {
      errors.hdlCholesterol = 'Value seems too high';
    }
    
    // Systolic BP validation
    if (values.systolicBP === undefined || values.systolicBP === '' || values.systolicBP === false) {
      errors.systolicBP = 'Systolic BP is required';
    } else if (isNaN(Number(values.systolicBP))) {
      errors.systolicBP = 'Must be a valid number';
    } else {
      const systolicBP = parseNumber(values.systolicBP);
      if (systolicBP < 70) {
        errors.systolicBP = 'Value seems too low';
      } else if (systolicBP > 250) {
        errors.systolicBP = 'Value seems too high';
      }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: CalculatorValues) => {
    // Parse input values
    const age = Math.floor(parseNumber(values.age));
    const totalCholesterol = parseNumber(values.totalCholesterol);
    const hdlCholesterol = parseNumber(values.hdlCholesterol);
    const systolicBP = parseNumber(values.systolicBP);
    const isMale = values.gender === 'male';
    const isSmoker = parseBoolean(values.smoker);
    const hasDiabetes = parseBoolean(values.diabetes);
    const onBPTreatment = parseBoolean(values.treatedBP);

    // Calculate points for each risk factor
    const points = {
      age: 0,
      totalCholesterol: 0,
      hdlCholesterol: 0,
      systolicBP: 0,
      smoker: 0,
      diabetes: 0
    };

    // Age points (different for men and women)
    if (isMale) {
      if (age >= 70) points.age = 14;
      else if (age >= 65) points.age = 12;
      else if (age >= 60) points.age = 10;
      else if (age >= 55) points.age = 8;
      else if (age >= 50) points.age = 6;
      else if (age >= 45) points.age = 4;
      else if (age >= 40) points.age = 2;
    } else {
      if (age >= 70) points.age = 16;
      else if (age >= 65) points.age = 12;
      else if (age >= 60) points.age = 8;
      else if (age >= 55) points.age = 5;
      else if (age >= 50) points.age = 3;
      else if (age >= 45) points.age = 2;
      else if (age >= 40) points.age = 1;
    }

    // Total cholesterol points (different by gender and age group)
    const getCholesterolPoints = (tc: number, age: number, isMale: boolean) => {
      if (isMale) {
        if (age < 40) {
          if (tc < 160) return -3;
          if (tc < 200) return 0;
          if (tc < 240) return 1;
          if (tc < 280) return 2;
          return 3;
        } else if (age < 50) {
          if (tc < 160) return -2;
          if (tc < 200) return 0;
          if (tc < 240) return 1;
          if (tc < 280) return 2;
          return 3;
        } else {
          if (tc < 160) return -1;
          if (tc < 200) return 0;
          if (tc < 240) return 1;
          if (tc < 280) return 2;
          return 3;
        }
      } else {
        if (age < 50) {
          if (tc < 160) return -2;
          if (tc < 200) return 0;
          if (tc < 240) return 1;
          if (tc < 280) return 2;
          return 3;
        } else {
          if (tc < 160) return -1;
          if (tc < 200) return 0;
          if (tc < 240) return 1;
          if (tc < 280) return 2;
          return 3;
        }
      }
    };

    points.totalCholesterol = getCholesterolPoints(totalCholesterol, age, isMale);

    // HDL cholesterol points
    if (hdlCholesterol >= 60) points.hdlCholesterol = -1;
    else if (hdlCholesterol >= 50) points.hdlCholesterol = 0;
    else if (hdlCholesterol >= 40) points.hdlCholesterol = 1;
    else points.hdlCholesterol = 2;

    // Blood pressure points (different for treated/untreated)
    const getBPPoints = (sbp: number, isMale: boolean, treated: boolean) => {
      if (isMale) {
        if (treated) {
          if (sbp < 120) return 0;
          if (sbp < 130) return 1;
          if (sbp < 140) return 2;
          if (sbp < 160) return 3;
          return 4;
        } else {
          if (sbp < 120) return 0;
          if (sbp < 130) return 0;
          if (sbp < 140) return 1;
          if (sbp < 160) return 2;
          return 3;
        }
      } else {
        if (treated) {
          if (sbp < 120) return -1;
          if (sbp < 130) return 1;
          if (sbp < 140) return 2;
          if (sbp < 150) return 3;
          if (sbp < 160) return 4;
          return 5;
        } else {
          if (sbp < 120) return -3;
          if (sbp < 130) return 0;
          if (sbp < 140) return 1;
          if (sbp < 150) return 2;
          if (sbp < 160) return 3;
          return 4;
        }
      }
    };

    points.systolicBP = getBPPoints(systolicBP, isMale, onBPTreatment);

    // Smoking points
    points.smoker = isSmoker ? 4 : 0;

    // Diabetes points
    points.diabetes = hasDiabetes ? (isMale ? 3 : 4) : 0;

    // Calculate total points
    const totalPoints = Object.values(points).reduce((sum, p) => sum + p, 0);

    // Convert points to 10-year risk percentage (using lookup tables)
    const riskPercentage = (() => {
      if (isMale) {
        if (totalPoints < -3) return 1;
        if (totalPoints < 0) return 2;
        if (totalPoints < 2) return 3;
        if (totalPoints < 4) return 4;
        if (totalPoints < 6) return 5;
        if (totalPoints < 7) return 6;
        if (totalPoints < 8) return 7;
        if (totalPoints < 9) return 9;
        if (totalPoints < 10) return 11;
        if (totalPoints < 11) return 13;
        if (totalPoints < 12) return 15;
        if (totalPoints < 13) return 18;
        if (totalPoints < 14) return 22;
        if (totalPoints < 15) return 26;
        if (totalPoints < 16) return 30;
        if (totalPoints < 17) return 35;
        if (totalPoints < 18) return 40;
        return 45;
      } else {
        if (totalPoints < 1) return 1;
        if (totalPoints < 2) return 1;
        if (totalPoints < 3) return 1;
        if (totalPoints < 4) return 1;
        if (totalPoints < 5) return 2;
        if (totalPoints < 6) return 2;
        if (totalPoints < 7) return 3;
        if (totalPoints < 8) return 4;
        if (totalPoints < 9) return 5;
        if (totalPoints < 10) return 6;
        if (totalPoints < 11) return 8;
        if (totalPoints < 12) return 10;
        if (totalPoints < 13) return 12;
        if (totalPoints < 14) return 15;
        if (totalPoints < 15) return 19;
        if (totalPoints < 16) return 23;
        if (totalPoints < 17) return 27;
        if (totalPoints < 18) return 32;
        if (totalPoints < 19) return 37;
        return 43;
      }
    })();

    // Determine risk category
    let riskCategory: 'Low' | 'Borderline' | 'Intermediate' | 'High';
    if (riskPercentage < 6) riskCategory = 'Low';
    else if (riskPercentage < 10) riskCategory = 'Borderline';
    else if (riskPercentage < 20) riskCategory = 'Intermediate';
    else riskCategory = 'High';

    // Generate detailed interpretation
    const interpretation = `10-year CVD risk: ${riskPercentage}% (${riskCategory} Risk)\n\n` +
      `Risk Factors:\n` +
      `• Age: ${age} years\n` +
      `• Gender: ${isMale ? 'Male' : 'Female'}\n` +
      `• Total Cholesterol: ${totalCholesterol} mg/dL\n` +
      `• HDL Cholesterol: ${hdlCholesterol} mg/dL\n` +
      `• Systolic BP: ${systolicBP} mmHg${onBPTreatment ? ' (on treatment)' : ''}\n` +
      `• Smoker: ${isSmoker ? 'Yes' : 'No'}\n` +
      `• Diabetes: ${hasDiabetes ? 'Yes' : 'No'}\n\n` +
      `Recommendations based on risk:\n` +
      (riskCategory === 'High' ? 
        '• Consider high-intensity statin therapy\n' +
        '• Aim for LDL < 70 mg/dL\n' +
        '• Consider aspirin therapy if benefits outweigh bleeding risk\n' +
        '• Strict blood pressure control (<130/80 mmHg)' :
      riskCategory === 'Intermediate' ?
        '• Consider moderate-intensity statin therapy\n' +
        '• Aim for LDL < 100 mg/dL\n' +
        '• Consider aspirin therapy in select patients\n' +
        '• Blood pressure control (<130/80 mmHg)' :
      riskCategory === 'Borderline' ?
        '• Consider moderate-intensity statin therapy if other risk factors present\n' +
        '• Aim for LDL < 130 mg/dL\n' +
        '• Blood pressure control (<130/80 mmHg)' :
        '• Maintain healthy lifestyle\n' +
        '• Reassess risk in 4-6 years\n' +
        '• Blood pressure control (<130/80 mmHg)');

    return {
      result: riskPercentage,
      interpretation: interpretation,
      status: riskCategory === 'High' ? 'danger' : 
              riskCategory === 'Intermediate' ? 'warning' :
              riskCategory === 'Borderline' ? 'warning' : 'success'
    };
  },
  formula: `Framingham Risk Score - 10-Year Cardiovascular Disease (CVD) Risk

  The Framingham Risk Score estimates the 10-year risk of developing CVD using a points-based system. The calculation considers multiple risk factors that contribute to cardiovascular health:
  1. Age and Gender: Baseline risk increases with age and differs by gender
  2. Total Cholesterol: Higher levels increase risk
  3. HDL Cholesterol: Lower levels increase risk
  4. Systolic Blood Pressure: Higher levels increase risk
  5. Blood Pressure Treatment: Indicates existing hypertension
  6. Smoking Status: Current smoking significantly increases risk
  7. Diabetes Status: Diabetes is a major risk factor for CVD

  Simplified Calculation (for reference):
  - Base points are assigned based on age and gender
  - Points are added for each risk factor
  - Total points are converted to a 10-year risk percentage

  Risk Categories:
  - Low Risk: <10% chance of CVD in 10 years
  - Intermediate Risk: 10-20% chance
  - High Risk: >20% chance

  Note: This calculator uses a simplified algorithm. For clinical decisions, please refer to the full Framingham Risk Assessment.`,
  references: [
    'D\'Agostino RB, Vasan RS, Pencina MJ, et al. General cardiovascular risk profile for use in primary care: the Framingham Heart Study. Circulation. 2008;117(6):743-753.',
    'Goff DC, Lloyd-Jones DM, Bennett G, et al. 2013 ACC/AHA guideline on the assessment of cardiovascular risk: a report of the American College of Cardiology/American Heart Association Task Force on Practice Guidelines. Circulation. 2014;129(25 Suppl 2):S49-S73.'
  ],
  resultUnit: '%'
};
