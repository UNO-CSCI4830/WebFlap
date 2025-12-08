import { useState, useEffect, useRef } from 'react';
import NavigationBar from "./NavigationBar";
import Modal from './PopCard';
import './Grammars.css';

export class Production{
  lhs: string
  rhs: string
  constructor(lhs: string, rhs: string){
    this.lhs = lhs
    this.rhs = rhs
  }

  getVariables(): string[]{
    const vars: string[] = []
    const regex = /[A-Z]/g
    let match

    //check the LHS
    while ((match = regex.exec(this.lhs)) !== null){
      if(!vars.includes(match[0])){
        vars.push(match[0])
      }
    }

    //check the RHS
    regex.lastIndex = 0
    while((match = regex.exec(this.rhs)) !== null){
      if(!vars.includes(match[0])){
        vars.push(match[0])
      }
    }

    return vars;
  }

  getTerminals(): string[]{
    const terminals: string[] = []
    const chars = this.rhs.split('')
    chars.forEach(char => {
      if(char !== 'ε' && /[a-z0-9]/.test(char)) {
        if (!terminals.includes(char)){
          terminals.push(char)
        }
      }
    })

    return terminals
  }

  //Combines the left and right strings to output a single producution line
  toString(): string{
    return `${this.lhs}→${this.rhs}`
  }

  equal(other: Production){
    return other.lhs === this.lhs && other.rhs === this.rhs
  }

  isEpsilonProduction(){
    return this.rhs === 'ε' || this.rhs === ''
  }

}


export abstract class Grammar{

  variables: Set<string>
  terminals: Set<string>
  startVariable: string
  productions: Production[]

  constructor(){
    this.variables = new Set()
    this.terminals = new Set()
    this.startVariable = ""
    this.productions = []
  }

  abstract isConverted(): boolean
  abstract checkProduction(production: Production): void

  getStartVariable(): string | null{
    return this.startVariable
  }
  setStartVariable(variable: string): void{
    this.startVariable = variable
  }

  isValidProduction(production: Production): boolean{
  try{
    (this.checkProduction(production))
    return true
  } catch(e){
    return false
  }
}
  addProduction(production: Production) {
      this.checkProduction(production)
    
      // Don't add duplicates
      if (this.productions.some(p => p.equal(production))) {
        return
      }
    
      this.productions.push(production)
    
      // Auto-track variables and terminals
      production.getVariables().forEach(v => this.variables.add(v))
      production.getTerminals().forEach(t => this.terminals.add(t))
  }
  removeProduction(production: Production) {
    const index = this.productions.findIndex(p => p.equal(production))
    if (index !== -1) {
      this.productions.splice(index, 1)
      
      // Clean up unused variables
      production.getVariables().forEach(v => {
        if (!this.isVariableInProductions(v)) {
          this.variables.delete(v)
        }
      })
      
      // Clean up unused terminals
      production.getTerminals().forEach(t => {
        if (!this.isTerminalInProductions(t)) {
          this.terminals.delete(t)
        }
      })
    }
  }
  isVariableInProductions(variable: string) {
    return this.productions.some(p => p.getVariables().includes(variable))
  }
  isTerminalInProductions(terminal: string) {
    return this.productions.some(p => p.getTerminals().includes(terminal))
  }

  getProductions() {
    return [...this.productions]
  }

  getProductionsFor(variable: string) {
    return this.productions.filter(p => p.lhs === variable)
  }

  getTerminals() {
    return Array.from(this.terminals)
  }

  getVariables() {
    return Array.from(this.variables)
  }

  isProduction(production: Production) {
    return this.productions.some(p => p.equal(production))
  }

  isTerminal(terminal: string) {
    return this.terminals.has(terminal)
  }

  isVariable(variable: string) {
    return this.variables.has(variable)
  }

