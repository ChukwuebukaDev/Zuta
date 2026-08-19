import type { VehicleIdentityInput } from "@/app/modules/ai-search/intelligence/identity/resolve-vehicle";
import type { VehicleVariantReference } from "./types";

import {
  scoreVehicleCandidate,
  MAX_VEHICLE_MATCH_SCORE,
  calculateAvailableMatchWeight,
} from "./score-candidates";

/**
 * Maximum score difference allowed for candidates
 * to be considered competitive.
 *
 * Example:
 *
 * Best candidate:      100
 * Another candidate:    95
 *
 * Difference = 5
 *
 * Since 5 <= 10, both candidates are competitive.
 */
const COMPETITIVE_SCORE_GAP = 10;

/**
 * Number of optional configuration fields that can
 * contribute additional vehicle identity information.
 *
 * Core identity:
 *   brand + model + year
 *
 * Configuration identity:
 *   engine code
 *   engine size
 *   fuel type
 *   transmission
 *   drivetrain
 *   country / market
 */
const CONFIGURATION_FIELDS = 6;

export interface VehicleCandidateMatch {
  candidate: VehicleVariantReference;
  score: number;
}

export interface VehicleCandidateSelection {
  /**
   * Every candidate sorted from highest score
   * to lowest score.
   */
  rankedCandidates: VehicleCandidateMatch[];

  /**
   * Highest-scoring candidate.
   */
  best: VehicleCandidateMatch;

  /**
   * Candidates whose scores are close enough to
   * the best candidate to be considered competitors.
   */
  competitiveCandidates: VehicleCandidateMatch[];

  /**
   * Heuristic confidence from 0 to 1.
   *
   * IMPORTANT:
   * This is not a statistical probability.
   */
  confidence: number;

  /**
   * Measures how much optional configuration information
   * was provided by the input.
   *
   * 0 = no configuration information
   * 1 = all configuration fields provided
   */
  configurationCoverage: number;

  /**
   * Measures how strong the supplied identifying
   * information is.
   *
   * Engine code is considered stronger than things
   * such as fuel type or country.
   */
  identificationStrength: number;

  /**
   * True when multiple candidates are sufficiently
   * close to the best candidate.
   */
  isAmbiguous: boolean;
}

export function selectBestVehicleCandidate(
  input: VehicleIdentityInput,
  candidates: VehicleVariantReference[]
): VehicleCandidateSelection | null {
  /**
   * If no candidates were found, there is nothing
   * to rank or select.
   */
  if (candidates.length === 0) {
    return null;
  }

  /**
   * Score every candidate and sort from strongest
   * match to weakest match.
   */
  const rankedCandidates = candidates
    .map((candidate) => ({
      candidate,
      score: scoreVehicleCandidate(
        input,
        candidate
      ),
    }))
    .sort((a, b) => b.score - a.score);

  /**
   * Because candidates.length > 0, the first
   * ranked candidate always exists.
   */
  const best = rankedCandidates[0];

  /**
   * Find all candidates whose scores are within
   * the competitive range of the best candidate.
   */
  const competitiveCandidates =
    rankedCandidates.filter(
      (candidate) =>
        best.score - candidate.score <=
        COMPETITIVE_SCORE_GAP
    );

  /**
   * The second-highest candidate is useful for
   * measuring how clearly the winner beats
   * its closest competitor.
   */
  const secondBest =
    rankedCandidates[1] ?? null;

  /**
   * Measure how much configuration information
   * the input contains.
   */
  const configurationCoverage =
    calculateConfigurationCoverage(input);

  /**
   * Measure how strong the supplied identifying
   * information is.
   */
  const identificationStrength =
    calculateIdentificationStrength(input);

  /**
   * Calculate the maximum score that was actually
   * available based on the fields supplied by the user.
   *
   * This is important because 35/135 does NOT mean
   * the candidate matched poorly when the user only
   * supplied an engine code.
   *
   * In that case, only 35 points were actually available.
   */
  const availableMatchWeight =
    calculateAvailableMatchWeight(input);

  /**
   * Calculate final confidence using:
   *
   * - how well the supplied evidence matched
   * - how strong that evidence is
   * - how much configuration information was supplied
   * - how clearly the winner beats competitors
   * - how many competitive candidates exist
   */

  
  const confidence =
    calculateMatchConfidence(
      best.score,
      secondBest?.score ?? null,
      competitiveCandidates.length,
      configurationCoverage,
      identificationStrength,
      availableMatchWeight
    );

  /**
   * More than one competitive candidate means
   * the system cannot confidently distinguish
   * a unique variant.
   */
  const isAmbiguous =
    competitiveCandidates.length > 1;

  return {
    rankedCandidates,
    best,
    competitiveCandidates,
    confidence,
    configurationCoverage,
    identificationStrength,
    isAmbiguous,
  };
}

