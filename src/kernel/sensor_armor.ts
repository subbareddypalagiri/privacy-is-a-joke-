/**
 * FUF Acoustic, Kinematic & Co-Location Sensor Farbler (Vector 36)
 * 
 * Surveillance networks correlate users sitting in the same room, bus, or office
 * by cross-matching high-frequency accelerometer and gyroscope micro-vibrations.
 * 
 * SensorQuencher quantizes device sensor readings (accelerometer, gyroscope, orientation)
 * to coarse intervals and injects microsecond random noise, completely destroying
 * co-location spatial correlation algorithms.
 */

export interface QuantizedSensorReading {
  x: number;
  y: number;
  z: number;
  fuzzFactorApplied: boolean;
}

export class SensorQuencher {
  // Step size for quantizing accelerometer values (in m/s^2)
  private static readonly ACCEL_QUANTUM = 0.25;
  // Step size for quantizing gyroscope angles (in degrees)
  private static readonly GYRO_QUANTUM = 1.0;

  private fuzzedSamplesCount: number = 0;

  /**
   * Quantizes and introduces thermal micro-noise into 3-axis accelerometer readings.
   */
  public quenchAcceleration(x: number, y: number, z: number): QuantizedSensorReading {
    this.fuzzedSamplesCount++;
    const quant = SensorQuencher.ACCEL_QUANTUM;

    // Quantize to nearest step
    const qX = Math.round(x / quant) * quant;
    const qY = Math.round(y / quant) * quant;
    const qZ = Math.round(z / quant) * quant;

    // Inject imperceptible micro-noise (bounded by +-0.02)
    const noise = (Math.random() - 0.5) * 0.04;

    return {
      x: parseFloat((qX + noise).toFixed(3)),
      y: parseFloat((qY + noise).toFixed(3)),
      z: parseFloat((qZ + noise).toFixed(3)),
      fuzzFactorApplied: true
    };
  }

  /**
   * Quantizes rotation angles (alpha, beta, gamma).
   */
  public quenchRotation(alpha: number, beta: number, gamma: number): { alpha: number; beta: number; gamma: number } {
    const quant = SensorQuencher.GYRO_QUANTUM;
    return {
      alpha: Math.round(alpha / quant) * quant,
      beta: Math.round(beta / quant) * quant,
      gamma: Math.round(gamma / quant) * quant
    };
  }

  public getStats() {
    return {
      fuzzedSensorSamples: this.fuzzedSamplesCount
    };
  }
}
