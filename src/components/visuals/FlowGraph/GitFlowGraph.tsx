// Git Flow Graph Container using React Flow
import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  BackgroundVariant,
} from '@xyflow/react';
import { Box, Paper, Typography, alpha, useTheme } from '@mui/material';
import { GitCommitNode } from './GitCommitNode';
import { GitBranchNode } from './GitBranchNode';
import '@xyflow/react/dist/style.css';

// Configuration
const CONFIG = {
  defaultViewport: { x: 50, y: 50, zoom: 1 },
  nodeSpacing: { x: 200, y: 100 },
  edgeStyle: {
    stroke: '#007AFF',
    strokeWidth: 2,
  },
};

// Node types - using any to avoid complex type constraints
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: Record<string, any> = {
  commit: GitCommitNode,
  branch: GitBranchNode,
};

// Types
export interface GitGraphData {
  commits: Array<{
    id: string;
    hash: string;
    message: string;
    author?: string;
    parentIds: string[];
  }>;
  branches: Array<{
    name: string;
    headCommitId: string;
    isCurrent?: boolean;
  }>;
}

interface GitFlowGraphProps {
  data: GitGraphData;
  title?: string;
  height?: number | string;
  onNodeClick?: (nodeId: string, type: 'commit' | 'branch') => void;
}

/**
 * Convert Git data to React Flow nodes and edges
 */
function createFlowElements(data: GitGraphData): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create commit nodes
  const commitPositions = new Map<string, { x: number; y: number }>();
  let yOffset = 0;

  // Sort commits by parent relationship (topological sort simplified)
  const sortedCommits = [...data.commits].reverse();

  sortedCommits.forEach((commit) => {
    const position = { x: 100, y: yOffset };
    commitPositions.set(commit.id, position);

    nodes.push({
      id: commit.id,
      type: 'commit',
      position,
      data: {
        hash: commit.hash,
        message: commit.message,
        author: commit.author,
      },
    });

    // Create edges to parents
    commit.parentIds.forEach((parentId, parentIndex) => {
      edges.push({
        id: `${commit.id}-${parentId}`,
        source: commit.id,
        target: parentId,
        style: {
          ...CONFIG.edgeStyle,
          stroke: parentIndex > 0 ? '#5856D6' : '#007AFF', // Different color for merge parents
        },
        animated: parentIndex > 0, // Animate merge edges
      });
    });

    yOffset += CONFIG.nodeSpacing.y;
  });

  // Create branch nodes
  data.branches.forEach((branch) => {
    const commitPos = commitPositions.get(branch.headCommitId) || { x: 0, y: 0 };

    nodes.push({
      id: `branch-${branch.name}`,
      type: 'branch',
      position: {
        x: commitPos.x + CONFIG.nodeSpacing.x,
        y: commitPos.y,
      },
      data: {
        name: branch.name,
        isCurrent: branch.isCurrent,
      },
    });

    // Connect branch to commit
    edges.push({
      id: `branch-${branch.name}-edge`,
      source: `branch-${branch.name}`,
      target: branch.headCommitId,
      style: {
        stroke: branch.isCurrent ? '#34C759' : '#8E8E93',
        strokeWidth: 2,
        strokeDasharray: '5,5',
      },
    });
  });

  return { nodes, edges };
}

export function GitFlowGraph({
  data,
  title,
  height = 400,
  onNodeClick,
}: GitFlowGraphProps) {
  const theme = useTheme();

  // Create initial elements
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => createFlowElements(data),
    [data]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (onNodeClick) {
        const type = node.type === 'branch' ? 'branch' : 'commit';
        onNodeClick(node.id, type);
      }
    },
    [onNodeClick]
  );

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      {title && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            {title}
          </Typography>
        </Box>
      )}

      {/* Graph */}
      <Box sx={{ height }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          defaultViewport={CONFIG.defaultViewport}
          fitView
          attributionPosition="bottom-left"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1}
            color={theme.palette.divider}
          />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'branch') return '#34C759';
              return '#007AFF';
            }}
            maskColor={alpha(theme.palette.background.default, 0.8)}
          />
        </ReactFlow>
      </Box>
    </Paper>
  );
}
