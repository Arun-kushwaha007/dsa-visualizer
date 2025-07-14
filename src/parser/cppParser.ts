// src/parser/cppParser.ts

export type CodeStep =
  | { type: "line"; line: string }
  | { type: "declaration"; name: string; varType: string; value?: string }
  | { type: "assignment"; name: string; value: string }
  | { type: "methodCall"; object: string; method: string; args: any }
  | { type: "forLoop"; init: string; condition: string; increment: string; body: CodeStep[] }
  | { type: "forOfLoop"; variable: string; iterable: string; body: CodeStep[] }
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
      const forMatch = line.match(/for\s*\((.*)\)/);
      if (forMatch) {
        const content = forMatch[1];
        if (content.includes(":")) {
          const [variable, iterable] = content.split(":").map((s) => s.trim());
          const body: string[] = [];
          i++;
          while (i < lines.length && !lines[i].startsWith("}")) {
            body.push(lines[i]);
            i++;
          }
          const bodySteps = parseCppCode(body.join("\n"));
          steps.push({
            type: "forOfLoop",
            variable,
            iterable,
            body: bodySteps,
          });
        } else {
          const [init, condition, increment] = content.split(";").map((s) => s.trim());
          const body: string[] = [];
          i++;
          while (i < lines.length && !lines[i].startsWith("}")) {
            body.push(lines[i]);
            i++;
          }
          const bodySteps = parseCppCode(body.join("\n"));
          steps.push({
            type: "forLoop",
            init,
            condition,
            increment,
            body: bodySteps,
          });
        }
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

    // Declaration of various types
    const declarationMatch = line.match(
      /(int|string|char|bool|double|vector<.*>|list<.*>|queue<.*>|stack<.*>|unordered_set<.*>)\s+([a-zA-Z0-9_]+)\s*(?:=\s*(.*))?;?/
    );
    if (declarationMatch) {
      const [_, varType, name, value] = declarationMatch;
      steps.push({
        type: "declaration",
        varType: varType.trim(),
        name: name.trim(),
        value: value ? value.trim() : undefined,
      });
      i++;
      continue;
    }

    // Method call
    const methodCallMatch = line.match(/([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\((.*)\);?/);
    if (methodCallMatch) {
      const [_, object, method, args] = methodCallMatch;
      steps.push({
        type: "methodCall",
        object: object.trim(),
        method: method.trim(),
        args: args.trim(),
      });
      i++;
      continue;
    }

    // Assignment
    const assignmentMatch = line.match(/([a-zA-Z0-9_]+)\s*=\s*(.*);?/);
    if (assignmentMatch) {
      const [_, name, value] = assignmentMatch;
      steps.push({
        type: "assignment",
        name: name.trim(),
        value: value.trim(),
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
