import { useEffect, useState } from 'react';
import './Grammars.css';

type Prod = { lhs: string; rhs: string };

function BruteForceParse() {
  const [productions, setProductions] = useState<Prod[]>([]);
  const [inputString, setInputString] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [derivation, setDerivation] = useState<string[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('webflap:bruteForceGrammar');
      if (raw) {
        const parsed = JSON.parse(raw) as Prod[];
        setProductions(parsed);
      }
    } catch (err) {
      console.error('Failed to load grammar from localStorage', err);
    }
  }, []);

  const startParse = () => {
    setResult(null);
    setDerivation(null);
    if (inputString.trim() === '') {
      setResult('Please enter an input string to parse.');
      return;
    }
    if (!productions || productions.length === 0) {
      setResult('No grammar loaded.');
      return;
    }

    setRunning(true);

    // Determine start symbol: first non-empty LHS or 'S'
    const startSymbol = (productions.find(p => p.lhs.trim() !== '')?.lhs) || 'S';

    // Helper to normalize rhs (treat 'ε' as empty string)
    const applyRhs = (rhs: string) => (rhs === 'ε' ? '' : rhs);

    // BFS queue: items are { str, path }
    type Node = { str: string; path: string[] };
    const queue: Node[] = [{ str: startSymbol, path: [startSymbol] }];
    const visited = new Set<string>();
    visited.add(startSymbol);

    const target = inputString;
    const maxIterations = 20000;
    let iterations = 0;

    while (queue.length > 0 && iterations < maxIterations) {
      const node = queue.shift()!;
      iterations++;

      // if strings match exactly, success
      if (node.str === target) {
        setRunning(false);
        setResult('Accepted (derivation found)');
        setDerivation(node.path);
        console.log('Derivation:', node.path);
        return;
      }

      // Prune: if node string is already longer than some reasonable limit, skip
      const maxLen = Math.max(target.length, 40);
      if (node.str.length > Math.max(maxLen, target.length + 10)) continue;

      // For each production, find occurrences of lhs in node.str and replace them
      for (const prod of productions) {
        const lhs = prod.lhs;
        if (!lhs) continue;
        const rhs = applyRhs(prod.rhs ?? '');

        // search for all occurrences of lhs in node.str
        let idx = node.str.indexOf(lhs);
        while (idx !== -1) {
          const newStr = node.str.slice(0, idx) + rhs + node.str.slice(idx + lhs.length);
          if (!visited.has(newStr)) {
            visited.add(newStr);
            const newPath = node.path.concat([`${lhs}→${prod.rhs}` , newStr]);
            // If newStr matches target, return immediately
            if (newStr === target) {
              setRunning(false);
              setResult('Accepted (derivation found)');
              setDerivation(newPath);
              console.log('Derivation:', newPath);
              return;
            }
            // Only enqueue strings that are not absurdly long
            if (newStr.length <= Math.max(target.length + 10, 60)) {
              queue.push({ str: newStr, path: newPath });
            }
          }
          idx = node.str.indexOf(lhs, idx + 1);
        }
      }
    }

    setRunning(false);
    if (iterations >= maxIterations) {
      setResult('Search aborted — iteration limit reached.');
    } else {
      setResult('Rejected (no derivation found within limits).');
    }
    console.log('Done searching after', iterations, 'iterations');
  };

  return (
    <div className="jflap-container">
      <div className="jflap-title-bar">WebFlap: Brute Force Parse</div>

      <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 900 }}>
          <h3>Grammar</h3>
          <div style={{ width: '100%', background: '#fff', border: '1px solid #e5e7eb', padding: 12, borderRadius: 6 }}>
          {productions.length === 0 && <div style={{ color: '#6b7280' }}>No grammar found. Go to the Grammars tab and save a grammar before opening this page.</div>}
          {productions.map((p, i) => (
            <div key={i} style={{ fontFamily: 'monospace', padding: '6px 0' }}>{p.lhs} → {p.rhs}</div>
          ))}
        </div>

          <h3 style={{ marginTop: 20 }}>Input to parse</h3>
        <input
          type="text"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          placeholder="Enter string to parse (e.g. aaab)"
          style={{ padding: '10px 12px', width: '60%', borderRadius: 6, border: '1px solid #e5e7eb' }}
        />

        <div style={{ marginTop: 16 }}>
          <button onClick={startParse} disabled={running} style={{ padding: '8px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: running ? 'default' : 'pointer', opacity: running ? 0.7 : 1 }}>Start Parse</button>
        </div>

        {/* Result / status */}
        <div style={{ marginTop: 16 }}>
          {running && <div style={{ color: '#2563eb' }}>Searching for derivation...</div>}
          {result && <div style={{ marginTop: 8, color: result.startsWith('Accepted') ? 'green' : '#b91c1c' }}>{result}</div>}
          {derivation && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600 }}>Derivation steps (interleaved):</div>
              <div style={{ marginTop: 6, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{derivation.join(' -> ')}</div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default BruteForceParse;
