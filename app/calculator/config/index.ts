import { CalculatorConfig } from './calculator';
import { CALCULATIONS } from '@/data/calculations';
import * as Calculators from './categories';

// Define the type for the calculators object
interface Calculators {
  [key: string]: CalculatorConfig;
}

// Map calculator IDs to their export names
const CALCULATOR_EXPORTS: { [key: string]: string } = {
  bmi: 'bmiConfig',
  gcs: 'gcsConfig',
  map: 'mapConfig',
  'corrected-calcium': 'correctedCalciumConfig',
  'estimated-blood-volume': 'estimatedBloodVolumeConfig',
  'creatinine-clearance': 'creatinineClearanceConfig',
  'anion-gap': 'anionGapConfig',
  'warfarin-dose': 'warfarinDoseConfig',
  'ldl': 'ldlConfig',
  'serum-osmolality': 'serumOsmolalityConfig',
  'hematocrit': 'hematocritConfig',
  'transferrin-saturation': 'transferrinSaturationConfig',
  'fen': 'fenConfig',
  'child-dose': 'childDoseConfig',
  'alveolar-gas': 'alveolarGasConfig',
  'shock-index': 'shockIndexConfig',
  'bsa': 'bsaConfig',
  'apgar': 'apgarConfig',
  'oxygenation-index': 'oxygenationIndexConfig',
  'ibw': 'ibwConfig',
  'qtc': 'qtcConfig',
  'naranjo': 'naranjoConfig',
  'tcpo2-pao2': 'tcPo2PaO2Config',
  'infusion-rate': 'infusionRateConfig',
  'estimated-blood-loss': 'estimatedBloodLossConfig',
  'tidal-volume': 'tidalVolumeConfig',
  'cardiac-output': 'cardiacOutputConfig',
  'gestational-age': 'gestationalAgeConfig'
};

export const loadCalculatorConfig = (id: string): CalculatorConfig => {
  // Validate the calculator ID exists
  const calculator = CALCULATIONS.find(calc => calc.id === id);
  if (!calculator) {
    throw new Error(`Calculator not found for id: ${id}`);
  }

  // Get the export name for this calculator ID
  const exportName = CALCULATOR_EXPORTS[id];
  if (!exportName) {
    throw new Error(`No export name found for calculator: ${id}`);
  }

  // Get the calculator configuration from the index
  const config = (Calculators as unknown as Calculators)[exportName];
  if (!config) {
    throw new Error(`No configuration found for calculator: ${id}`);
  }

  return config;
};
