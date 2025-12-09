import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextEncoder, TextDecoder });

import { TransitionHelper } from "../Automata";

describe("TransitionHelper Tests", () => {
  // Method 1: groupTransitions()
  test("Transition grouping should be properly formatted", () => {
    const transitions = [{ from: "q0", label: "a", to: "q1" }];
    const helper = new TransitionHelper();
    const groupedTransitions = helper.groupTransitions(transitions);

    expect(groupedTransitions.size).toBe(1);
    expect(groupedTransitions.has("q0->q1")).toBe(true);
    expect(groupedTransitions.get("q0->q1")!).toContain("a");
  });

  test("Multiple transitions should be grouped properly", () => {
    const transitions = [
      { from: "q0", label: "a", to: "q1" },
      { from: "q1", label: "b", to: "q2" },
    ];
    const helper = new TransitionHelper();
    const groupedTransitions = helper.groupTransitions(transitions);

    expect(groupedTransitions.size).toBe(2);
    expect(groupedTransitions.has("q0->q1")).toBe(true);
    expect(groupedTransitions.has("q1->q2")).toBe(true);
    expect(groupedTransitions.get("q0->q1")!).toContain("a");
    expect(groupedTransitions.get("q1->q2")!).toContain("b");
  });

  // Method 2: findStateById()
  test("Correct state should be found", () => {
    const states = [{ id: "q0", x: 0, y: 0 }];
    const helper = new TransitionHelper();
    const state = helper.findStateById(states, "q0");

    expect(state).not.toBeNull;
    expect(state?.id).toBe("q0");
    expect(state?.x).toBe(0);
    expect(state?.y).toBe(0);
  });

  test("Invalid state should not be found", () => {
    const states = [{ id: "q0", x: 0, y: 0 }];
    const helper = new TransitionHelper();
    const state = helper.findStateById(states, "q1");

    expect(state).toBeNull;
  });

  // Method 3: parseTransitionKey()
  test("Transition key should be correctly parsed", () => {
    const helper = new TransitionHelper();
    const { from: fromId, to: toId } = helper.parseTransitionKey("q0->q1");

    expect(fromId).toBe("q0");
    expect(toId).toBe("q1");
  });

  // Method 4: isSelfLoop()
  test("Transition with loop should be caught", () => {
    const helper = new TransitionHelper();
    const isLoop = helper.isSelfLoop("q0", "q0");

    expect(isLoop).toBe(true);
  });

  test("Transition without loop should not be caught", () => {
    const helper = new TransitionHelper();
    const isLoop = helper.isSelfLoop("q0", "q1");

    expect(isLoop).toBe(false);
  });
});
