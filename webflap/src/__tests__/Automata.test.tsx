import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });
import { simulateAutomaton } from '../Automata';
import { Automaton } from '../Automata';

describe('Test Automata Parser', () => {
  let automaton: Automaton;

  beforeEach(() => {
    automaton = new Automaton();
    automaton.addState(0, 0, true);
    automaton.addState(100, 0);
    automaton.addState(200, 0);
    automaton.setFinalState('q2');
    automaton.addTransition('q0', 'q0', 'a');
    automaton.addTransition('q0', 'q1', 'b');
    automaton.addTransition('q1', 'q2', 'a');
    automaton.addTransition('q1', 'q1', 'b');
    automaton.addTransition('q2', 'q0', 'a');
    automaton.addTransition('q2', 'q1', 'b');
  });
  test('accepts string ending in ba', () => {
    expect(simulateAutomaton(automaton, 'ba')).toBe(true);
    expect(simulateAutomaton(automaton, 'aba')).toBe(true);
  });
  test('rejects string not ending in ba', () => {
    expect(simulateAutomaton(automaton, 'b')).toBe(false);
    expect(simulateAutomaton(automaton, 'ab')).toBe(false);
  });
  test('Rejects string with invalid characters', () => {
    expect(simulateAutomaton(automaton, 'cccc')).toBe(false);
    expect(simulateAutomaton(automaton, 'aabx')).toBe(false);
  });
});