  toString() {
    let result = 'Grammar:\n';
    result += `V: ${Array.from(this.variables).join(' ')}\n`
    result += `T: ${Array.from(this.terminals).join(' ')}\n`
    result += `S: ${this.startVariable || 'none'}\n`
    result += 'P:\n'
    this.productions.forEach(p => {
      result += `  ${p.toString()}\n`
    })
    return result
  }

  // Serialize grammar for storage
  toJSON() {
    return {
      startVariable: this.startVariable,
      productions: this.productions.map(p => ({ lhs: p.lhs, rhs: p.rhs }))
    };
  }

  // Load from serialized data
  static fromJSON(data: { startVariable: any; productions: any[]; }, GrammarClass: new () => any) {
    const grammar = new GrammarClass()
    grammar.setStartVariable(data.startVariable || 'S')
    data.productions.forEach(p => {
      try {
        grammar.addProduction(new Production(p.lhs, p.rhs))
      } catch (e) {
        console.warn('Skipped invalid production:', p, e)
      }
    });
    return grammar
  }
}

export class ConcreteGrammar extends Grammar {
  isConverted(): boolean {
    return false;
  }
  checkProduction(production: Production): void {
    // minimal validation: allow anything non-empty LHS and RHS
    if (!production.lhs || production.lhs.trim() === '') {
      throw new Error('LHS cannot be empty');
    }
    if (production.rhs === undefined || production.rhs === null) {
      throw new Error('RHS cannot be null');
    }
  }

  findDuplicateProductions(): Production[][] {
    const duplicates: Production[][] = [];
    const seen: Production[] = [];

    for (const production of this.productions) {
      const duplicate = seen.find(p => p.equal(production));
      if (duplicate) {
        duplicates.push([duplicate, production]);
      } else {
        seen.push(production);
      }
    }

    return duplicates;
  }

  isVariableReachable(variable: string): boolean {
    if (!this.startVariable) {
      return false;
    }

    const reachable = new Set<string>();
    const toProcess: string[] = [this.startVariable];

    while (toProcess.length > 0) {
      const current = toProcess.pop()!;

      if (reachable.has(current)) {
        continue;
      }

      reachable.add(current);

      // Get all productions with current variable as LHS
      const productions = this.getProductionsFor(current);

      for (const production of productions) {
        // Extract all variables from the RHS
        const variables = production.getVariables();
        for (const v of variables) {
          if (!reachable.has(v)) {
            toProcess.push(v);
          }
        }
      }
    }

    return reachable.has(variable);
  }

  getReachableVariables(): string[] {
    if (!this.startVariable) {
      return [];
    }

    const reachable = new Set<string>();
    const toProcess: string[] = [this.startVariable];

    while (toProcess.length > 0) {
      const current = toProcess.pop()!;

      if (reachable.has(current)) {
        continue;
      }

      reachable.add(current);

      // Get all productions with current variable as LHS
      const productions = this.getProductionsFor(current);

      for (const production of productions) {
        // Extract all variables from the RHS
        const variables = production.getVariables();
        for (const v of variables) {
          if (!reachable.has(v)) {
            toProcess.push(v);
          }
        }
      }
    }

    return Array.from(reachable);
  }

  /**
   * Gets all unreachable variables in the grammar.
   * These are variables that cannot be derived from the start symbol.
   */
  getUnreachableVariables(): string[] {
    const reachable = new Set(this.getReachableVariables());
    return this.getVariables().filter(v => !reachable.has(v));
  }

  /**
   * Determines if a production is reachable.
   * A production is reachable if its LHS variable is reachable.
   */
  isProductionReachable(production: Production): boolean {
    return this.isVariableReachable(production.lhs);
  }

  /**
   * Gets all reachable productions in the grammar.
   */
  getReachableProductions(): Production[] {
    return this.productions.filter(p => this.isProductionReachable(p));
  }

