import { useEffect, useState } from 'react';
import './Grammars.css';
import { ConcreteGrammar } from './Grammars';
import Modal from './PopCard';

type Prod = { lhs: string; rhs: string };
type ParseResult = { input: string; status: 'accepted' | 'rejected'; derivation?: string[] };

function MultipleBruteForceParse() {
  const [productions, setProductions] = useState<Prod[]>([]);
  const [inputs, setInputs] = useState<string[]>(['']);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ParseResult[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [invalidChar, setInvalidChar] = useState<string>('');

  // Extract all valid characters from grammar
  const getValidChars = (): Set<string> => {
    const validChars = new Set<string>();
    productions.forEach((prod) => {
      prod.rhs.split('').forEach((char) => {
        if (char !== 'ε') validChars.add(char);
      });
    });
    return validChars;
  };

  useEffect(() => {
    try {
        // Grab the grammar from local storage
      const raw = localStorage.getItem('webflap:bruteForceGrammar');
      if (raw) {
        // Parse Data into the proper formats for our grammar classes
        const data = JSON.parse(raw);
        const grammar = ConcreteGrammar.fromJSON(data, ConcreteGrammar);
        const parsedProds = grammar.getProductions().map((p: { lhs: any; rhs: any }) => ({
          lhs: p.lhs,
          rhs: p.rhs,
        }));
        setProductions(parsedProds);
      }
    } catch (err) {
      console.error('Failed to load grammar from localStorage', err);
    }
  }, []);

  //Ensure that the inputs only contain valid charaters to stop unnecessary checks
  const validateInput = (input: string): boolean => {
    const validChars = getValidChars();
    for (const char of input) {
      if (!validChars.has(char) && char !== 'ε') {
        setInvalidChar(char);
        setShowModal(true);
        return false;
      }
    }
    return true;
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    // Auto-create new input field if user types in the last field
    if (index === inputs.length - 1 && value.trim() !== '') {
      setInputs([...newInputs, '']);
    }
  };

  const removeInputField = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const startParseAll = async () => {
    const nonEmptyInputs = inputs.filter((inp) => inp.trim() !== '');

    if (nonEmptyInputs.length === 0) {
      alert('Please enter at least one input string to parse.');
      return;
    }

    // Validate all inputs
    for (const input of nonEmptyInputs) {
      if (!validateInput(input)) {
        return;
      }
    }

    if (!productions || productions.length === 0) {
      alert('No grammar loaded.');
      return;
    }

    setRunning(true);
    setResults([]);

    // Parse each input sequentially
    for (const input of nonEmptyInputs) {
      await parseString(input);
    }

    setRunning(false);
  };

  const parseString = (target: string) => {
    const startSymbol = productions.find((p) => p.lhs.trim() !== '')?.lhs || 'S';
    const applyRhs = (rhs: string) => (rhs === 'ε' ? '' : rhs);

    type Node = { str: string; path: string[] };
    const queue: Node[] = [{ str: startSymbol, path: [startSymbol] }];
    const visited = new Set<string>();
    visited.add(startSymbol);

    const maxIterations = 20000;
    let iterations = 0;

    while (queue.length > 0 && iterations < maxIterations) {
      const node = queue.shift()!;
      iterations++;

      if (node.str === target) {
        setResults((prev) => [
          ...prev,
          { input: target, status: 'accepted', derivation: node.path },
        ]);
        setRunning(false);
        console.log('Derivation:', node.path);
        return;
      }

      const maxLen = Math.max(target.length, 40);
      if (node.str.length > Math.max(maxLen, target.length + 10)) continue;

      for (const prod of productions) {
        const lhs = prod.lhs;
        if (!lhs) continue;
        const rhs = applyRhs(prod.rhs ?? '');

        let idx = node.str.indexOf(lhs);
        while (idx !== -1) {
          const newStr = node.str.slice(0, idx) + rhs + node.str.slice(idx + lhs.length);
          if (!visited.has(newStr)) {
            visited.add(newStr);
            const newPath = node.path.concat([`${lhs}→${prod.rhs}`, newStr]);

            if (newStr === target) {
              setResults((prev) => [
                ...prev,
                { input: target, status: 'accepted', derivation: newPath },
              ]);
              setRunning(false);
              return;
            }

            if (newStr.length <= Math.max(target.length + 10, 60)) {
              queue.push({ str: newStr, path: newPath });
            }
          }
          idx = node.str.indexOf(lhs, idx + 1);
        }
      }
    }

    setRunning(false);
    setResults((prev) => [...prev, { input: target, status: 'rejected' }]);
    console.log('Done searching after', iterations, 'iterations');
  };

  return (
    <div className="jflap-container">
      <div className="jflap-title-bar">WebFlap: Multiple Brute Force Parse</div>

      <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1200 }}>
          <h3>Grammar</h3>
          <div
            style={{
              width: '100%',
              background: '#fff',
              border: '1px solid #e5e7eb',
              padding: 12,
              borderRadius: 6,
              marginBottom: 20,
            }}
          >
            {productions.length === 0 && (
              <div style={{ color: '#6b7280' }}>
                No grammar found. Go to the Grammars tab and save a grammar before opening this page.
              </div>
            )}
            {productions.map((p, i) => (
              <div key={i} style={{ fontFamily: 'monospace', padding: '6px 0' }}>
                {p.lhs} → {p.rhs}
              </div>
            ))}
          </div>

          {/* Two-column layout for results */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}
          >
            {/* Left column: Input strings */}
            <div>
              <h3 style={{ marginBottom: 16 }}>Input to parse</h3>
              <div
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  padding: 12,
                  maxHeight: '500px',
                  overflowY: 'auto',
                }}
              >
                {inputs.map((input, i) => (
                  <div key={i} style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => handleInputChange(i, e.target.value)}
                      placeholder={`String ${i + 1}`}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 6,
                        border: '1px solid #e5e7eb',
                        fontFamily: 'monospace',
                      }}
                    />
                    {i > 0 && (
                    <button
                      onClick={() => removeInputField(i)}
                      style={{
                        padding: '8px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Remove
                    </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={startParseAll}
                disabled={running}
                style={{
                  marginTop: 12,
                  padding: '8px 12px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: running ? 'default' : 'pointer',
                  opacity: running ? 0.7 : 1,
                }}
              >
                {running ? 'Parsing...' : 'Start Parse All'}
              </button>
            </div>

            {/* Right column: Results */}
            <div>
              <h4 style={{ marginBottom: 12, fontWeight: 600 }}>Results</h4>
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: 12 }}>
                {results.length === 0 && <div style={{ color: '#6b7280' }}>No results yet</div>}
                {results.map((r, i) => (
                  <div key={i} style={{ marginBottom: i < results.length - 1 ? 8 : 0 }}>
                    <div
                      style={{
                        padding: '8px 12px',
                        background: r.status === 'accepted' ? '#d1fae5' : '#fee2e2',
                        border: `1px solid ${r.status === 'accepted' ? '#6ee7b7' : '#fca5a5'}`,
                        borderRadius: 4,
                        color: r.status === 'accepted' ? '#065f46' : '#991b1b',
                        fontWeight: 600,
                      }}
                    >
                      {r.status === 'accepted' ? 'ACCEPTED' : 'REJECTED'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for invalid character */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2 style={{ marginBottom: 12, fontWeight: 600 }}>Invalid Character</h2>
        <p style={{ marginBottom: 16 }}>
          The character <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>'{invalidChar}'</span> does not exist in the grammar.
        </p>
        <button
          onClick={() => setShowModal(false)}
          style={{
            padding: '8px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          OK
        </button>
      </Modal>
    </div>
  );
}

export default MultipleBruteForceParse;