/**
 * Calculates how much optional configuration information
 * was supplied by the input.
 *
 * This measures QUANTITY of information, not quality.
 *
 * Example:
 *
 * Engine code only:
 *   1 / 6 = 0.17
 *
 * Engine code + engine size:
 *   2 / 6 = 0.33
 *
 * All configuration fields:
 *   6 / 6 = 1.00
 */
function calculateConfigurationCoverage(
  input: VehicleIdentityInput
): number {
  let available = 0;

  if (input.engineCode) {
    available++;
  }

  if (input.engineSize) {
    available++;
  }

  if (input.fuelType) {
    available++;
  }

  if (input.transmission) {
    available++;
  }

  if (input.drivetrain) {
    available++;
  }

  if (input.country) {
    available++;
  }

  return Number(
    Math.min(
      available / CONFIGURATION_FIELDS,
      1
    ).toFixed(2)
  );
}

/**
 * Calculates the strength of the identifying information
 * supplied by the user.
 *
 * This is different from configurationCoverage.
 *
 * Coverage asks:
 *   "How much information did we receive?"
 *
 * Strength asks:
 *   "How useful is that information for identifying
 *    a specific vehicle?"
 *
 * Engine code is given the highest weight because it
 * can identify a specific engine family.
 */
function calculateIdentificationStrength(
  input: VehicleIdentityInput
): number {
  let strength = 0;

  if (input.engineCode) {
    strength += 0.6;
  }

  if (input.engineSize) {
    strength += 0.25;
  }

  if (input.fuelType) {
    strength += 0.05;
  }

  if (input.transmission) {
    strength += 0.05;
  }

  if (input.drivetrain) {
    strength += 0.03;
  }

  if (input.country) {
    strength += 0.02;
  }

  return Number(Math.min(strength, 1).toFixed(2));
}

/**
 * Calculates confidence from the available evidence.
 *
 * This is a HEURISTIC confidence score.
 * It is NOT a statistical probability.
 *
 * The important distinction is that we calculate
 * match quality relative to the information that
 * was actually supplied.
 *
 * Example:
 *
 * Engine code only:
 *
 *   Available weight = 35
 *   Best score       = 35
 *
 *   Evidence match quality = 35 / 35 = 1.00
 *
 * This is much more meaningful than:
 *
 *   35 / 135 = 0.26
 *
 * because the user never supplied the other fields.
 */
function calculateMatchConfidence(
  bestScore: number,
  secondBestScore: number | null,
  competitiveCandidateCount: number,
  configurationCoverage: number,
  identificationStrength: number,
  availableMatchWeight: number
): number {
  /**
   * Determine how completely the supplied evidence
   * matched the best candidate.
   *
   * If no configuration information was supplied,
   * this becomes 0.
   */
  const evidenceMatchQuality =
    availableMatchWeight > 0
      ? bestScore / availableMatchWeight
      : 0;

  /**
   * Prevent the value from exceeding 1.
   */
  const normalizedEvidenceMatchQuality =
    Math.min(evidenceMatchQuality, 1);

  /**
   * If there is only one candidate, we cannot
   * compare it against another candidate.
   *
   * Confidence therefore depends on:
   *
   * 1. How well the supplied evidence matched.
   * 2. How strong that evidence is.
   * 3. How much configuration information was supplied.
   */
  if (secondBestScore === null) {
    const confidence =
      normalizedEvidenceMatchQuality * 0.45 +
      identificationStrength * 0.35 +
      configurationCoverage * 0.20;

    return Number(
      Math.max(0, Math.min(confidence, 1))
        .toFixed(2)
    );
  }

  /**
   * Calculate how far ahead the best candidate
   * is compared with the second-best candidate.
   */
  const scoreGap =
    bestScore - secondBestScore;

  /**
   * A 20-point gap or greater gives maximum
   * separation confidence.
   */
  const separation =
    Math.min(scoreGap / 20, 1);

  /**
   * More competitive candidates reduce confidence.
   *
   * The best candidate is excluded from the penalty.
   */
  const competition =
    Math.min(
      (competitiveCandidateCount - 1) / 4,
      1
    );

  /**
   * Combine the different confidence signals.
   *
   * Evidence match quality:
   *   40%
   *
   * Identification strength:
   *   30%
   *
   * Candidate separation:
   *   20%
   *
   * Configuration coverage:
   *   10%
   *
   * Competition:
   *   -10% maximum penalty
   */
  const confidence =
    normalizedEvidenceMatchQuality * 0.40 +
    identificationStrength * 0.30 +
    separation * 0.20 +
    configurationCoverage * 0.10 -
    competition * 0.10;

  /**
   * Keep confidence inside the valid 0-1 range.
   */
  return Number(
    Math.max(0, Math.min(confidence, 1))
      .toFixed(2)
  );
}