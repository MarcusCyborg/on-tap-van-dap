import { describe, it, expect } from 'vitest';
import { calculateStats } from '../src/features/simulations/SimMeanMedian';
import { calculateBayes } from '../src/features/simulations/SimBayes';
import { computeConfusionMetrics, ILLUSTRATIVE_SAMPLES } from '../src/features/simulations/SimConfusionMatrix';
import { fitPolynomial, computeMSE } from '../src/features/simulations/SimOverfitting';
import { calculateNeuron } from '../src/features/simulations/SimNeuron';
import { computeLossAndGrad, takeGradientStep } from '../src/features/simulations/SimGradientDescent';
import { traceBinarySearch } from '../src/features/simulations/SimBinarySearch';
import { traceBFS, traceDFS } from '../src/features/simulations/SimGraphTraversal';

describe('Simulations Mathematical Verification', () => {
  // 1. Mean Median
  it('Sim 1: verifies preset [1, 2, 3, 4, 10]', () => {
    const pop = calculateStats([1, 2, 3, 4, 10], false);
    expect(pop.mean).toBe(4);
    expect(pop.median).toBe(3);
    expect(pop.variance).toBe(10);
    expect(pop.sd).toBeCloseTo(Math.sqrt(10), 4);

    const sample = calculateStats([1, 2, 3, 4, 10], true);
    expect(sample.mean).toBe(4);
    expect(sample.median).toBe(3);
    expect(sample.variance).toBe(12.5);
  });

  // 2. Bayes
  it('Sim 2: verifies preset p=1%, sens=90%, fpr=10% -> posterior ≈ 8.33%', () => {
    const stats = calculateBayes(0.01, 0.9, 0.1, 10000);
    expect(stats.tp).toBeCloseTo(90, 4);
    expect(stats.fn).toBeCloseTo(10, 4);
    expect(stats.fp).toBeCloseTo(990, 4);
    expect(stats.tn).toBeCloseTo(8910, 4);
    expect(stats.totalPositive).toBeCloseTo(1080, 4);
    expect(stats.posterior).toBeCloseTo(90 / 1080, 4); // 0.0833
  });

  it('Sim 2: handles zero denominator safely', () => {
    const stats = calculateBayes(0, 0, 0, 10000);
    expect(stats.posterior).toBeNull();
  });

  // 3. Confusion Matrix
  it('Sim 3: calculates confusion matrix metrics dynamically without hardcoding', () => {
    const res = computeConfusionMetrics(ILLUSTRATIVE_SAMPLES, 0.50);
    expect(res.tp + res.fp + res.fn + res.tn).toBe(24);
    expect(res.precision).toBeGreaterThan(0);
    expect(res.recall).toBeGreaterThan(0);
    expect(res.f1).toBeGreaterThan(0);
    expect(res.accuracy).toBeGreaterThan(0);
  });

  // 4. Overfitting
  it('Sim 4: fits stable polynomial without NaN or infinities', () => {
    const trainPoints = [{ x: -1, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 1 }];
    const weights = fitPolynomial(trainPoints, 2);
    expect(weights.length).toBe(3);
    for (const w of weights) {
      expect(Number.isFinite(w)).toBe(true);
    }
    const mse = computeMSE(trainPoints, weights);
    expect(Number.isFinite(mse)).toBe(true);
    expect(mse).toBeLessThan(0.01);
  });

  // 5. Neuron
  it('Sim 5: verifies preset x1=2, x2=1, w1=3, w2=-1, b=0 -> z=5, ReLU=5, Sigmoid≈0.9933', () => {
    const resRelu = calculateNeuron(2, 1, 3, -1, 0, 'relu');
    expect(resRelu.z).toBe(5);
    expect(resRelu.a).toBe(5);

    const resSig = calculateNeuron(2, 1, 3, -1, 0, 'sigmoid');
    expect(resSig.z).toBe(5);
    expect(resSig.a).toBeCloseTo(1 / (1 + Math.exp(-5)), 4); // ~0.9933

    const resNeg = calculateNeuron(1, 4, 1, -2, 0, 'relu'); // z = -7
    expect(resNeg.z).toBe(-7);
    expect(resNeg.a).toBe(0);
  });

  // 6. Gradient Descent
  it('Sim 6: verifies preset w=1, lr=0.1 -> next step w=1.4', () => {
    const step1 = takeGradientStep(1.0, 0.1);
    expect(step1.loss).toBe(4); // (1 - 3)^2
    expect(step1.grad).toBe(-4); // 2 * (1 - 3)
    expect(step1.nextW).toBeCloseTo(1.4, 4);

    // Oscillation test: lr = 1.0
    const osc = takeGradientStep(1.0, 1.0);
    expect(osc.nextW).toBeCloseTo(5.0, 4); // 1 - 1 * (-4) = 5
    const oscBack = takeGradientStep(5.0, 1.0);
    expect(oscBack.nextW).toBeCloseTo(1.0, 4); // 5 - 1 * (4) = 1
  });

  // 7. Binary Search
  it('Sim 7: verifies preset [1, 3, 5, 7, 9], target=8 -> mid 2 -> 3 -> 4, then not found', () => {
    const steps = traceBinarySearch([1, 3, 5, 7, 9], 8);
    expect(steps.length).toBe(4);
    expect(steps[0].mid).toBe(2); // arr[2] = 5 < 8 -> go right
    expect(steps[1].mid).toBe(3); // arr[3] = 7 < 8 -> go right
    expect(steps[2].mid).toBe(4); // arr[4] = 9 > 8 -> go left
    expect(steps[3].action).toBe('not_found');
  });

  // 8. Graph Traversal BFS and DFS
  it('Sim 8: verifies BFS finds shortest distance in edges from A', () => {
    const steps = traceBFS('A');
    const finalStep = steps[steps.length - 1];
    expect(finalStep.visited).toContain('A');
    expect(finalStep.visited).toContain('B');
    expect(finalStep.visited).toContain('C');
    expect(finalStep.visited).toContain('F');
    expect(finalStep.visited).not.toContain('G'); // G is disconnected

    expect(finalStep.distances?.['A']).toBe(0);
    expect(finalStep.distances?.['B']).toBe(1);
    expect(finalStep.distances?.['C']).toBe(1);
    expect(finalStep.distances?.['D']).toBe(2);
    expect(finalStep.distances?.['F']).toBe(3);
  });

  it('Sim 8: verifies DFS visits safely with cycles without infinite loop', () => {
    const steps = traceDFS('A');
    const finalStep = steps[steps.length - 1];
    expect(finalStep.visited.length).toBe(6); // A, B, C, D, E, F
    expect(finalStep.visited).not.toContain('G');
  });
});
