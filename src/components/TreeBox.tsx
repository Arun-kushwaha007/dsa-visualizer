import React from 'react';

export type TreeNode = {
  value: string;
  left?: TreeNode;
  right?: TreeNode;
};

type TreeBoxProps = {
  name: string;
  root?: TreeNode;
};

export default function TreeBox({ name, root }: TreeBoxProps) {
  return (
    <div className="border rounded shadow p-4 bg-white">
      <div className="text-gray-500 text-sm mb-2">binary tree</div>
      <div className="font-bold mb-4">{name}</div>
      {root ? (
        <TreeSVG node={root} x={400} y={40} level={0} />
      ) : (
        <span>empty tree</span>
      )}
    </div>
  );
}

function TreeSVG({
  node,
  x,
  y,
  level,
}: {
  node: TreeNode;
  x: number;
  y: number;
  level: number;
}) {
  const nodeRadius = 20;
  const horizontalSpacing = 50 / (level + 1);
  const verticalSpacing = 50;

  const leftX = x - horizontalSpacing * 3;
  const rightX = x + horizontalSpacing * 3;
  const childY = y + verticalSpacing;

  return (
    <svg width="800" height="500" className="mx-auto">
      {/* Draw node */}
      <circle cx={x} cy={y} r={nodeRadius} fill="#fbcfe8" stroke="#000" />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize="12"
        fill="#000"
        fontWeight="bold"
      >
        {node.value}
      </text>

      {/* Left child */}
      {node.left && (
        <>
          <line
            x1={x}
            y1={y + nodeRadius}
            x2={leftX}
            y2={childY - nodeRadius}
            stroke="#000"
          />
          <TreeSVG node={node.left} x={leftX} y={childY} level={level + 1} />
        </>
      )}

      {/* Right child */}
      {node.right && (
        <>
          <line
            x1={x}
            y1={y + nodeRadius}
            x2={rightX}
            y2={childY - nodeRadius}
            stroke="#000"
          />
          <TreeSVG node={node.right} x={rightX} y={childY} level={level + 1} />
        </>
      )}
    </svg>
  );
}
