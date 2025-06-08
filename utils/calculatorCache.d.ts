import { CalculatorConfig } from '../app/calculator/config/calculator';

declare const _default: {
  getCachedConfig: (id: string) => CalculatorConfig | null;
  setCachedConfig: (id: string, config: CalculatorConfig) => void;
  clearExpiredCache: () => void;
};

export default _default;
