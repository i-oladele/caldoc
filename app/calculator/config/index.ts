import { CalculatorConfig } from './calculator';
import { CALCULATIONS } from '@/data/calculations';

// Map calculator IDs to their category paths
const CALCULATOR_PATHS: { [key: string]: string } = {
  bmi: 'general/bmi',
  gcs: 'neurology/gcs',
  map: 'cardiology/map',
  'corrected-calcium': 'metabolism/corrected-calcium',
  'estimated-blood-volume': 'metabolism/estimated-blood-volume',
  'creatinine-clearance': 'nephrology/creatinine-clearance',
  'anion-gap': 'metabolism/anion-gap',
  'warfarin-dose': 'hematology/warfarin-dose',
  'ldl': 'metabolism/ldl',
  'serum-osmolality': 'metabolism/serum-osmolality',
  'hematocrit': 'hematology/hematocrit',
  'transferrin-saturation': 'metabolism/transferrin-saturation',
  'fen': 'nephrology/fen',
  'child-dose': 'pediatrics/child-dose',
  'alveolar-gas': 'respiratory/alveolar-gas',
  'shock-index': 'critical-care/shock-index',
  'bsa': 'general/bsa',
  'apgar': 'pediatrics/apgar',
  'oxygenation-index': 'respiratory/oxygenation-index',
  'ibw': 'general/ibw',
  'qtc': 'cardiology/qtc',
  'naranjo': 'pharmacology/naranjo',
  'tcpo2-pao2': 'respiratory/tcpo2-pao2',
  'infusion-rate': 'pharmacology/infusion-rate',
  'estimated-blood-loss': 'surgery/estimated-blood-loss',
  'tidal-volume': 'respiratory/tidal-volume',
  'cardiac-output': 'cardiology/cardiac-output',
  'gestational-age': 'obstetrics/gestational-age'
};

export const loadCalculatorConfig = async (id: string): Promise<CalculatorConfig> => {
  // Validate the calculator ID exists
  const calculator = CALCULATIONS.find(calc => calc.id === id);
  if (!calculator) {
    throw new Error(`Calculator not found for id: ${id}`);
  }

  // Get the category path
  const path = CALCULATOR_PATHS[id];
  if (!path) {
    throw new Error(`No configuration path found for calculator: ${id}`);
  }

  try {
    // Import the calculator configuration using the full path
    const config = await import(`./categories/${path}`);
    if (!config.default) {
      throw new Error(`No default export found in calculator config for ${id}`);
    }
    return config.default;
  } catch (error) {
    console.error(`Error loading calculator config for ${id}:`, error);
    throw new Error(`Failed to load calculator configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
