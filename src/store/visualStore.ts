import { create } from "zustand";
import type { CodeStep } from "../parser/cppParser";
import { evalInContext } from "./eval";

type VisualState = {
  stack: any[];
  steps: CodeStep[];
  scopes: Record<string, { type: string; value: any }>[];
  arrayValues: Record<string, any[]>;
  stackValues: Record<string, any[]>;
  queueValues: Record<string, any[]>;
  unorderedSetValues: Record<string, any[]>;
  setSteps: (steps: CodeStep[]) => void;
  nextStep: () => void;
};

export const useVisualStore = create<VisualState>((set, get) => ({
  stack: [{ steps: [], index: 0 }],
  steps: [],
  scopes: [{}],
  arrayValues: {},
  stackValues: {},
  queueValues: {},
  unorderedSetValues: {},
  setSteps: (steps) => {
    set({
      stack: [{ steps, index: 0 }],
      scopes: [{}],
      arrayValues: {},
      stackValues: {},
      queueValues: {},
      unorderedSetValues: {},
    });
  },
  nextStep: () => {
    const { stack, scopes } = get();
    const currentFrame = stack[stack.length - 1];

    if (!currentFrame) return;

    // Handle loop context
    if (currentFrame.context) {
      const { context } = currentFrame;
      if (context.type === "forLoop") {
        if (!context.initExecuted) {
          set((s) => ({ scopes: [...s.scopes, {}] }));
          evalInContext(context.init, get().scopes, useVisualStore);
          context.initExecuted = true;
        }

        const conditionResult = evalInContext(context.condition, get().scopes, useVisualStore);
        if (conditionResult) {
          if (currentFrame.index >= currentFrame.steps.length) {
            currentFrame.index = 0;
            evalInContext(context.increment, get().scopes, useVisualStore);
          }
        } else {
          set((s) => ({ stack: s.stack.slice(0, -1), scopes: s.scopes.slice(0, -1) }));
          return;
        }
      } else if (context.type === "forOfLoop") {
        if (context.iterator < context.iterable.length) {
          if (currentFrame.index === 0) {
            set((s) => ({ scopes: [...s.scopes, {}] }));
            const scope = get().scopes[get().scopes.length - 1];
            const [varType, varName] = context.variable.split(" ");
            scope[varName] = { type: varType, value: context.iterable[context.iterator] };
          }

          if (currentFrame.index >= currentFrame.steps.length) {
            currentFrame.index = 0;
            context.iterator++;
            set((s) => ({ scopes: s.scopes.slice(0, -1) }));
          }
        } else {
          set((s) => ({ stack: s.stack.slice(0, -1) }));
          return;
        }
      } else if (context.type === "whileLoop") {
        const conditionResult = evalInContext(context.condition, get().scopes, useVisualStore);
        if (conditionResult) {
          if (currentFrame.index >= currentFrame.steps.length) {
            currentFrame.index = 0;
          }
        } else {
          set((s) => ({ stack: s.stack.slice(0, -1), scopes: s.scopes.slice(0, -1) }));
          return;
        }
      }
    }

    if (currentFrame.index >= currentFrame.steps.length) {
      if (stack.length > 1) {
        set({ stack: stack.slice(0, -1) });
      }
      return;
    }

    const step = currentFrame.steps[currentFrame.index];

    switch (step.type) {
      case "declaration":
        const { varType, name, value } = step;
        const currentScope = scopes[scopes.length - 1];
        if (varType.startsWith("vector")) {
          set((s) => ({
            arrayValues: { ...s.arrayValues, [name]: [] },
          }));
        } else if (varType.startsWith("stack")) {
          set((s) => ({
            stackValues: { ...s.stackValues, [name]: [] },
          }));
        } else if (varType.startsWith("queue")) {
          set((s) => ({
            queueValues: { ...s.queueValues, [name]: [] },
          }));
        } else if (varType.startsWith("unordered_set")) {
          set((s) => ({
            unorderedSetValues: { ...s.unorderedSetValues, [name]: [] },
          }));
        } else {
          currentScope[name] = { type: varType, value: value !== undefined ? evalInContext(value, scopes, useVisualStore) : undefined };
          set({ scopes: [...scopes] });
        }
        break;
      case "assignment":
        const { name: varName, value: assignValue } = step;
        for (let i = scopes.length - 1; i >= 0; i--) {
          if (scopes[i][varName]) {
            scopes[i][varName].value = evalInContext(assignValue, scopes, useVisualStore);
            set({ scopes: [...scopes] });
            break;
          }
        }
        break;
      case "methodCall":
        const { object, method, args } = step;
        if (method === "push_back") {
          set((s) => ({
            arrayValues: {
              ...s.arrayValues,
              [object]: [...(s.arrayValues[object] || []), args],
            },
          }));
        } else if (method === "pop_back") {
          set((s) => ({
            arrayValues: {
              ...s.arrayValues,
              [object]: s.arrayValues[object]?.slice(0, -1),
            },
          }));
        } else if (method === "push") {
          if (get().stackValues[object]) {
            set((s) => ({
              stackValues: {
                ...s.stackValues,
                [object]: [...(s.stackValues[object] || []), args],
              },
            }));
          } else {
            set((s) => ({
              queueValues: {
                ...s.queueValues,
                [object]: [...(s.queueValues[object] || []), args],
              },
            }));
          }
        } else if (method === "pop") {
          if (get().stackValues[object]) {
            set((s) => ({
              stackValues: {
                ...s.stackValues,
                [object]: s.stackValues[object]?.slice(0, -1),
              },
            }));
          } else {
            set((s) => ({
              queueValues: {
                ...s.queueValues,
                [object]: s.queueValues[object]?.slice(1),
              },
            }));
          }
        } else if (method === "insert") {
          set((s) => ({
            unorderedSetValues: {
              ...s.unorderedSetValues,
              [object]: [...(s.unorderedSetValues[object] || []), args],
            },
          }));
        }
        break;
        case "forOfLoop":
          const { variable, iterable, body: forOfBody } = step;
          const iterableValue = get().unorderedSetValues[iterable] || get().arrayValues[iterable] || [];
          const forOfFrame = {
            steps: forOfBody,
            index: 0,
            context: {
              type: "forOfLoop",
              variable,
              iterable: iterableValue,
              iterator: 0,
            },
          };
          set({ stack: [...stack, forOfFrame] });
          return;
        case "forLoop":
          const { init, condition, increment } = step;
          const newFrame = {
            steps: step.body,
            index: 0,
            context: {
              type: "forLoop",
              init,
              condition,
              increment,
              initExecuted: false,
            },
          };
          set({ stack: [...stack, newFrame] });
          return; // Return here to avoid incrementing the index
  
        case "whileLoop":
          const whileFrame = {
            steps: step.body,
            index: 0,
            context: {
              type: "whileLoop",
              condition: step.condition,
            },
          };
          set({ stack: [...stack, whileFrame] });
          return; // Return here to avoid incrementing the index
  
        case "ifBlock":
          const ifCond = evalInContext(step.condition, get().scopes, useVisualStore);
          if (ifCond) {
            const ifFrame = {
              steps: step.body,
              index: 0,
              context: { type: "ifBlock" },
            };
            set({ stack: [...stack, ifFrame] });
          } else if (step.elseBody) {
            const elseFrame = {
              steps: step.elseBody,
              index: 0,
              context: { type: "elseBlock" },
            };
            set({ stack: [...stack, elseFrame] });
          }
          break;
      }

    currentFrame.index++;
    set({ stack: [...stack] });
  },
}));
