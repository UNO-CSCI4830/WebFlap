// Had to add this to fix a "TextEncoder" error
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

import { Production, ConcreteGrammar } from '../Grammars';

describe('Grammar Tests', () => {
  // Test 1: Check variables
  test('Production should find variables', () => {
    const p = new Production('S', 'aA');
    const vars = p.getVariables();
    expect(vars).toContain('S');
    expect(vars).toContain('A');
  });

  // Test 2: Check terminals
  test('Production should find terminals', () => {
    const p = new Production('S', 'a1');
    const terms = p.getTerminals();
    expect(terms).toContain('a');
    expect(terms).toContain('1');
  });

  // Test 3: Check equality
  test('Productions should be equal', () => {
    const p1 = new Production('S', 'a');
    const p2 = new Production('S', 'a');
    expect(p1.equal(p2)).toBe(true);
  });

  // Test 4: Add production to grammar
  test('Grammar should add production', () => {
    const g = new ConcreteGrammar();
    g.addProduction(new Production('S', 'a'));
    expect(g.getProductions().length).toBe(1);
  });
});
