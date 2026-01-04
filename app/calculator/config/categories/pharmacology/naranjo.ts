import { CalculationStatus, CalculatorConfig, CalculatorValues } from '@/app/calculator/config/calculator';

export const naranjoConfig: CalculatorConfig = {
  id: 'naranjo',
  name: 'Naranjo ADR Probability Scale',
  description: 'Assesses the probability of whether an adverse drug reaction (ADR) is actually due to the drug rather than other factors.',
  category: 'Pharmacology',
  fields: [
    { 
      id: 'known_reaction',
      label: 'Are there previous conclusive reports on this reaction?',
      type: 'checkbox',
      unit: 'points'
    },
    { 
      id: 'previous_reaction',
      label: 'Did the adverse event appear after the suspected drug was administered?',
      type: 'checkbox',
      unit: 'points'
    },
    { 
      id: 'epidemiological',
      label: 'Did the adverse reaction improve when the drug was discontinued or a specific antagonist was administered?',
      type: 'checkbox',
      unit: 'points'
    },
    { 
      id: 'exclusion',
      label: 'Did the reaction reappear when the drug was readministered?',
      type: 'checkbox',
      unit: 'points'
    },
    { 
      id: 'occurrence',
      label: 'Are there alternative causes that could have caused the reaction?',
      type: 'checkbox',
      // This is a negatively phrased question - will be handled in calculation
      unit: 'points'
    },
    { 
      id: 'challenge',
      label: 'Did the reaction reappear when a placebo was given?',
      type: 'checkbox',
      // This is a negatively phrased question - will be handled in calculation
      unit: 'points'
    },
    { 
      id: 'dose_response',
      label: 'Was the drug detected in blood or other fluids in concentrations known to be toxic?',
      type: 'checkbox',
      unit: 'points'
    },
    { 
      id: 'plausibility',
      label: 'Was the reaction more severe when the dose was increased or less severe when the dose was decreased?',
      type: 'checkbox',
      unit: 'points'
    },
    { 
      id: 'previous_exposure',
      label: 'Did the patient have a similar reaction to the same or similar drugs in any previous exposure?',
      type: 'checkbox',
      unit: 'points'
    },
    { 
      id: 'objective_evidence',
      label: 'Was the adverse event confirmed by any objective evidence?',
      type: 'checkbox',
      unit: 'points'
    }
  ],
  validate: (values: CalculatorValues) => {
    // No validation needed for checkboxes
    return null;
  },
  calculate: (values: CalculatorValues) => {
    // Convert values to boolean - handles both string 'true'/'false' and boolean values
    const getBoolValue = (val: any): boolean => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') return val.toLowerCase() === 'true';
      return false;
    };
    
    const knownReaction = getBoolValue(values['known_reaction']);          // Q1
    const previousReaction = getBoolValue(values['previous_reaction']);    // Q2
    const dechallenge = getBoolValue(values['epidemiological']);           // Q3
    const rechallenge = getBoolValue(values['exclusion']);                 // Q4
    const altCauses = getBoolValue(values['occurrence']);                  // Q5 (negative score)
    const placeboResponse = getBoolValue(values['challenge']);             // Q6 (negative score)
    const drugLevels = getBoolValue(values['dose_response']);              // Q7
    const doseResponse = getBoolValue(values['plausibility']);             // Q8
    const previousExposure = getBoolValue(values['previous_exposure']);    // Q9
    const objectiveEvidence = getBoolValue(values['objective_evidence']);  // Q10
    
    // Initialize score
    let score = 0;
    
    // Q1: Previous conclusive reports on this reaction (+1 if checked)
    if (knownReaction) score += 1;
    
    // Q2: Event appeared after drug was administered (+2 if checked)
    if (previousReaction) score += 2;
    
    // Q3: Reaction improved when drug was discontinued (+1 if checked)
    if (dechallenge) score += 1;
    
    // Q4: Reaction reappeared when drug was readministered (+2 if checked)
    if (rechallenge) score += 2;
    
    // Q5: Alternative causes that could have caused the reaction (-1 if checked)
    if (altCauses) score -= 1;
    
    // Q6: Reaction reappeared when placebo was given (-1 if checked)
    if (placeboResponse) score -= 1;
    
    // Q7: Drug detected in toxic concentrations (+1 if checked)
    if (drugLevels) score += 1;
    
    // Q8: Reaction more severe with higher dose or less severe with lower dose (+1 if checked)
    if (doseResponse) score += 1;
    
    // Q9: Similar reaction in previous exposure (+1 if checked)
    if (previousExposure) score += 1;
    
    // Q10: Confirmed by objective evidence (+1 if checked)
    if (objectiveEvidence) score += 1;
    
    // Ensure score is not negative (minimum possible score is -2 if only Q5 and Q6 are checked)
    score = Math.max(0, score);
    
    let interpretation = '';
    let status: CalculationStatus = 'success';
    
    // Interpret the score according to Naranjo scale
    if (score >= 9) {
      interpretation = 'Definite adverse drug reaction (Score ≥ 9)';
      status = 'danger';
    } else if (score >= 5) {
      interpretation = 'Probable adverse drug reaction (Score 5-8)';
      status = 'danger';
    } else if (score >= 1) {
      interpretation = 'Possible adverse drug reaction (Score 1-4)';
      status = 'warning';
    } else {
      interpretation = 'Doubtful adverse drug reaction (Score 0)';
      status = 'success';
    }

    return {
      result: score,
      interpretation: `${interpretation} (Score: ${score})`,
      status
    };
  },
  formula: 'Naranjo ADR Probability Scale (Score range: 0-13)\n\n' +
           'Scoring:\n' +
           '1. Previous conclusive reports for this reaction: +1 if checked\n' +
           '2. Adverse event occurred after drug administration: +2 if checked\n' +
           '3. Reaction improved after drug discontinuation/antagonist: +1 if checked\n' +
           '4. Reaction reappeared after re-administration: +2 if checked\n' +
           '5. Alternative causes could explain reaction: -1 if checked\n' +
           '6. Reaction reappeared with placebo: -1 if checked\n' +
           '7. Drug level in toxic range: +1 if checked\n' +
           '8. Reaction worsened with dose increase/improved with decrease: +1 if checked\n' +
           '9. Previous similar reaction to same/related drug: +1 if checked\n' +
           '10. Adverse event confirmed by objective evidence: +1 if checked\n\n' +
           'Interpretation:\n' +
           '• Score 0: Doubtful\n' +
           '• Score 1-4: Possible\n' +
           '• Score 5-8: Probable\n' +
           '• Score ≥9: Definite\n\n' +
           'Note: Unchecked boxes contribute 0 points',
  references: [
    'Naranjo CA, et al. A method for estimating the probability of adverse drug reactions.',
    'Clinical Pharmacology & Therapeutics. Adverse Drug Reaction Probability Scale.',
    'Drug Safety. Assessment of Adverse Drug Reactions.'
  ],
  resultUnit: 'points (0-10)'
};
