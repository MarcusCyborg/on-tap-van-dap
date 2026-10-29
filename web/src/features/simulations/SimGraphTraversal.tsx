import React, { useState } from 'react';
import { RotateCcw, HelpCircle, StepForward, CheckCircle2, AlertCircle } from 'lucide-react';

export interface GraphNode {
  id: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  u: string;
  v: string;
}

// 7 nodes: A, B, C, D, E, F, G (G is disconnected)
export const GRAPH_NODES: GraphNode[] = [
  { id: 'A', x: 80, y: 110 },
  { id: 'B', x: 190, y: 50 },
  { id: 'C', x: 190, y: 170 },
  { id: 'D', x: 300, y: 50 },
  { id: 'E', x: 300, y: 170 },
  { id: 'F', x: 400, y: 110 },
  { id: 'G', x: 440, y: 40 } // Disconnected component
];

// Undirected edges with cycles (e.g. B-D-E-C-B)
export const GRAPH_EDGES: GraphEdge[] = [
  { u: 'A', v: 'B' },
  { u: 'A', v: 'C' },
  { u: 'B', v: 'D' },
  { u: 'B', v: 'C' }, // cycle
  { u: 'C', v: 'E' },
  { u: 'D', v: 'E' }, // cycle
  { u: 'D', v: 'F' },
  { u: 'E', v: 'F' }
];

// Adjacency list with strictly sorted neighbors (alphabetical)
export const ADJ_LIST: Record<string, string[]> = {
  A: ['B', 'C'],
  B: ['A', 'C', 'D'],
  C: ['A', 'B', 'E'],
  D: ['B', 'E', 'F'],
  E: ['C', 'D', 'F'],
  F: ['D', 'E'],
  G: [] // Isolated
};

export interface TraversalStep {
  stepIndex: number;
  currentNode: string;
  frontier: string[]; // Queue for BFS, Stack for DFS
  visited: string[];
  distances?: Record<string, number>; // BFS edge distances
  explanation: string;
}

export function traceBFS(startNode: string): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const queue: string[] = [startNode];
  const visited = new Set<string>([startNode]);
  const visitedOrder: string[] = [];
  const distances: Record<string, number> = { [startNode]: 0 };

  steps.push({
    stepIndex: 1,
    currentNode: startNode,
    frontier: [...queue],
    visited: Array.from(visited),
    distances: { ...distances },
    explanation: `Bắt đầu BFS tại đỉnh nguồn ${startNode}. Đưa ${startNode} vào Hàng đợi (Queue), khoảng cách d = 0.`
  });

  let stepCount = 2;

  while (queue.length > 0) {
    const u = queue.shift()!;
    visitedOrder.push(u);

    const neighbors = ADJ_LIST[u] || [];
    const unvisitedNeighbors = neighbors.filter(v => !visited.has(v));

    for (const v of unvisitedNeighbors) {
      visited.add(v);
      distances[v] = distances[u] + 1;
      queue.push(v);
    }

    steps.push({
      stepIndex: stepCount++,
      currentNode: u,
      frontier: [...queue],
      visited: Array.from(visited),
      distances: { ...distances },
      explanation: `Lấy đỉnh ${u} ra khỏi Queue (d = ${distances[u]}). Thăm các láng giềng chưa thăm theo thứ tự chữ cái [${unvisitedNeighbors.join(', ')}], gán khoảng cách d = ${distances[u] + 1} và đưa vào cuối Queue.`
    });
  }

  return steps;
}

export function traceDFS(startNode: string): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const stack: string[] = [startNode];
  const visited = new Set<string>();
  const visitedOrder: string[] = [];

  steps.push({
    stepIndex: 1,
    currentNode: startNode,
    frontier: [...stack],
    visited: [],
    explanation: `Bắt đầu DFS tại đỉnh nguồn ${startNode}. Đẩy ${startNode} vào Ngăn xếp (Stack).`
  });

  let stepCount = 2;

  while (stack.length > 0) {
    const u = stack.pop()!;
    if (!visited.has(u)) {
      visited.add(u);
      visitedOrder.push(u);

      const neighbors = ADJ_LIST[u] || [];
      // To visit in alphabetical order with a stack, push in reverse order
      const unvisitedNeighbors = neighbors.filter(v => !visited.has(v)).reverse();

      for (const v of unvisitedNeighbors) {
        stack.push(v);
      }

      steps.push({
        stepIndex: stepCount++,
        currentNode: u,
        frontier: [...stack],
        visited: Array.from(visited),
        explanation: `Lấy đỉnh ${u} từ đỉnh Ngăn xếp (Stack), đánh dấu Đã thăm. Đẩy các láng giềng chưa thăm [${[...unvisitedNeighbors].reverse().join(', ')}] vào Stack để đi sâu.`
      });
    }
  }

  return steps;
}

