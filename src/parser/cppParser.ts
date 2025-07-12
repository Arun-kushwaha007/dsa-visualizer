// src/parser/cppParser.ts

export type CodeStep =
  | { type: "line"; line: string }
  | { type: "declaration"; name: string; varType: string }
  | { type: "assignment"; name: string; value: string }
  | { type: "methodCall"; object: string; method: string; args: any }
  | { type: "forLoop"; init: string; condition: string; increment: string; body: CodeStep[] }
  | { type: "whileLoop"; condition: string; body: CodeStep[] }
  | { type: "ifBlock"; condition: string; body: CodeStep[]; elseBody?: CodeStep[] };

export function parseCppCode(code: string): CodeStep[] {
  const lines = code.split("\n").map((l) => l.trim());
  const steps: CodeStep[] = [];

  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line || line.startsWith("//")) {
      i++;
      continue;
    }

    // For-loop
    if (line.startsWith("for")) {
      const forMatch = line.match(/for\s*\((.*?);(.*?);(.*?)\)/);
      if (forMatch) {
        const [_, init, condition, increment] = forMatch;
        const body: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("}")) {
          body.push(lines[i]);
          i++;
        }
        const bodySteps = parseCppCode(body.join("\n"));
        steps.push({
          type: "forLoop",
          init: init.trim(),
          condition: condition.trim(),
          increment: increment.trim(),
          body: bodySteps,
        });
      }
      i++;
      continue;
    }

    // While-loop
    if (line.startsWith("while")) {
      const cond = line.match(/while\s*\((.*?)\)/)?.[1];
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("}")) {
        body.push(lines[i]);
        i++;
      }
      steps.push({
        type: "whileLoop",
        condition: cond?.trim() || "",
        body: parseCppCode(body.join("\n")),
      });
      i++;
      continue;
    }

    // If/else
    if (line.startsWith("if")) {
      const cond = line.match(/if\s*\((.*?)\)/)?.[1];
      const ifBody: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("}")) {
        ifBody.push(lines[i]);
        i++;
      }
      i++;
      let elseBody: CodeStep[] | undefined = undefined;
      if (i < lines.length && lines[i].startsWith("else")) {
        i++;
        const elseLines: string[] = [];
        while (i < lines.length && !lines[i].startsWith("}")) {
          elseLines.push(lines[i]);
          i++;
        }
        elseBody = parseCppCode(elseLines.join("\n"));
        i++;
      }
      steps.push({
        type: "ifBlock",
        condition: cond?.trim() || "",
        body: parseCppCode(ifBody.join("\n")),
        elseBody,
      });
      continue;
    }

    // Queue declaration
    if (line.startsWith("queue")) {
      const name = line.match(/queue.*? (\w+)/)?.[1];
      steps.push({
        type: "declaration",
        varType: "queue",
        name: name || "",
      });
      i++;
      continue;
    }

    // Method call
    if (line.includes(".push")) {
      const [object] = line.split(".");
      const args = line.match(/\((.*)\)/)?.[1];
      steps.push({
        type: "methodCall",
        object,
        method: "push",
        args,
      });
      i++;
      continue;
    }

    if (line.includes(".pop")) {
      const [object] = line.split(".");
      steps.push({
        type: "methodCall",
        object,
        method: "pop",
        args: [],
      });
      i++;
      continue;
    }

    // Assignment
    if (line.includes("=")) {
      const [left, right] = line.split("=");
      const name = left.split(" ").pop()?.trim() || "";
      steps.push({
        type: "assignment",
        name,
        value: right.replace(/;/, "").trim(),
      });
      i++;
      continue;
    }

    // Fallback
    steps.push({
      type: "line",
      line,
    });
    i++;
  }

  return steps;
}
