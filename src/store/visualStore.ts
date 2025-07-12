import { create } from "zustand";
import type { CodeStep } from "../parser/cppParser";

type StackFrame = {
  steps: CodeStep[];
  index: number;
  context?: LoopContext;
};

type LoopContext = {
  type: "for" | "while";
  condition: string;
  increment: CodeStep | null;
  initExecuted: boolean;
  step: CodeStep;
};

export interface VisualStore {
  stack: StackFrame[];
  variables: Record<string, string>;
  queueValues: Record<string, string[]>;

  setSteps: (steps: CodeStep[]) => void;
  nextStep: () => void;
  currentIndices: () => number[];
}

export const useVisualStore = create<VisualStore>((set, get) => ({
  stack: [],
  variables: {},
  queueValues: {},

  setSteps: (steps) => {
    set({
      stack: [{ steps, index: 0 }],
      variables: {},
      queueValues: {},
    });
  },

  nextStep: () => {
    const { stack, variables, queueValues } = get();
    if (stack.length === 0) return;

    const currentFrame = stack[stack.length - 1];
    const currentStep = currentFrame.steps[currentFrame.index];

    if (!currentStep) {
      // End of current frame
      set({ stack: stack.slice(0, -1) });
      return;
    }

    console.log("Running step:", currentStep);

    if (currentStep.type === "declaration") {
      if (currentStep.varType === "queue") {
        set({
          queueValues: {
            ...queueValues,
            [currentStep.name]: [],
          },
        });
      } else {
        set({
          variables: {
            ...variables,
            [currentStep.name]: "0",
          },
        });
      }
      currentFrame.index += 1;
      set({ stack });
      return;
    }

    if (currentStep.type === "assignment") {
      set({
        variables: {
          ...variables,
          [currentStep.name]: currentStep.value,
        },
      });
      currentFrame.index += 1;
      set({ stack });
      return;
    }

    if (currentStep.type === "methodCall") {
      const { object, method, args } = currentStep;
      if (method === "push") {
        set({
          queueValues: {
            ...queueValues,
            [object]: [...(queueValues[object] || []), args],
          },
        });
      }
      if (method === "pop") {
        set({
          queueValues: {
            ...queueValues,
            [object]: (queueValues[object] || []).slice(1),
          },
        });
      }
      currentFrame.index += 1;
      set({ stack });
      return;
    }

    if (currentStep.type === "forLoop") {
      const loopContext: LoopContext = {
        type: "for",
        condition: currentStep.condition,
        increment: currentStep.increment
          ? { type: "line", line: currentStep.increment }
          : null,
        initExecuted: false,
        step: currentStep,
      };

      stack.push({
        steps: [],
        index: 0,
        context: loopContext,
      });
      set({ stack });
      return;
    }

    if (currentStep.type === "whileLoop") {
      const loopContext: LoopContext = {
        type: "while",
        condition: currentStep.condition,
        increment: null,
        initExecuted: true,
        step: currentStep,
      };

      stack.push({
        steps: [],
        index: 0,
        context: loopContext,
      });
      set({ stack });
      return;
    }

    if (currentStep.type === "ifBlock") {
      // naive truthy evaluation for now
      const condResult = evalExpression(currentStep.condition, variables);
      if (condResult) {
        stack.push({
          steps: currentStep.body || [],
          index: 0,
        });
      }
      currentFrame.index += 1;
      set({ stack });
      return;
    }

    if (currentStep.type === "line") {
      currentFrame.index += 1;
      set({ stack });
      return;
    }

    currentFrame.index += 1;
    set({ stack });
  },

  currentIndices: () => {
    return get().stack.map((f) => f.index);
  },
}));

function evalExpression(expr: string, vars: Record<string, string>): boolean {
  try {
    const keys = Object.keys(vars);
    const values = keys.map((k) => Number(vars[k]) || 0);
    const fn = new Function(...keys, `return ${expr};`);
    return !!fn(...values);
  } catch (e) {
    return false;
  }
}