export const SimGraphTraversal: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<'BFS' | 'DFS'>('BFS');
  const [startNode, setStartNode] = useState<string>('A');
  const [stepIdx, setStepIdx] = useState<number>(0);

  const steps = algorithm === 'BFS' ? traceBFS(startNode) : traceDFS(startNode);
  const currentStep = steps[stepIdx] || steps[0];

  const reset = () => {
    setAlgorithm('BFS');
    setStartNode('A');
    setStepIdx(0);
  };

  const isNodeVisited = (id: string) => currentStep.visited.includes(id);
  const isNodeInFrontier = (id: string) => currentStep.frontier.includes(id);
  const isCurrent = (id: string) => currentStep.currentNode === id;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gt-light text-gt-dark border border-gt-border">
            Mô phỏng GT08, GT09, GT24, GT26 & GT27
          </span>
          <h3 className="text-base font-bold text-ink mt-1">
            Duyệt Đồ thị: So sánh BFS (Hàng đợi) và DFS (Ngăn xếp)
          </h3>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-border rounded px-2.5 py-1 bg-surface-muted transition-colors"
          title="Đặt lại BFS từ đỉnh A"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại mặc định
        </button>
      </div>

      <div className="bg-gt-light/60 border border-gt-border rounded-lg p-3 text-sm text-ink flex gap-2">
        <HelpCircle className="w-4 h-4 text-xs shrink-0 mt-0.5" />
        <div>
          <strong>Câu hỏi gợi mở:</strong> Vì sao BFS dùng Hàng đợi (Queue) bảo đảm tìm được <strong>đường đi ngắn nhất theo số cạnh</strong> trên đồ thị không trọng số, trong khi DFS dùng Ngăn xếp (Stack) lại đi sâu theo một nhánh và không đảm bảo tính chất này?
        </div>
      </div>

      {/* Traversal Algorithm & Start Node Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-muted/50 p-3.5 rounded-lg border border-border">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink block">Chọn Thuật toán:</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setAlgorithm('BFS'); setStepIdx(0); }}
              className={`py-2 px-3 rounded-lg font-bold border transition-all ${
                algorithm === 'BFS'
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'bg-surface border-border text-muted hover:text-ink'
              }`}
            >
              BFS (Queue - FIFO)
              <span className="block text-[10px] font-normal opacity-80">Đường đi ngắn nhất theo cạnh</span>
            </button>
            <button
              onClick={() => { setAlgorithm('DFS'); setStepIdx(0); }}
              className={`py-2 px-3 rounded-lg font-bold border transition-all ${
                algorithm === 'DFS'
                  ? 'bg-[#8a4b16] text-white border-[#8a4b16] shadow-sm'
                  : 'bg-surface border-border text-muted hover:text-ink'
              }`}
            >
              DFS (Stack - LIFO)
              <span className="block text-[10px] font-normal opacity-80">Đi sâu tìm đường / chu trình</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink block">Đỉnh bắt đầu (Nguồn):</label>
          <div className="flex gap-1.5 flex-wrap">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(id => (
              <button
                key={id}
                onClick={() => { setStartNode(id); setStepIdx(0); }}
                className={`w-9 h-8 rounded-lg text-xs font-bold border transition-all ${
                  startNode === id
                    ? 'bg-ink text-white border-ink'
                    : 'bg-surface border-border text-muted hover:text-ink'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-muted">
            Đỉnh <strong>G</strong> là đỉnh cô lập (không có cạnh kết nối với A-F).
          </div>
        </div>
      </div>

      {/* SVG Graph Canvas */}
      <div className="bg-surface-muted rounded-xl p-3 border border-border">
        <div className="flex items-center justify-between text-xs text-muted mb-1 font-medium">
          <span>Sơ đồ đồ thị (7 đỉnh, có chu trình B-D-E-C, đỉnh G cô lập):</span>
          <span className="font-mono text-accent font-semibold">
            Đang duyệt: {algorithm} từ {startNode}
          </span>
        </div>

        <svg viewBox="0 0 500 220" className="w-full h-52 max-w-full">
          {/* Edges */}
          {GRAPH_EDGES.map((edge, i) => {
            const u = GRAPH_NODES.find(n => n.id === edge.u)!;
            const v = GRAPH_NODES.find(n => n.id === edge.v)!;
            const isTraversed = isNodeVisited(edge.u) && isNodeVisited(edge.v);
            return (
              <line
                key={i}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={isTraversed ? '#27624a' : '#ccd5cb'}
                strokeWidth={isTraversed ? '2.5' : '1.5'}
              />
            );
          })}

          {/* Nodes */}
          {GRAPH_NODES.map(node => {
            const visited = isNodeVisited(node.id);
            const inFrontier = isNodeInFrontier(node.id);
            const active = isCurrent(node.id);
            const dist = currentStep.distances?.[node.id];

            return (
              <g key={node.id}>
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill={
                    active
                      ? '#8a4b16'
                      : visited
                      ? '#27624a'
                      : inFrontier
                      ? '#2b5c8f'
                      : '#fffefa'
                  }
                  stroke={active ? '#63350e' : visited ? '#1b4534' : inFrontier ? '#1d426a' : '#aab4a8'}
                  strokeWidth={active ? '3' : '2'}
                />

                {/* Node ID */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill={visited || inFrontier || active ? '#ffffff' : '#202b27'}
                >
                  {node.id}
                </text>

                {/* Distance tag for BFS */}
                {algorithm === 'BFS' && dist !== undefined && (
                  <text
                    x={node.x}
                    y={node.y + 30}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#27624a"
                  >
                    d = {dist}
                  </text>
                )}
                {node.id === 'G' && (
                  <text x={node.x} y={node.y - 22} fontSize="9" textAnchor="middle" fill="#865510">
                    (Cô lập)
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Frontier & State Tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Frontier (Queue / Stack) */}
        <div className="p-3 bg-surface border border-border rounded-lg space-y-1">
          <div className="font-semibold text-muted flex justify-between">
            <span>{algorithm === 'BFS' ? 'Hàng đợi (Queue - FIFO):' : 'Ngăn xếp (Stack - LIFO):'}</span>
            <span className="font-mono">{currentStep.frontier.length} phần tử</span>
          </div>
          <div className="p-2 bg-surface-muted rounded font-mono text-sm font-bold min-h-[36px] flex items-center gap-1.5 overflow-x-auto">
            {currentStep.frontier.length > 0 ? (
              currentStep.frontier.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-blue-100 text-[#2b5c8f] border border-blue-200"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-muted font-normal text-xs">[Rỗng]</span>
            )}
          </div>
        </div>

        {/* Visited Set */}
        <div className="p-3 bg-surface border border-border rounded-lg space-y-1">
          <div className="font-semibold text-muted flex justify-between">
            <span>Tập đỉnh đã duyệt (Visited Set):</span>
            <span className="font-mono">{currentStep.visited.length} / 7 đỉnh</span>
          </div>
          <div className="p-2 bg-surface-muted rounded font-mono text-sm font-bold min-h-[36px] flex items-center gap-1.5 overflow-x-auto">
            {currentStep.visited.length > 0 ? (
              currentStep.visited.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-green-100 text-[#27624a] border border-green-200"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-muted font-normal text-xs">[Chưa có]</span>
            )}
          </div>
        </div>
      </div>

      {/* Stepping Navigation Controls */}
      <div className="flex items-center justify-between gap-3 bg-surface-muted/60 p-3 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStepIdx(prev => Math.max(0, prev - 1))}
            disabled={stepIdx === 0}
            className="px-3 py-1.5 rounded bg-surface border border-border text-xs font-semibold hover:bg-surface-muted disabled:opacity-50"
          >
            Bước trước
          </button>
          <button
            onClick={() => setStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={stepIdx >= steps.length - 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent text-white text-xs font-semibold hover:bg-accent-dark disabled:opacity-50"
          >
            <StepForward className="w-3.5 h-3.5" />
            Bước tiếp
          </button>
        </div>

        <span className="text-xs text-muted font-mono">
          Bước {stepIdx + 1} / {steps.length}
        </span>
      </div>

      {/* Step Explanation */}
      <div className="p-3 bg-surface border border-border rounded-lg text-xs space-y-1">
        <span className="font-semibold text-accent-dark">
          Diễn giải bước {stepIdx + 1}:
        </span>
        <p className="text-ink">{currentStep.explanation}</p>
      </div>

      {/* Partial Traversal Note if starting at G */}
      {startNode === 'G' && (
        <div className="p-2.5 bg-amber-50 border border-warning-ink/30 rounded text-xs text-warning-ink flex gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Đỉnh G cô lập nên duyệt dừng lại ngay sau bước 1. Đồ thị chỉ được duyệt một phần, không thể đi tới các đỉnh A-F từ nguồn G.
          </span>
        </div>
      )}

      {/* Conditional Conclusion */}
      <div className="bg-surface-muted p-3.5 rounded-lg text-xs sm:text-sm text-ink border-l-4 border-accent">
        <div className="font-semibold text-accent-dark flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          Trọng tâm vấn đáp về BFS và DFS:
        </div>
        <p className="mt-1">
          - <strong>BFS (Breadth-First Search):</strong> Luôn duyệt theo từng lớp khoảng cách (lớp 0 → lớp 1 → lớp 2). Nhờ cơ chế FIFO của Hàng đợi, lần đầu tiên BFS chạm tới một đỉnh cũng chính là <strong>đường đi có ít cạnh nhất</strong> từ nguồn tới đỉnh đó.
          <br />
          - <strong>DFS (Depth-First Search):</strong> Sử dụng cơ chế LIFO của Ngăn xếp (hoặc đệ quy) để đi sâu theo một nhánh cho tới khi chạm đáy rồi mới quay lui (backtracking). DFS <strong>KHÔNG được gọi là đường đi ngắn nhất</strong>.
          <br />
          - <strong>Tập Visited:</strong> Cả BFS và DFS đều bắt buộc dùng mảng/tập <code>visited</code> để tránh lặp vô tận khi đồ thị có chu trình.
        </p>
      </div>
    </div>
  );
};
