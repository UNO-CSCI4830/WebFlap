// Prevent loading React components to avoid DOM/TextEncoder issues
jest.mock("../NavigationBar", () => () => null);
jest.mock("react-router-dom", () => ({
  Link: () => null,
  useLocation: () => ({ pathname: "/" }),
}));

import { Automaton } from "../Automata";

describe("Automaton Class Unit Tests", () => {

  test("addState correctly adds a new state with proper id and coordinates", () => {
    const a = new Automaton();
    a.addState(100, 200);

    expect(a.states.length).toBe(1);
    expect(a.states[0]).toEqual({
      id: "q0",
      x: 100,
      y: 200
    });

    a.addState(50, 75);
    expect(a.states[1]).toEqual({
      id: "q1",
      x: 50,
      y: 75
    });
  });

  test("addTransition correctly stores transitions with from/to/label", () => {
    const a = new Automaton();

    a.addState(0, 0);
    a.addState(10, 10);

    a.addTransition("q0", "q1", "a");

    expect(a.transitions.length).toBe(1);
    expect(a.transitions[0]).toEqual({
      from: "q0",
      to: "q1",
      label: "a"
    });
  });

  test("getStateAt returns state when within radius 30", () => {
    const a = new Automaton();
    a.addState(100, 100);

    const s = a.getStateAt(115, 115);

    expect(s).not.toBeNull();
    expect(s?.id).toBe("q0");
  });

  test("getStateAt returns null when no state is within radius", () => {
    const a = new Automaton();
    a.addState(100, 100);

    const s = a.getStateAt(500, 500);

    expect(s).toBeNull();
  });

  // ⭐ NEW: Testing getTransitionKey instead of clone
  test("getTransitionKey returns correct formatted key", () => {
    const a = new Automaton();

    const key1 = a.getTransitionKey("q0", "q1");
    const key2 = a.getTransitionKey("start", "end");

    expect(key1).toBe("q0->q1");
    expect(key2).toBe("start->end");
  });

});
