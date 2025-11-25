import {TextEncoder, TextDecoder} from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

import { contextFreeGrammar, ConcreteGrammar, Production } from './Grammars';

describe( 'Check LHS Production is not empty', () => {
    test('LHS Production has 1 symbol', () => {
        const p = new Production('S', 'AAA');
        expect(contextFreeGrammar.LHSNotEmpty(p)).toBe(true);
    })
    test('LHS Production has 0 symbols', () => {
        const p = new Production('', 'AAA');
        expect(contextFreeGrammar.LHSNotEmpty(p)).toBe(false);
    })
    test('LHS Production has 3 symbols', () => {
        const p = new Production('SSS', 'AAA');
        expect(contextFreeGrammar.LHSNotEmpty(p)).toBe(true);
    })  
})

describe( 'Check RHS Production is not empty', () => {
    test('LHS Production has 1 symbol', () => {
        const p = new Production('S', 'A');
        expect(contextFreeGrammar.RHSNotEmpty(p)).toBe(true);
    })
    test('LHS Production has 0 symbols', () => {
        const p = new Production('S', '');
        expect(contextFreeGrammar.RHSNotEmpty(p)).toBe(false);
    })
    test('LHS Production has 3 symbols', () => {
        const p = new Production('S', 'AAA');
        expect(contextFreeGrammar.RHSNotEmpty(p)).toBe(true);
    }) 
})

describe( 'Check there is a single LHS variable', () => {
    test('LHS Production has 1 symbol', () => {
        const p = new Production('S', 'A');
        expect(contextFreeGrammar.SingleLHSVariable(p)).toBe(true);
    })
    test('LHS Production has 0 symbols', () => {
        const p = new Production('', 'B');
        expect(contextFreeGrammar.SingleLHSVariable(p)).toBe(false);
    })
    test('LHS Production has 3 symbols', () => {
        const p = new Production('SSS', 'C');
        expect(contextFreeGrammar.SingleLHSVariable(p)).toBe(false);
    }) 
})

describe( 'Determine if the grammar is context free', () => {
    test('Grammar G is context free', () => {
        const g = new ConcreteGrammar();
        g.addProduction(new Production('S','Aaa'))
        g.addProduction(new Production('A','bbA'))
        g.addProduction(new Production('A','AB'))
        g.addProduction(new Production('B','aaa'))
        expect(contextFreeGrammar.isContextFree(g)).toBe(true);
    })
    test('Grammar G is not context free', () => {
        const g = new ConcreteGrammar();
        g.addProduction(new Production('S','Aaa'))
        g.addProduction(new Production('AS','bbA'))
        g.addProduction(new Production('A','AB'))
        g.addProduction(new Production('B','aaa'))

        expect(contextFreeGrammar.isContextFree(g)).toBe(false);
    })
    test('Grammar G is not context free', () => {
        const g = new ConcreteGrammar();
        g.addProduction(new Production('S','Aaa'))
        g.addProduction(new Production('A','bbA'))
        g.addProduction(new Production('BA','AB'))
        g.addProduction(new Production('SA','aaa'))

        expect(contextFreeGrammar.isContextFree(g)).toBe(false);
    }) 
        test('Grammar G is not context free', () => {
        const g = new ConcreteGrammar();
        g.addProduction(new Production('S','Aaa'))
        g.addProduction(new Production('A','bbA'))
        g.addProduction(new Production('A','AB'))
        g.addProduction(new Production('B',''))

        expect(contextFreeGrammar.isContextFree(g)).toBe(false);
    }) 
})