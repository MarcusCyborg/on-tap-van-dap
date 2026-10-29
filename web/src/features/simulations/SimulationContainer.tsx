import React from 'react';
import { SIMULATIONS_META } from '../../content/metadata';
import type { SimulationMeta } from '../../content/metadata';
import { SimMeanMedian } from './SimMeanMedian';
import { SimBayes } from './SimBayes';
import { SimConfusionMatrix } from './SimConfusionMatrix';
import { SimOverfitting } from './SimOverfitting';
import { SimNeuron } from './SimNeuron';
import { SimGradientDescent } from './SimGradientDescent';
import { SimBinarySearch } from './SimBinarySearch';
import { SimGraphTraversal } from './SimGraphTraversal';

interface SimulationContainerProps {
  simulationId: string;
}

export const SimulationContainer: React.FC<SimulationContainerProps> = ({ simulationId }) => {
  const meta: SimulationMeta | undefined = SIMULATIONS_META.find(s => s.id === simulationId);

  let component = null;
  switch (simulationId) {
    case 'sim-mean-median':
      component = <SimMeanMedian />;
      break;
    case 'sim-bayes':
      component = <SimBayes />;
      break;
    case 'sim-confusion-matrix':
      component = <SimConfusionMatrix />;
      break;
    case 'sim-overfitting':
      component = <SimOverfitting />;
      break;
    case 'sim-neuron':
      component = <SimNeuron />;
      break;
    case 'sim-gradient-descent':
      component = <SimGradientDescent />;
      break;
    case 'sim-binary-search':
      component = <SimBinarySearch />;
      break;
    case 'sim-bfs-dfs':
      component = <SimGraphTraversal />;
      break;
    default:
      return null;
  }

  return (
    <div className="w-full my-6">
      {component}
    </div>
  );
};
