export type DSAItem =
  | {
      type: 'variable';
      name: string;
      value: string;
      varType: string;
    }
  | {
      type: 'array';
      name: string;
      values: string[];
    }
  | {
          type: 'queue';
          name: string;
          values: string[];
        }
      | {
          type: 'linkedlist';
          name: string;
          values: string[];
        }
          | {
              type: 'tree';
              name: string;
              root?: TreeNode;
            }
        
      | {
          type: 'graph';
          name: string;
          nodes: GraphNode[];
        }
    
    
  | {
      type: 'stack';
      name: string;
      values: string[];
    };


    export type TreeNode = {
      value: string;
      left?: TreeNode;
      right?: TreeNode;
    };
    export type GraphNode = {
      id: string;
      connections: string[];
    };
    
    function insertIntoBST(node: TreeNode | undefined, value: string): TreeNode {
      if (!node) return { value };
      if (parseInt(value) < parseInt(node.value)) {
        node.left = insertIntoBST(node.left, value);
      } else {
        node.right = insertIntoBST(node.right, value);
      }
      return node;
    }
    

export function parseDSA(input: string): DSAItem[] {
  const lines = input
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '');

  const items: DSAItem[] = [];

  const stacks: Record<string, string[]> = {};
  const queues: Record<string, string[]> = {};
  const lists: Record<string, string[]> = {};
    const trees: Record<string, TreeNode | undefined> = {};
    const graphs: Record<string, Record<string, GraphNode>> = {};
  



  for (const line of lines) {
    // Match variable:
    let match = line.match(/^var\s+(\w+)\s*=\s*(.+)$/);
    if (match) {
      items.push({
        type: 'variable',
        name: match[1],
        value: match[2],
        varType: 'int',
      });
      continue;
    }

    // Match array:
    match = line.match(/^array\s+(\w+)\s*=\s*\[(.+)\]$/);
    if (match) {
      const name = match[1];
      const values = match[2].split(',').map((v) => v.trim());
      items.push({
        type: 'array',
        name,
        values,
      });
      continue;
    }

    // Match stack creation:
    match = line.match(/^stack\s+(\w+)\s*=\s*empty$/);
    if (match) {
      const name = match[1];
      stacks[name] = [];
      items.push({
        type: 'stack',
        name,
        values: [],
      });
      continue;
    }

    // Match push:
    match = line.match(/^push\s+(\w+)\s*=\s*(.+)$/);
    if (match) {
      const name = match[1];
      const value = match[2];
      if (!stacks[name]) stacks[name] = [];
      stacks[name].push(value);
      const existing = items.find(
        (it) => it.type === 'stack' && it.name === name
      );
      if (existing) {
        (existing as any).values = [...stacks[name]];
      } else {
        items.push({
          type: 'stack',
          name,
          values: [...stacks[name]],
        });
      }
      continue;
    }

    // Match pop:
    match = line.match(/^pop\s+(\w+)$/);
    if (match) {
      const name = match[1];
      if (stacks[name]) {
        stacks[name].pop();
        const existing = items.find(
          (it) => it.type === 'stack' && it.name === name
        );
        if (existing) {
          (existing as any).values = [...stacks[name]];
        }
      }
      continue;
    }
        // Queue declaration
        match = line.match(/^queue\s+(\w+)\s*=\s*empty$/);
        if (match) {
          const name = match[1];
          queues[name] = [];
          items.push({
            type: 'queue',
            name,
            values: [],
          });
          continue;
        }
    
        // enqueue
        match = line.match(/^enqueue\s+(\w+)\s*=\s*(.+)$/);
        if (match) {
          const name = match[1];
          const value = match[2];
          if (!queues[name]) queues[name] = [];
          queues[name].push(value);
          const existing = items.find(
            (it) => it.type === 'queue' && it.name === name
          );
          if (existing) {
            (existing as any).values = [...queues[name]];
          } else {
            items.push({
              type: 'queue',
              name,
              values: [...queues[name]],
            });
          }
          continue;
        }
    
        // dequeue
        match = line.match(/^dequeue\s+(\w+)$/);
        if (match) {
          const name = match[1];
          if (queues[name]) {
            queues[name].shift();
            const existing = items.find(
              (it) => it.type === 'queue' && it.name === name
            );
            if (existing) {
              (existing as any).values = [...queues[name]];
            }
          }
          continue;
        }
            // Linked list declaration
            match = line.match(/^list\s+(\w+)\s*=\s*empty$/);
            if (match) {
              const name = match[1];
              lists[name] = [];
              items.push({
                type: 'linkedlist',
                name,
                values: [],
              });
              continue;
            }
        
            // Append to linked list
            match = line.match(/^append\s+(\w+)\s*=\s*(.+)$/);
            if (match) {
              const name = match[1];
              const value = match[2];
              if (!lists[name]) lists[name] = [];
              lists[name].push(value);
              const existing = items.find(
                (it) => it.type === 'linkedlist' && it.name === name
              );
              if (existing) {
                (existing as any).values = [...lists[name]];
              } else {
                items.push({
                  type: 'linkedlist',
                  name,
                  values: [...lists[name]],
                });
              }
              continue;
            }
                // tree declaration
                match = line.match(/^tree\s+(\w+)\s*=\s*empty$/);
                if (match) {
                  const name = match[1];
                  trees[name] = undefined;
                  items.push({
                    type: 'tree',
                    name,
                    root: undefined,
                  });
                  continue;
                }
            
                // insert into tree
                match = line.match(/^insert\s+(\w+)\s*=\s*(.+)$/);
                if (match) {
                  const name = match[1];
                  const value = match[2];
                  if (!(name in trees)) trees[name] = undefined;
                  trees[name] = insertIntoBST(trees[name], value);
                  const existing = items.find(
                    (it) => it.type === 'tree' && it.name === name
                  );
                  if (existing) {
                    (existing as any).root = trees[name];
                  } else {
                    items.push({
                      type: 'tree',
                      name,
                      root: trees[name],
                    });
                  }
                  continue;
                }
                match = line.match(/^graph\s+(\w+)\s*=\s*empty$/);
                if (match) {
                  const name = match[1];
                  graphs[name] = {};
                  items.push({
                    type: 'graph',
                    name,
                    nodes: [],
                  });
                  continue;
                }
            
            match = line.match(/^node\s+(\w+)\s*=\s*(.+)$/);
            if (match) {
              const name = match[1];
              const nodeId = match[2];
              if (!graphs[name]) graphs[name] = {};
              graphs[name][nodeId] = { id: nodeId, connections: [] };
              const graphNodes = Object.values(graphs[name]);
              const existing = items.find(
                (it) => it.type === 'graph' && it.name === name
              );
              if (existing) {
                (existing as any).nodes = graphNodes;
              } else {
                items.push({
                  type: 'graph',
                  name,
                  nodes: graphNodes,
                });
              }
              continue;
            }
            match = line.match(/^edge\s+(\w+)\s*=\s*(\w+)\s*->\s*(\w+)$/);
            if (match) {
              const name = match[1];
              const from = match[2];
              const to = match[3];
              if (!graphs[name]) graphs[name] = {};
              if (!graphs[name][from]) graphs[name][from] = { id: from, connections: [] };
              if (!graphs[name][to]) graphs[name][to] = { id: to, connections: [] };
              graphs[name][from].connections.push(to);
              const graphNodes = Object.values(graphs[name]);
              const existing = items.find(
                (it) => it.type === 'graph' && it.name === name
              );
              if (existing) {
                (existing as any).nodes = graphNodes;
              } else {
                items.push({
                  type: 'graph',
                  name,
                  nodes: graphNodes,
                });
              }
              continue;
            }
        
    
  }

  return items;
}
