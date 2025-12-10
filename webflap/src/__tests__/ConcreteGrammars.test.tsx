jest.mock('../NavigationBar', () => ({})); // mock NavigationBar component 
jest.mock('react-router-dom', () => ({ Link: () => null, useLocation: () => ({ pathname: '/' }), }));

import { ConcreteGrammar, Production } from "../Grammars";
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });

// checkProduction() test
describe("ConcreteGrammar - checkProduction()", () => {
    test("valid production does not throw", () => {
        const grammar = new ConcreteGrammar();
        expect(() => grammar.checkProduction(new Production("S", "a"))).not.toThrow();
        });

        test("empty LHS throws error", () => {
        const grammar = new ConcreteGrammar();
        expect(() => grammar.checkProduction(new Production("", "a"))).toThrow();
    });
});

// findDuplicateProductions() test
describe("ConcreteGrammar - findDuplicateProductions()", () => {
    test("detects duplicate productions", () => {
        const grammar = new ConcreteGrammar();
        const p1 = new Production("S", "a");
        const p2 = new Production("S", "a");
        grammar.productions.push(p1, p2);
        const duplicates = grammar.findDuplicateProductions();
        expect(duplicates.length).toBe(1);
        expect(duplicates[0][0].equal(p1)).toBe(true);
        expect(duplicates[0][1].equal(p2)).toBe(true);
    });

    test("returns empty list when no duplicates exist", () => {
        const grammar = new ConcreteGrammar();
        grammar.addProduction(new Production("S", "a"));
        grammar.addProduction(new Production("A", "b"));
        expect(grammar.findDuplicateProductions().length).toBe(0);
    });
});

// isVariableReachable() test
describe("ConcreteGrammar - isVariableReachable()", () => {
    test("reachable variable returns true", () => {
        const grammar = new ConcreteGrammar();
        grammar.setStartVariable("S");
        grammar.addProduction(new Production("S", "A"));
        grammar.addProduction(new Production("A", "a"));
        expect(grammar.isVariableReachable("A")).toBe(true);
    });

    test("unreachable variable returns false", () => {
        const grammar = new ConcreteGrammar();
        grammar.setStartVariable("S");
        grammar.addProduction(new Production("S", "a"));
        grammar.addProduction(new Production("B", "b"));
        expect(grammar.isVariableReachable("B")).toBe(false);
    });
});

// getUnreachableVariables() test
describe.only("ConcreteGrammar - getUnreachableVariables()", () => {
    test("returns unreachable variables", () => {
        const grammar = new ConcreteGrammar();
        grammar.setStartVariable("S");
        grammar.addProduction(new Production("S", "a"));
        grammar.addProduction(new Production("B", "b"));
        const unreachable = grammar.getUnreachableVariables();
        expect(unreachable).toContain("B");
    });

    test("returns empty array when all variables are reachable", () => {
        const grammar = new ConcreteGrammar();
        grammar.setStartVariable("S");
        grammar.addProduction(new Production("S", "A"));
        grammar.addProduction(new Production("A", "a"));
        const unreachable = grammar.getUnreachableVariables();
        expect(unreachable).toEqual([]);
    });
});
