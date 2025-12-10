// Fix for TextEncoder error
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

import { Production, ConcreteGrammar, Grammar } from '../Grammars';

// Tests for Grammar class methods (using ConcreteGrammar since Grammar is abstract, all tests are testing methods defined in the Grammar class itself)

// addProduction() test
describe('Grammar class - addProduction()', () => {
  
  test('should add a valid production to the grammar', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'a'));
    expect(grammar.getProductions().length).toBe(1);
  });

  test('should not add duplicate productions', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'a'));
    grammar.addProduction(new Production('S', 'a'));
    expect(grammar.getProductions().length).toBe(1);
  });

  test('should auto-track variables when adding production', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'aA'));
    expect(grammar.isVariable('S')).toBe(true);
    expect(grammar.isVariable('A')).toBe(true);
  });

  test('should auto-track terminals when adding production', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'ab'));
    expect(grammar.isTerminal('a')).toBe(true);
    expect(grammar.isTerminal('b')).toBe(true);
  });

});


// removeProduction() test
describe('Grammar class - removeProduction()', () => {

  test('should remove an existing production', () => {
    const grammar: Grammar = new ConcreteGrammar();
    const p = new Production('S', 'a');
    grammar.addProduction(p);
    grammar.removeProduction(p);
    expect(grammar.getProductions().length).toBe(0);
  });

  test('should clean up unused variables after removal', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'A'));
    grammar.removeProduction(new Production('S', 'A'));
    expect(grammar.isVariable('A')).toBe(false);
  });

  test('should clean up unused terminals after removal', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'a'));
    grammar.removeProduction(new Production('S', 'a'));
    expect(grammar.isTerminal('a')).toBe(false);
  });

  test('should keep variables still used in other productions', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'aA'));
    grammar.addProduction(new Production('A', 'b'));
    grammar.removeProduction(new Production('S', 'aA'));
    expect(grammar.isVariable('A')).toBe(true);
  });

});


// getProductionsFor() test
describe('Grammar class - getProductionsFor()', () => {

  test('should return productions matching the given LHS variable', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'a'));
    grammar.addProduction(new Production('A', 'b'));
    const prods = grammar.getProductionsFor('S');
    expect(prods.length).toBe(1);
    expect(prods[0].rhs).toBe('a');
  });

  test('should return multiple productions for same LHS', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'a'));
    grammar.addProduction(new Production('S', 'b'));
    grammar.addProduction(new Production('S', 'c'));
    expect(grammar.getProductionsFor('S').length).toBe(3);
  });

  test('should return empty array when no productions match', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'a'));
    expect(grammar.getProductionsFor('X').length).toBe(0);
  });

  test('should only match LHS, not RHS', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.addProduction(new Production('S', 'aA'));
    grammar.addProduction(new Production('A', 'b'));
    const prods = grammar.getProductionsFor('A');
    expect(prods.length).toBe(1);
    expect(prods[0].lhs).toBe('A');
  });

});


// toJSON() and fromJSON() test -> this is technically 5 methods that we are testing, not just 4, but these kind of go hand-in-hand so I'm combining them
describe('Grammar class - toJSON() and fromJSON()', () => {

  test('toJSON() should serialize grammar with start variable and productions', () => {
    const grammar: Grammar = new ConcreteGrammar();
    grammar.setStartVariable('S');
    grammar.addProduction(new Production('S', 'aA'));
    const json = grammar.toJSON();
    expect(json.startVariable).toBe('S');
    expect(json.productions.length).toBe(1);
    expect(json.productions[0].lhs).toBe('S');
    expect(json.productions[0].rhs).toBe('aA');
  });

  test('fromJSON() should restore grammar from serialized data', () => {
    const data = {
      startVariable: 'S',
      productions: [{ lhs: 'S', rhs: 'a' }, { lhs: 'S', rhs: 'b' }]
    };
    const grammar = Grammar.fromJSON(data, ConcreteGrammar);
    expect(grammar.getStartVariable()).toBe('S');
    expect(grammar.getProductions().length).toBe(2);
  });

  test('round-trip serialization should preserve grammar state', () => {
    const original: Grammar = new ConcreteGrammar();
    original.setStartVariable('S');
    original.addProduction(new Production('S', 'aA'));
    original.addProduction(new Production('A', 'b'));
    
    const json = original.toJSON();
    const restored = Grammar.fromJSON(json, ConcreteGrammar);
    
    expect(restored.getStartVariable()).toBe('S');
    expect(restored.getProductions().length).toBe(2);
  });

  test('fromJSON() should use default start variable when not provided', () => {
    const data = {
      startVariable: '',
      productions: [{ lhs: 'S', rhs: 'a' }]
    };
    const grammar = Grammar.fromJSON(data, ConcreteGrammar);
    expect(grammar.getStartVariable()).toBe('S');
  });

});
