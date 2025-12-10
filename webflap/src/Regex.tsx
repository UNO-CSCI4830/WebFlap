import { useState } from 'react';
import NavigationBar from "./NavigationBar";
import { useLocation } from "react-router-dom";


type ParseResult = { input: string; status: 'accepted' | 'rejected'; derivation?: string[] };

function Regex() {
    const location = useLocation();
    const passedExpression = location.state?.expression as string | undefined;
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [inputs, setInputs] = useState<string[]>(['']);
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState<ParseResult[]>([]);
    const [regex, setRegularExpression] = useState<string | undefined>(passedExpression ?? "");
    
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

        if (!regex || regex.length === 0) {
        alert('No Regular Expression loaded.');
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
    // Convert JFLAP + to JavaScript regex OR |
    const convertedRegex = regex!.replace(/\+/g, '|');
    const regularExpression = new RegExp("^(" + convertedRegex + ")$");

    if ( regularExpression.test(target)) {
        setResults((prev) => [
          ...prev,
          { input: target, status: 'accepted'},
        ]);
        setRunning(false);
        return;
      }
    else{
        setResults((prev) => [...prev, { input: target, status: 'rejected' }]);
        setRunning(false);
        return;
    }
    
  }

    return(
        <div className="jflapContainer">
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
                  setRegularExpression("");
                  setInputs(['']);
                  setResults([]);
                  setOpenMenu(null);
                }}
              >
                New Blank File
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.jff';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const { parseJFFFile, extractRegex } = await import('./jffParser');
                      const parsed = await parseJFFFile(file);
                      if (parsed.projectType === 'regex') {
                        const expression = extractRegex(parsed.xml);
                        setRegularExpression(expression);
                      } else {
                        alert('This file is not a regex JFF file.');
                      }
                    }
                  };
                  input.click();
                  setOpenMenu(null);
                }}
              >
                Import JFF File
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const jffContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<structure>
  <type>re</type>
  <expression>${regex || ''}</expression>
</structure>`;
                  
                  const blob = new Blob([jffContent], { type: 'application/xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'regex.jff';
                  a.click();
                  URL.revokeObjectURL(url);
                  setOpenMenu(null);
                }}
              >
                Export JFF File
              </div>
            </div>
          )}
        </div>
        <div className="menu-item">
          <button
            className="menu-button"
            
            onClick={() => {
              const w = window.open('/tutorials', '_blank');
              if (w) {
                w.focus();
              }}}
          >Help</button>
        </div>
        

      </div>
      <div className='editor-tab'
      >Regex Editor</div>
      <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 900 }}>
          <h3>Regular Expression</h3>
          <div>
            <input
            type="text"
            value={regex}
            onChange={(e) => setRegularExpression(e.target.value)}
            placeholder="Enter Regular Expression"
            style={{ padding: '10px 12px', width: '60%', borderRadius: 6, border: '1px solid #e5e7eb' }}
            />
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
      
      
      </div>
    )

}
export default Regex