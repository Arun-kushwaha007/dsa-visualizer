// src/parser/cppParser.ts

export type CodeStep = {
  line: string;
  astNode: any;
};

export function parseCppCode(code: string): CodeStep[] {
  const lines = code
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("//"));

  const steps: CodeStep[] = [];

  for (const line of lines) {
    let astNode: any = { type: "unknown", line };

    if (line.startsWith("queue")) {
      const name = line.match(/queue.*? (\w+)/)?.[1];
      astNode = {
        type: "declaration",
        varType: "queue",
        name,
      };
    } else if (line.includes(".push")) {
      const [object] = line.split(".");
      const args = line.match(/\((.*)\)/)?.[1];
      astNode = {
        type: "methodCall",
        object,
        method: "push",
        args,
      };
    } else if (line.includes(".pop")) {
      const [object] = line.split(".");
      astNode = {
        type: "methodCall",
        object,
        method: "pop",
        args: [],
      };
    } else if (line.includes("=")) {
      const [left, right] = line.split("=");
      const name = left.split(" ").pop()?.trim() || "";
      astNode = {
        type: "assignment",
        name,
        value: right.replace(/;/, "").trim(),
      };
    }

    steps.push({
      line,
      astNode,
    });
  }

  return steps;
}