  /**
   * Gets all unreachable productions in the grammar.
   */
  getUnreachableProductions(): Production[] {
    return this.productions.filter(p => !this.isProductionReachable(p));
  }

}

  

  function rightLinearCheck(grammar: ConcreteGrammar) {
    let productions = grammar.getProductions()
    for (let i = 0; i < productions.length; i++){
      //LHS cannot be empty
      if (!productions[i].lhs || productions[i].lhs.trim() === ""){
        return false
      }
      // LHS must be a single variable for Right Linear Grammar
      if (productions[i].lhs.length !== 1 || !/[A-Z]/.test(productions[i].lhs)) {
        return false
      }
      // RHS cannot have only one non-terminal symbol
      if (productions[i].rhs.length === 1 && /[A-Z]/.test(productions[i].rhs)){
        return false
      }
      // RHS cannot have terminals or non-termianls following a non-terminal symbol for an Right-Linear Grammar
      if (/[A-Z](?:[A-Za-z])+/.test(productions[i].rhs)){
        return false
      }
    }
    return true
  }

  function leftLinearCheck(grammar: ConcreteGrammar) {
    let productions = grammar.getProductions()
    for (let i = 0; i < productions.length; i++){
      //LHS cannot be empty
      if (!productions[i].lhs || productions[i].lhs.trim() === ""){
        return false
      }
      // LHS must be a single variable for Right Linear Grammar
      if (productions[i].lhs.length !== 1 || !/[A-Z]/.test(productions[i].lhs)) {
        return false
      }
      // RHS cannot have only one non-terminal symbol
      if (productions[i].rhs.length === 1 && /[A-Z]/.test(productions[i].rhs)){
        return false
      }
      // RHS cannot have terminals or non-termianls following a non-terminal symbol for an Right-Linear Grammar
      if (/(?:[A-Za-z])+[A-Z]/.test(productions[i].rhs)){
        return false
      }
    }
    return true
  }

