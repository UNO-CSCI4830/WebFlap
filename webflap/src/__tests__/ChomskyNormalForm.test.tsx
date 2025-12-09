import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

import {ChomskyNormalFormGrammar, ConcreteGrammar, Grammar, Production} from '../Grammars';

describe('Chomsky Normal Form Tests length tests', () => {
    test('Should get length of RHS', () => {
        const p = new Production('S', 'A');
        const vars = ChomskyNormalFormGrammar.getLength(p.rhs);
        expect(vars).toBe(1)
    }
);
    test('Should get length of empty RHS', () => {
        const p = new Production('S', '');
        const vars = ChomskyNormalFormGrammar.getLength(p.rhs);
        expect(vars).toBe(0)
    });
    test('Should get length of long RHS', () => {
        const p = new Production('S', 'AbbbaBaa');
        const vars = ChomskyNormalFormGrammar.getLength(p.rhs);
        expect(vars).toBe(8)
    });
});
describe('Chomsky Normal Form Tests 1 character tests', () => {
    test('Function should, if length is 1, make sure value is a single lowercase letter or single numbber 0-9', () => {
        const p = new Production('S', 'a');
        const vars = ChomskyNormalFormGrammar.checkLength1(p.rhs);
        expect(vars).toBe(true)
    });
    test('Function should reject since input is Capital', () => {
        const p = new Production('S', 'A');
        const vars = ChomskyNormalFormGrammar.checkLength1(p.rhs);
        expect(vars).toBe(false)
    });
    test('Function should reject since input is not a letter or number', () => {
        const p = new Production('S', 'Θ');
        const vars = ChomskyNormalFormGrammar.checkLength1(p.rhs);
        expect(vars).toBe(false)
    });
});
describe('Chomsky Normal Form 2 charecter tests', () => {
    test('Function should accept two Vairables (Uppercase)', () => {
        const p = new Production('S', 'AA');
        const vars = ChomskyNormalFormGrammar.checkLength2(p.rhs[0], p.rhs[1]);
        expect(vars).toBe(true)
    });
    test('Function should reject for terminal symbol', () => {
        const p = new Production('S', 'Ab');
        const vars = ChomskyNormalFormGrammar.checkLength2(p.rhs[0], p.rhs[1]);
        expect(vars).toBe(false)
    });
    test('Function should reject since input contains non Variable', () => {
        const p = new Production('S', 'AΘ');
        const vars = ChomskyNormalFormGrammar.checkLength2(p.rhs[0], p.rhs[1]);
        expect(vars).toBe(false)
    });
});
describe('Chomsky Normal Form isChomskyNormalForm tests', () => {
    test('Function should respond true for Chomsky Normal Form', () => {
        const g = new ConcreteGrammar();
        g.addProduction(new Production('S', 'AB'));
        g.addProduction(new Production('A', 'a'));
        g.addProduction(new Production('B', 'b'));
        const isChomsky = ChomskyNormalFormGrammar.isChomskyNormalForm(g);
        expect(isChomsky).toBe(true)
    });
    test('Function should respond false for not Chomsky Normal Form per terminal and Variable together', () => {
        const g = new ConcreteGrammar();
        g.addProduction(new Production('S', 'aB'))
        const isChomsky = ChomskyNormalFormGrammar.isChomskyNormalForm(g);
        expect(isChomsky).toBe(false)
    }
);
    test('Function should respond false for not Chomsky Normal Form per too long', () => {
        const g = new ConcreteGrammar();
        g.addProduction(new Production('S', 'aBaBaBBBB'))
        const isChomsky = ChomskyNormalFormGrammar.isChomskyNormalForm(g);
        expect(isChomsky).toBe(false)
    }
);

});
