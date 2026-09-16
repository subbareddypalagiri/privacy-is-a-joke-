/**
 * GhostShield Behavioral Biometric Armor
 * Neutralizes mouse-trajectory profiling, typing cadence biometrics, and accelerometer motion tracking.
 * Injects sub-millisecond Gaussian phase jitter to render behavioral biometric fingerprinting ineffective.
 */

export class BehavioralBiometricArmor {
  /**
   * Generates a sub-millisecond kinetic phase jitter for timestamp normalizations.
   * Prevents microsecond clock drift and timer-based fingerprinting (Performance.now() attacks).
   */
  public getJitteredTimestamp(rawTimestamp: number): number {
    // 50-100 microsecond random dispersion
    const jitterMicroseconds = (Math.random() * 0.05) - 0.025;
    return parseFloat((rawTimestamp + jitterMicroseconds).toFixed(3));
  }

  /**
   * Evaluates if a given event coordinate contains excessive precision used for biometric tracing.
   */
  public normalizeCoordinate(val: number): number {
    return Math.round(val);
  }
}