function Grammars() {
  const [productions, setProductions] = useState([
    { id: 1, lhs: '', rhs: '' },
    { id: 2, lhs: '', rhs: '' },
    { id: 3, lhs: '', rhs: '' },
    { id: 4, lhs: '', rhs: '' },
    { id: 5, lhs: '', rhs: '' },
    { id: 6, lhs: '', rhs: '' },
  ]);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openGrammarTest, setOpenCard] = useState<boolean>(false);
  const [grammarTestResults, setGrammarTestResults] = useState<{
  isContextFree: boolean;
  isRightLinear: boolean;
  isLeftLinear: boolean;
  isChomskyNormalForm: boolean;
} | null>(null);
  
  const lastFocusedInput = useRef<HTMLInputElement | null>(null);

  // Insert epsilon into the last-focused input (if any)
  const insertEpsilon = () => {
    const active = lastFocusedInput.current;
    if (active && active.tagName === 'INPUT') {
      const prodIdAttr = active.getAttribute('data-prod-id');
      const field = active.getAttribute('data-field') as 'lhs' | 'rhs' | null;
      const start = active.selectionStart ?? active.value.length;
      const end = active.selectionEnd ?? start;
      const newVal = active.value.slice(0, start) + 'ε' + active.value.slice(end);
      // Update DOM value and caret
      active.value = newVal;
      const caret = start + 1;
      try { active.setSelectionRange(caret, caret); } catch (e) { /* ignore */ }

      if (prodIdAttr && field) {
        const id = Number(prodIdAttr);
        updateProduction(id, field, newVal);
      }
      // restore focus to the input (defensive)
      try { active.focus(); } catch (e) { /* ignore */ }
    }
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // if clicked outside the menu bar, close menus
      if (!target || !target.closest('.menu-bar')) {
        setOpenMenu(null);
        setOpenSubmenu(null);
      }
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const updateProduction = (id: number, field: 'lhs' | 'rhs', value: string) => {
    const updatedProductions = productions.map(prod => 
      prod.id === id ? { ...prod, [field]: value } : prod
    );
    
    setProductions(updatedProductions);
    
    // Auto-add new row if last row is being edited
    const lastProd = updatedProductions[updatedProductions.length - 1];
    if (lastProd.id === id && value.length > 0) {
      setProductions([...updatedProductions, { id: Date.now(), lhs: '', rhs: '' }]);
    }
  };

  return (
    <div className="jflap-container">
      <NavigationBar />  
      <div className="menu-bar">
        <div className="menu-item">
          <button 
            className="menu-button"
            onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
          >
            File
          </button>
          {openMenu === 'file' && (
            <div className="dropdown-menu">
              <div
                className="menu-option"
                onClick={() => {
                  const id = `file:New...`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                New...
                {openSubmenu === `file:New...` && (
                  <div className="submenu">
                    <div className="menu-option">From Scratch</div>
                    <div className="menu-option">From Template</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `file:Open...`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Open...
                {openSubmenu === `file:Open...` && (
                  <div className="submenu">
                    <div className="menu-option">Open Local</div>
                    <div className="menu-option">Open URL</div>
                  </div>
                )}
              </div>

              <div className="menu-option">Save</div>
              <div className="menu-option">Save As...</div>
              <div className="menu-option">Close</div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button 
            className="menu-button"
            onClick={() => setOpenMenu(openMenu === 'input' ? null : 'input')}
          >
            Input
          </button>
          {openMenu === 'input' && (
            <div className="dropdown-menu">
              <div
                className="menu-option"
                onClick={() => {
                  const id = `input:Build LL(1) Parse Table`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Build LL(1) Parse Table
                {openSubmenu === `input:Build LL(1) Parse Table` && (
                  <div className="submenu">
                    <div className="menu-option">Show Table</div>
                    <div className="menu-option">Export...</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `input:Build SLR(1) Parse Table`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Build SLR(1) Parse Table
                {openSubmenu === `input:Build SLR(1) Parse Table` && (
                  <div className="submenu">
                    <div className="menu-option">Show Table</div>
                    <div className="menu-option">Export...</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  try{
                    const grammarWrapper = new ConcreteGrammar();
                    productions.forEach(p => {
                    const lhs = p.lhs.trim();
                    const rhs = p.rhs.trim();
                    if (lhs !== '' || rhs !== '') {
                      grammarWrapper.addProduction(new Production(lhs, rhs));
                    }
                    });
                    grammarWrapper.setStartVariable(productions.find(p => p.lhs.trim() !== '')?.lhs.trim() || 'S');

                    localStorage.setItem('webflap:bruteForceGrammar', JSON.stringify(grammarWrapper.toJSON()));
                    
                  }
                  catch (err) {
                    console.error('Failed to save grammar to localStorage', err);
                  }
                  // open new tab at route /bruteforce
                  const w = window.open('/bruteforce', '_blank');
                  if (w) w.focus();
                }}
              >
                Brute Force Parse
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  try{
                    const grammarWrapper = new ConcreteGrammar();
                    productions.forEach(p => {
                    const lhs = p.lhs.trim();
                    const rhs = p.rhs.trim();
                    if (lhs !== '' || rhs !== '') {
                      grammarWrapper.addProduction(new Production(lhs, rhs));
                    }
                    });
                    grammarWrapper.setStartVariable(productions.find(p => p.lhs.trim() !== '')?.lhs.trim() || 'S');

                    localStorage.setItem('webflap:bruteForceGrammar', JSON.stringify(grammarWrapper.toJSON()));
                    
                  }
                  catch (err) {
                    console.error('Failed to save grammar to localStorage', err);
                  }
                  // open new tab at route /bruteforce
                  const w = window.open('/multiplebruteforce', '_blank');
                  if (w) w.focus();
                }}
              >
                Multiple Brute Force Parse
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `input:User Control Parse`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                User Control Parse
                {openSubmenu === `input:User Control Parse` && (
                  <div className="submenu">
                    <div className="menu-option">Start Interactive</div>
                    <div className="menu-option">Instructions</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `input:CYK Parse`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                CYK Parse
                {openSubmenu === `input:CYK Parse` && (
                  <div className="submenu">
                    <div className="menu-option">Start CYK</div>
                    <div className="menu-option">Show Table</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button 
          className="menu-button" 
          onClick={() => setOpenMenu(openMenu === 'test' ? null : 'test')}
          >
            Test
          </button>
          {openMenu === 'test' && (
            <div className="dropdown-menu">
              <div
                className="menu-option"
                onClick={() => {
                    setOpenCard(true);
                    const grammarWrapper = new ConcreteGrammar();
                    productions.forEach(p => {
                    const lhs = p.lhs.trim();
                    const rhs = p.rhs.trim();
                    if (lhs !== '' || rhs !== '') {
                      grammarWrapper.addProduction(new Production(lhs, rhs));
                    }
                    });
                    let isContextFree = contextFreeGrammar.isContextFree(grammarWrapper);
                    let isRightLinear = rightLinearCheck(grammarWrapper);
                    let isLeftLinear = leftLinearCheck(grammarWrapper);
                    let isChomskyNormalForm = ChomskyNormalFormGrammar.isChomskyNormalForm(grammarWrapper);
                    setGrammarTestResults({
                      isContextFree,
                      isRightLinear,
                      isLeftLinear,
                      isChomskyNormalForm
                })
                    
                }}
              >
                Test for Grammar Type
              </div> 
              <Modal open={openGrammarTest} onClose={() => {setOpenCard(false)}} >
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-4">Grammar Test Results</h2>
                  {grammarTestResults && (
                    <div>
                
                      {
                        grammarTestResults.isChomskyNormalForm ? (
                          <p>This is a Chomsky Normal Form Grammar (Context-Free Grammar)</p>
                        ) :
                          grammarTestResults.isContextFree && grammarTestResults.isRightLinear ? (
                        <p>This is a Right Linear Grammar (Regular Grammar and Context-Free Grammar)</p>
                      ) : grammarTestResults.isContextFree && grammarTestResults.isLeftLinear ? (
                        <p>This is a Left Linear Grammar (Regular Grammar and Context-Free Grammar)</p>
                      ) : grammarTestResults.isContextFree ? (
                        <p>This is a Context-Free Grammar</p>
                      ) : (
                        <p>This grammar does not match standard grammar types</p>
                      )}
                    </div>
                  )}
                </div>
              </Modal>
            </div>
          )}

        </div>

        <div className="menu-item">
          <button 
            className="menu-button"
            onClick={() => setOpenMenu(openMenu === 'convert' ? null : 'convert')}
          >
            Convert
          </button>
          {openMenu === 'convert' && (
            <div className="dropdown-menu">
              <div
                className="menu-option"
                onClick={() => {
                  const id = `convert:Convert CFG to PDA (LL)`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Convert CFG to PDA (LL)
                {openSubmenu === `convert:Convert CFG to PDA (LL)` && (
                  <div className="submenu">
                    <div className="menu-option">Open Converter</div>
                    <div className="menu-option">Options...</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `convert:Convert CFG to PDA (LR)`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Convert CFG to PDA (LR)
                {openSubmenu === `convert:Convert CFG to PDA (LR)` && (
                  <div className="submenu">
                    <div className="menu-option">Open Converter</div>
                    <div className="menu-option">Options...</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `convert:Convert Right-Linear Grammar to FA`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Convert Right-Linear Grammar to FA
                {openSubmenu === `convert:Convert Right-Linear Grammar to FA` && (
                  <div className="submenu">
                    <div className="menu-option">Open Converter</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `convert:Transform Grammar`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Transform Grammar
                {openSubmenu === `convert:Transform Grammar` && (
                  <div className="submenu">
                    <div className="menu-option">Left Factoring</div>
                    <div className="menu-option">Eliminate Left Recursion</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button 
            className="menu-button"
            onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
          >
            Help
          </button>
          {openMenu === 'help' && (
            <div className="dropdown-menu">
              <div
                className="menu-option"
                onClick={() => {
                  const id = `help:Help...`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Help...
                {openSubmenu === `help:Help...` && (
                  <div className="submenu">
                    <div className="menu-option">Documentation</div>
                    <div className="menu-option">Tutorials</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `help:About...`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                About...
                {openSubmenu === `help:About...` && (
                  <div className="submenu">
                    <div className="menu-option">Version</div>
                    <div className="menu-option">Licenses</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button
            className="menu-button"
            title="Insert epsilon (ε) into focused production field"
            onMouseDown={(e) => { e.preventDefault(); insertEpsilon(); }}
          >
            ε
          </button>
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-tab">Grammar Editor</div>
        
        <div className="grammar-table">
          <table>
            <thead>
              <tr className="headers-row">
                <th className="lhs-cell header">LHS</th>
                <th className="arrow-cell header"></th>
                <th className="rhs-cell header">RHS</th>
              </tr>
            </thead>
            <tbody>
              {productions.map((prod) => (
                <tr key={prod.id}>
                  <td className="lhs-cell">
                    <input
                      type="text"
                      value={prod.lhs}
                      data-prod-id={prod.id}
                      data-field="lhs"
                      onFocus={(e) => { lastFocusedInput.current = e.target as HTMLInputElement; }}
                      onChange={(e) => updateProduction(prod.id, 'lhs', e.target.value)}
                      placeholder=""
                    />
                  </td>
                  <td className="arrow-cell">→</td>
                  <td className="rhs-cell">
                    <input
                      type="text"
                      value={prod.rhs}
                      data-prod-id={prod.id}
                      data-field="rhs"
                      onFocus={(e) => { lastFocusedInput.current = e.target as HTMLInputElement; }}
                      onChange={(e) => updateProduction(prod.id, 'rhs', e.target.value)}
                      placeholder=""
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Grammars;
export abstract class ChomskyNormalFormGrammar extends Grammar {
  static isChomskyNormalForm(grammar: Grammar): boolean {
    // Check if all productions are in Chomsky Normal Form
    for (let production of grammar.getProductions()) {
      const rhs = production.rhs || '';
      const rhsLength = this.getLength(rhs);
      if (rhsLength === 1) {
         if (this.checkLength1(rhs) === false) {
          return false;
        }
      } else if (rhsLength === 2) {
        if (this.checkLength2(rhs[0], rhs[1]) === false) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }
  //get length of rhs
  static getLength(rhs: string): number {
    return rhs.length;
  }
  //if length is 1, check if it is a terminal
  static checkLength1(symbol: string): boolean {
    return /[a-z0-9]/.test(symbol);
  }
  //if length is 2, check both are variables
  static checkLength2(symbol1: string, symbol2: string): boolean {
    return /[A-Z]/.test(symbol1) && /[A-Z]/.test(symbol2);
  }

}
export abstract class contextFreeGrammar extends Grammar {
  static isContextFree(grammar: Grammar): boolean {
    let productions = grammar.getProductions()
    for (let i = 0; i < productions.length; i++){
      //LHS cannot be empty
      if (!this.LHSNotEmpty(productions[i])){
        return false
      }
      // LHS must be a single variable for Context-Free Grammar
      if (!this.SingleLHSVariable(productions[i])){
        return false
      }
      // RHS cannot be empty
      if (!this.RHSNotEmpty(productions[i])){
        return false
      }
    }
    return true
  }
  //checks for empty LHS
  static LHSNotEmpty(production: Production): boolean {
    return production.lhs.trim() !== "";
  }
  //checks for single variable in LHS
  static SingleLHSVariable(production: Production): boolean {
    return production.lhs.length === 1 && /[A-Z]/.test(production.lhs);
  }
  //checks for empty RHS
  static RHSNotEmpty(production: Production): boolean {
    return production.rhs.trim() !== "";
  }
}

