// Fix for TextEncoder error
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

import { Production } from '../Grammars';


describe('Production class - getVariables()', () => {
    test('should return all variables in production with variables and terminals', () => {
        const production = new Production('S', 'aABc123');
        const variables = production.getVariables();
        expect(variables).toEqual(['S', 'A', 'B']);
    });
    
    test('should handle productions with only variables on LHS', () => {
        const production = new Production('SA', 'wxyz');
        const variables = production.getVariables();
        expect(variables).toEqual(['S', 'A']);
    });

    test('should handle productions with only variables', () => {
        const production = new Production('SA', 'WXYZ');
        const variables = production.getVariables();
        expect(variables).toEqual(['S', 'A', 'W', 'X', 'Y', 'Z']);
    });

    test('should handle productions with duplicate variables', () => {
        const production = new Production('SA', 'WXYZWXYZ');
        const variables = production.getVariables();
        expect(variables).toEqual(['S', 'A', 'W', 'X', 'Y', 'Z']);
    });

    test('should return an empty array if there are no variables in produciton', () => {
        const production = new Production('s', 'xyz123');
        const variables = production.getVariables();
        expect(variables).toEqual([]);
    });
});


describe('Production class - getTerminals()', () => {
    test('should return all terminals in production with variables and terminals', () => {
        const production = new Production('S', 'aABc123');
        const variables = production.getTerminals();
        expect(variables).toEqual(['a', 'c', '1', '2', '3']);
    });
    
    test('should handle productions with only terminals on RHS', () => {
        const production = new Production('SA', 'wxyz');
        const variables = production.getTerminals();
        expect(variables).toEqual(['w', 'x', 'y', 'z']);
    });

    test('should handle productions with duplicate terminals', () => {
        const production = new Production('SA', 'wxyzwxyz');
        const variables = production.getTerminals();
        expect(variables).toEqual(['w', 'x', 'y', 'z']);
    });

    test('should return an empty array if there are no terminals in produciton', () => {
        const production = new Production('SA', 'WXYZ');
        const variables = production.getTerminals();
        expect(variables).toEqual([]);
    });
});


describe('Production class - toString()', () => {
    test('should return the correct string with multiple characters on RHS', () => {
        const production = new Production('S', 'aABc123');
        expect(production.toString()).toBe('S→aABc123');
    });
    
    test('should return the correct string with one character on RHS', () => {
        const production = new Production('X', 'b');
        expect(production.toString()).toBe('X→b');
    });

    test('should handle production with empty RHS', () => {
        const production = new Production('A', '');
        expect(production.toString()).toBe('A→');
    });   
});


describe('Production class - equal()', () => {
    test('should return true for identical productions', () => {
        const production1 = new Production('S', 'aABc123');
        const production2 = new Production('S', 'aABc123');
        expect(production1.equal(production2)).toBe(true);
    });
    
    test('should return false for productions with different LHS', () => {
        const production1 = new Production('S', 'aABc123');
        const production2 = new Production('A', 'aABc123');
        expect(production1.equal(production2)).toBe(false);
    });
    
    test('should return false for productions with different RHS', () => {
        const production1 = new Production('S', 'aABc123');
        const production2 = new Production('S', 'xXYz124');
        expect(production1.equal(production2)).toBe(false);
    });
    
    test('should return false for productions with different LHS and RHS', () => {
        const production1 = new Production('S', 'aABc123');
        const production2 = new Production('A', 'xXYz124');
        expect(production1.equal(production2)).toBe(false);
    });
});


describe('Production class - isEpsilonProduction()', () => {
    test('should return true for production with empty RHS', () => {
        const production = new Production('S', '');
        expect(production.isEpsilonProduction()).toBe(true);
    });

    test('should return true for production with epsilon character', () => {
        const production = new Production('S', 'ε');
        expect(production.isEpsilonProduction()).toBe(true);
    });
    
    test('should return false for production with non-empty RHS', () => {
        const production = new Production('A', 'abc123');
        expect(production.isEpsilonProduction()).toBe(false);
    });

    test('should return false for production with epsilon and characters', () => {
        const production = new Production('A', 'abcε123');
        expect(production.isEpsilonProduction()).toBe(false);
    });
    
    test('should return false for production with whitespace on RHS', () => {
        const production = new Production('X', '   ');
        expect(production.isEpsilonProduction()).toBe(false);
    });
});

