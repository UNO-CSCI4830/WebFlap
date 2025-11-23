import { useState, useEffect, useRef } from "react";
import "./Automata.css";
import NavigationBar from "./NavigationBar";


// Simple state interface
export interface State {
  id: string;
  x: number;
  y: number;
}

// Transition interface
export interface Transition {
  from: string;
  to: string;
  label: string;
}

export class Automaton {
  states: State[];
  transitions: Transition[];
  private nextId: number;

  constructor(states: State[] = [], transitions: Transition[] = [], nextId: number = 0) {
    this.states = states;
    this.transitions = transitions;
    this.nextId = nextId;
  }

  /**
   * Adds a new state at the given coordinates
   */
  addState(x: number, y: number) {
    this.states = [...this.states, { id: `q${this.nextId}`, x, y }];
    this.nextId++;
  }

  /**
   * Adds a transition between two states
   */
  addTransition(from: string, to: string, label: string) {
    this.transitions = [...this.transitions, { from, to, label }];
  }

  /**
   * Finds a state at the given coordinates
   */
  getStateAt(x: number, y: number): State | null {
    return this.states.find((s) => {
      const dist = Math.sqrt((s.x - x) ** 2 + (s.y - y) ** 2);
      return dist <= 30;
    }) || null;
  }

  /**
   * Helper to generate a unique key for transitions
   */
  getTransitionKey(from: string, to: string): string {
    return `${from}->${to}`;
  }

  /**
   * Creates a deep copy of the automaton
   */
  clone(): Automaton {
    return new Automaton(this.states, this.transitions, this.nextId);
  }
}

function Automata() {
  // Track which menu is open
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Automaton data
  const [automaton, setAutomaton] = useState(new Automaton());
  const { states, transitions } = automaton;

  // Track which tool is selected
  const [selectedTool, setSelectedTool] = useState<string>("");

  // Transition dragging
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const [dragTo, setDragTo] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest(".menu-bar")) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Draw everything on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Group transitions by from-to pair
    const groupedTransitions = new Map<string, string[]>();
    transitions.forEach((t) => {
      const key = `${t.from}->${t.to}`;
      if (!groupedTransitions.has(key)) {
        groupedTransitions.set(key, []);
      }
      groupedTransitions.get(key)!.push(t.label);
    });

    // Draw transitions
    groupedTransitions.forEach((labels, key) => {
      const [fromId, toId] = key.split('->');
      const from = states.find((s) => s.id === fromId);
      const to = states.find((s) => s.id === toId);
      if (!from || !to) return;

      if (from.id === to.id) {
        // Self-loop
        ctx.beginPath();
        ctx.arc(from.x, from.y - 45, 20, 0, Math.PI * 2);
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        
        // Draw labels stacked vertically (newest on top)
        labels.forEach((lbl, i) => {
          ctx.fillText(lbl, from.x, from.y - 75 - i * 16);
        });
      } else {
        // Arrow between states
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const startX = from.x + 30 * Math.cos(angle);
        const startY = from.y + 30 * Math.sin(angle);
        const endX = to.x - 30 * Math.cos(angle);
        const endY = to.y - 30 * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Arrowhead
        const headlen = 15;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headlen * Math.cos(angle - Math.PI / 6),
          endY - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headlen * Math.cos(angle + Math.PI / 6),
          endY - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();

        // Draw labels stacked vertically (newest on top)
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        
        labels.forEach((lbl, i) => {
          ctx.fillText(lbl, midX, midY - 10 - i * 16);
        });
      }
    });

    // Draw drag preview
    if (dragFrom && dragTo) {
      const from = states.find((s) => s.id === dragFrom);
      if (from) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(dragTo.x, dragTo.y);
        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw states
    states.forEach((state) => {
      ctx.beginPath();
      ctx.arc(state.x, state.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = "#fef3c7";
      ctx.fill();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(state.id, state.x, state.y);
    });
  }, [states, transitions, dragFrom, dragTo]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === "state") {
      const newAutomaton = automaton.clone();
      newAutomaton.addState(x, y);
      setAutomaton(newAutomaton);
    } else if (selectedTool === "transition") {
      const state = automaton.getStateAt(x, y);
      if (state) {
        setDragFrom(state.id);
        setDragTo({ x, y });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragFrom) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragTo({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragFrom) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const toState = automaton.getStateAt(x, y);

    if (toState) {
      const label = prompt("Enter transition label:");
      if (label !== null) {
        const newAutomaton = automaton.clone();
        newAutomaton.addTransition(dragFrom, toState.id, label || "ε");
        setAutomaton(newAutomaton);
      }
    }

    setDragFrom(null);
    setDragTo(null);
  };

  return (
    <div className="jflap-container">
      {/* Title bar */}
      <NavigationBar />

      {/* Menu bar */}
      <div className="menu-bar">
        <div className="menu-item">
          <button
            className="menu-button"
            onClick={() => setOpenMenu(openMenu === "file" ? null : "file")}
          >
            File
          </button>
          {openMenu === "file" && (
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
            onClick={() => setOpenMenu(openMenu === "input" ? null : "input")}
          >
            Input
          </button>
          {openMenu === "input" && (
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
            onClick={() => setOpenMenu(openMenu === "test" ? null : "test")}
          >
            Test
          </button>
          {openMenu === "test" && (
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
            onClick={() => setOpenMenu(openMenu === "view" ? null : "view")}
          >
            View
          </button>
          {openMenu === "view" && (
            <div className="dropdown-menu">
              <div className="menu-option">Save Current Graph Layout</div>
              <div className="menu-option">Restore Saved Graph Layout</div>
              <div className="menu-option">Move Vertices</div>
              <div className="menu-option">Apply A Random Layout Algorithm</div>
              <div className="menu-option">
                Apply A Specific Layout Algorithm
              </div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button
            className="menu-button"
            onClick={() =>
              setOpenMenu(openMenu === "convert" ? null : "convert")
            }
          >
            Convert
          </button>
          {openMenu === "convert" && (
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
            onClick={() => setOpenMenu(openMenu === "help" ? null : "help")}
          >
            Help
          </button>
          {openMenu === "help" && (
            <div className="dropdown-menu">
              <div className="menu-option">Help...</div>
              <div className="menu-option">About...</div>
            </div>
          )}
        </div>
      </div>

      {/* Editor section with canvas */}
      <div className="editor-section">
        <div className="editor-tab">Automata Editor</div>

        {/* Toolbar with 6 buttons */}
        <div className="toolbar">
          <button
            className={`tool-button ${
              selectedTool === "select" ? "active" : ""
            }`}
            title="Select"
            onClick={() => setSelectedTool("select")}
          >
            ➤
          </button>
          <button
            className={`tool-button ${
              selectedTool === "state" ? "active" : ""
            }`}
            title="Add State"
            onClick={() => setSelectedTool("state")}
          >
            ⓠ
          </button>
          <button
            className={`tool-button ${
              selectedTool === "transition" ? "active" : ""
            }`}
            title="Add Transition"
            onClick={() => setSelectedTool("transition")}
          >
            →
          </button>
          <button
            className={`tool-button ${
              selectedTool === "delete" ? "active" : ""
            }`}
            title="Delete"
            onClick={() => setSelectedTool("delete")}
          >
            ☠
          </button>
          <button className="tool-button" title="Undo">
            ↶
          </button>
          <button className="tool-button" title="Redo">
            ↷
          </button>
        </div>

        {/* Canvas for drawing automata */}
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            id="automaton-canvas"
            width="1200"
            height="700"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
        </div>
      </div>
    </div>
  );
}

export default Automata;
