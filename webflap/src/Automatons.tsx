import { useState, useEffect } from 'react';
import './Automatons.css';

function Automatons() {
  // Track which menu is open
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest('.menu-bar')) {
        setOpenMenu(null);
        setOpenSubmenu(null);
      }
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="jflap-container">
      {/* Title bar */}
      <div className="jflap-title-bar">
        <span>WebFlap: Automatons</span>
      </div>
      
      {/* Menu bar */}
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
              <div className="menu-option">New...</div>
              <div className="menu-option">Open...</div>
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
              <div className="menu-option">Step with Closure...</div>
              <div className="menu-option">Step by State...</div>
              <div className="menu-option">Fast Run...</div>
              <div className="menu-option">Multiple Run</div>
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
              <div className="menu-option">Compare Equivalence</div>
              <div className="menu-option">Highlight Nondeterminism</div>
              <div className="menu-option">Highlight λ-Transitions</div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button 
            className="menu-button"
            onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
          >
            View
          </button>
          {openMenu === 'view' && (
            <div className="dropdown-menu">
              <div className="menu-option">Save Current Graph Layout</div>
              <div className="menu-option">Restore Saved Graph Layout</div>
              <div className="menu-option">Move Vertices</div>
              <div className="menu-option">Apply A Random Layout Algorithm</div>
              <div className="menu-option">Apply A Specific Layout Algorithm</div>
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
              <div className="menu-option">Convert to DFA</div>
              <div className="menu-option">Minimize DFA</div>
              <div className="menu-option">Convert to Grammar</div>
              <div className="menu-option">Convert FA to RE</div>
              <div className="menu-option">Combine Automata</div>
              <div className="menu-option">Add Trap State to DFA</div>
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
              <div className="menu-option">Help...</div>
              <div className="menu-option">About...</div>
            </div>
          )}
        </div>
      </div>

      {/* Editor section with canvas */}
      <div className="editor-section">
        <div className="editor-tab">Editor</div>
        
        {/* Toolbar with 6 buttons */}
        <div className="toolbar">
          <button className="tool-button" title="Select">
            ➤
          </button>
          <button className="tool-button" title="Add State">
            ⓠ
          </button>
          <button className="tool-button" title="Add Transition">
            →
          </button>
          <button className="tool-button" title="Delete">
            ☠
          </button>
          <button className="tool-button" title="Undo">
            ↶
          </button>
          <button className="tool-button" title="Redo">
            ↷
          </button>
        </div>

        {/* Canvas for drawing automatons */}
        <div className="canvas-container">
          <canvas id="automaton-canvas" width="800" height="600"></canvas>
        </div>
      </div>
    </div>
  );
}

export default Automatons;

