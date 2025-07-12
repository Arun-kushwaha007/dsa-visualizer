import { create } from "zustand";
import  type { CodeStep } from "../parser/cppParser";

export interface VisualStore {
  steps: CodeStep[];
  currentStep: number;
  queueValues: Record<string, string[]>;
  variables: Record<string, string>;

  setSteps: (steps: CodeStep[]) => void;
  nextStep: () => void;
}

export const useVisualStore = create<VisualStore>((set, get) => ({
  steps: [],
  currentStep: 0,
  queueValues: {},
  variables: {},

  setSteps: (steps) => set({ steps, currentStep: 0, queueValues: {}, variables: {} }),

  nextStep: () => {
    const { steps, currentStep, queueValues, variables } = get();
    if (currentStep >= steps.length) return;

    const step = steps[currentStep];
    console.log("Executing Step:", step);

    if (step.astNode.type === "declaration" && step.astNode.varType === "queue") {
      set({
        queueValues: {
          ...queueValues,
          [step.astNode.name]: [],
        },
      });
    } else if (step.astNode.type === "methodCall") {
      const { object, method, args } = step.astNode;
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
    } else if (step.astNode.type === "assignment") {
      set({
        variables: {
          ...variables,
          [step.astNode.name]: step.astNode.value,
        },
      });
    }

    set({ currentStep: currentStep + 1 });
  },
}));
