/**
 * GhostShield Human-Drift Organic Behavioral Simulator
 * Generates mathematically authentic human interaction signatures (Cubic Bezier trajectories,
 * Fitts's Law velocity curves, Poisson dwell times, and non-linear scroll kinematics)
 * to defeat server-side Machine Learning bot/automation detection filters.
 */

export interface MouseCoordinate {
  x: number;
  y: number;
  timeMs: number;
}

export interface HumanBehavioralProfile {
  dwellTimeMs: number;
  scrollDepthPx: number;
  mouseTrajectory: MouseCoordinate[];
  naturalTypingIntervalsMs: number[];
}

export class HumanDriftSimulator {
  /**
   * Generates a realistic Poisson-distributed dwell time (in milliseconds)
   * Mimics organic human article reading and cognitive comprehension delays.
   */
  public generatePoissonDwellTime(lambdaSec: number = 4.5): number {
    // Knuth's algorithm for Poisson random variables + log-normal reading variation
    const L = Math.exp(-lambdaSec);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    
    const baseSeconds = Math.max(1.5, k - 1 + (Math.random() * 0.8));
    return Math.floor(baseSeconds * 1000);
  }

  /**
   * Generates a natural human Cubic Bezier mouse trajectory with micro-tremors
   * compliant with Fitts's Law of psychomotor movement.
   */
  public generateHumanTrajectory(
    startX: number = 100,
    startY: number = 200,
    endX: number = 800,
    endY: number = 600,
    steps: number = 25
  ): MouseCoordinate[] {
    const trajectory: MouseCoordinate[] = [];
    
    // Control points with random human overshoot / curvature
    const cp1X = startX + (endX - startX) * 0.25 + (Math.random() * 60 - 30);
    const cp1Y = startY + (endY - startY) * 0.1 + (Math.random() * 60 - 30);
    const cp2X = startX + (endX - startX) * 0.75 + (Math.random() * 60 - 30);
    const cp2Y = startY + (endY - startY) * 0.9 + (Math.random() * 60 - 30);

    let currentTime = 0;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Cubic Bezier formula: B(t) = (1-t)^3*P0 + 3*(1-t)^2*t*P1 + 3*(1-t)*t^2*P2 + t^3*P3
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      let x = uuu * startX + 3 * uu * t * cp1X + 3 * u * tt * cp2X + ttt * endX;
      let y = uuu * startY + 3 * uu * t * cp1Y + 3 * u * tt * cp2Y + ttt * endY;

      // Add sub-pixel micro-tremor (physiological hand tremor: 8-12 Hz)
      const tremor = (Math.random() - 0.5) * 1.5;
      x += tremor;
      y += tremor;

      // Variable velocity profile (Ease-in, peak velocity in middle, Ease-out at target)
      const velocityWeight = Math.sin(t * Math.PI);
      const stepDuration = 15 + Math.floor((1 - velocityWeight) * 20) + Math.floor(Math.random() * 5);
      currentTime += stepDuration;

      trajectory.push({
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        timeMs: currentTime,
      });
    }

    return trajectory;
  }

  /**
   * Generates realistic inter-keystroke intervals (in milliseconds)
   * conforming to human cognitive typing rhythm distributions.
   */
  public generateKeystrokeDelays(charCount: number): number[] {
    const delays: number[] = [];
    for (let i = 0; i < charCount; i++) {
      // Normal human typing speed: 60-180ms per key with occasional thinking pauses
      const isPause = Math.random() < 0.08;
      const baseDelay = isPause ? 250 + Math.random() * 400 : 70 + Math.random() * 110;
      delays.push(Math.floor(baseDelay));
    }
    return delays;
  }

  /**
   * Constructs a full authentic behavioral bundle for synthetic entropy pulses
   */
  public createBehavioralBundle(queryText: string): HumanBehavioralProfile {
    return {
      dwellTimeMs: this.generatePoissonDwellTime(4.2),
      scrollDepthPx: Math.floor(400 + Math.random() * 1200),
      mouseTrajectory: this.generateHumanTrajectory(),
      naturalTypingIntervalsMs: this.generateKeystrokeDelays(queryText.length),
    };
  }
}
