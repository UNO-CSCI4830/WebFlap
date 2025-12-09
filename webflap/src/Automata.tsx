import { useState, useEffect, useRef } from "react";
import "./Automata.css";
import NavigationBar from "./NavigationBar";

let allPlacedTransitions: {from: string, to: string, label: string}[] = [];
// Simple state interface
export interface State {
  id: string;
  x: number;
  y: number;
  initial?: boolean;
  final?: boolean;
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


   //Adds a new state at the given coordinates
  addState(x: number, y: number, initial: boolean = false) {
    this.states = [...this.states, { id: `q${this.nextId}`, x, y, initial }];
    this.nextId++;
  }

  //Marks a state as initial (and unmarks all others)
  setInitialState(stateId: string) {
    this.states = this.states.map(s => ({
      ...s,
      initial: s.id === stateId
    }));
  }

  //Toggles a state as final
  setFinalState(stateId: string) {
    this.states = this.states.map(s => 
      s.id === stateId ? { ...s, final: !s.final } : s
    );
  }

  //Adds a transition between two states
  addTransition(from: string, to: string, label: string) {
    this.transitions = [...this.transitions, { from, to, label }];
    allPlacedTransitions.push({ from, to, label });
  }

  //Deletes a state and all its connected transitions
  deleteState(stateId: string) {
    this.states = this.states.filter((s) => s.id !== stateId);
    this.transitions = this.transitions.filter(
      (t) => t.from !== stateId && t.to !== stateId
    );
    // Remove transitions from allPlacedTransitions
    allPlacedTransitions = allPlacedTransitions.filter(
      (t) => t.from !== stateId && t.to !== stateId
    );
  }

  //Finds a state at the given coordinates
  getStateAt(x: number, y: number): State | null {
    return this.states.find((s) => {
      const dist = Math.sqrt((s.x - x) ** 2 + (s.y - y) ** 2);
      return dist <= 30;
    }) || null;
  }

  //Helper to generate a unique key for transitions
  getTransitionKey(from: string, to: string): string {
    return `${from}->${to}`;
  }

  //Creates a deep copy of the automaton
  clone(): Automaton {
    return new Automaton(this.states, this.transitions, this.nextId);
  }

  //Returns a string representation of the automaton
  toString(): string {
    const stateIds = this.states.map(s => s.id).join(', ');
    const transitionStrings = this.transitions.map(t => 
      `${t.from} --${t.label}--> ${t.to}`
    ).join('\n');
    return `States: ${stateIds}\nTransitions:\n${transitionStrings || '(none)'}`;
  }
}

// Helper class for transition operations
export class TransitionHelper {
  // Groups transitions by their from->to pair
  groupTransitions(transitions: Transition[]): Map<string, string[]> {
    const grouped = new Map<string, string[]>();
    transitions.forEach((t) => {
      const key = `${t.from}->${t.to}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(t.label);
    });
    return grouped;
  }

  // Finds a state by its ID
  findStateById(states: State[], id: string): State | null {
    return states.find((s) => s.id === id) || null;
  }

  // Parses a transition key into from and to IDs
  parseTransitionKey(key: string): { from: string; to: string } {
    const [from, to] = key.split('->');
    return { from, to };
  }

  // Checks if a transition is a self-loop
  isSelfLoop(fromId: string, toId: string): boolean {
    return fromId === toId;
  }
}

function Automata() {
  // Track which menu is open
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Automaton data with undo/redo history
  const [automaton, setAutomaton] = useState(new Automaton());
  const [history, setHistory] = useState<Automaton[]>([new Automaton()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const { states, transitions } = automaton;

  // Update automaton and push to history
  const updateAutomaton = (newAutomaton: Automaton) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAutomaton);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setAutomaton(newAutomaton);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAutomaton(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAutomaton(history[historyIndex + 1]);
    }
  };

  // Track which tool is selected
  const [selectedTool, setSelectedTool] = useState<string>("");

  // Transition dragging
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const [dragTo, setDragTo] = useState<{ x: number; y: number } | null>(null);

  // State dragging (for select tool)
  const [draggingState, setDraggingState] = useState<string | null>(null);

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
    const helper = new TransitionHelper();
    const groupedTransitions = helper.groupTransitions(transitions);

    // Draw transitions
    groupedTransitions.forEach((labels, key) => {
      const { from: fromId, to: toId } = helper.parseTransitionKey(key);
      const from = helper.findStateById(states, fromId);
      const to = helper.findStateById(states, toId);
      if (!from || !to) return;

      if (helper.isSelfLoop(fromId, toId)) {
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
      const from = helper.findStateById(states, dragFrom);
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
      // Draw initial state triangle indicator
      if (state.initial) {
        ctx.beginPath();
        ctx.fillStyle = "#2563eb";
        // Triangle pointing from left into the state
        const triangleSize = 15;
        const triangleX = state.x - 50;
        const triangleY = state.y;
        ctx.moveTo(triangleX - triangleSize, triangleY - triangleSize);
        ctx.lineTo(triangleX - triangleSize, triangleY + triangleSize);
        ctx.lineTo(triangleX, triangleY);
        ctx.closePath();
        ctx.fill();
        
        // Draw line from triangle to state
        ctx.beginPath();
        ctx.moveTo(triangleX, triangleY);
        ctx.lineTo(state.x - 30, state.y);
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(state.x, state.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = "#fef3c7";
      ctx.fill();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw double circle for final states
      if (state.final) {
        ctx.beginPath();
        ctx.arc(state.x, state.y, 24, 0, Math.PI * 2);
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

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
      updateAutomaton(newAutomaton);
    } else if (selectedTool === "transition") {
      const state = automaton.getStateAt(x, y);
      if (state) {
        setDragFrom(state.id);
        setDragTo({ x, y });

      }

    } else if (selectedTool === "delete") {
      const state = automaton.getStateAt(x, y);
      if (state) {
        const newAutomaton = automaton.clone();
        newAutomaton.deleteState(state.id);
        updateAutomaton(newAutomaton);
      }
    } else if (selectedTool === "select") {
      const state = automaton.getStateAt(x, y);
      if (state) {
        setDraggingState(state.id);
      }
    }
    else if (selectedTool === "initial"){
      const state = automaton.getStateAt(x, y);
      if (state) {
        const newAutomaton = automaton.clone();
        newAutomaton.setInitialState(state.id);
        updateAutomaton(newAutomaton);
      }
    }
    else if (selectedTool === "final"){
      const state = automaton.getStateAt(x, y);
      if (state) {
        const newAutomaton = automaton.clone();
        newAutomaton.setFinalState(state.id);
        updateAutomaton(newAutomaton);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dragFrom) {
      setDragTo({ x, y });
    } else if (draggingState) {
      // Move state position directly (no history until mouse up)
      automaton.states = automaton.states.map((s) =>
        s.id === draggingState ? { ...s, x, y } : s
      );
      setAutomaton(automaton.clone());
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Finish state dragging and save to history
    if (draggingState) {
      updateAutomaton(automaton.clone());
      setDraggingState(null);
      return;
    }

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
        updateAutomaton(newAutomaton);
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
              <div 
              className="menu-option">Multiple Run</div>
          <div
            className="menu-option"
            onClick={() => {
              const input = prompt("Enter input string:");
              if (input !== null) {
                //this finds initial state
                  let currentStates = automaton.states.filter(s => s.initial).map(s => s.id);
                  // Process each symbol in the input
                  for (const symbol of input) {
                    const nextStates = new Set<string>();
                    automaton.transitions.forEach(t => {
                      // Check if transition is valid from any of the current states
                      if (currentStates.includes(t.from) && t.label === symbol) {
                        nextStates.add(t.to);
                      }
                    });
                    // Move to next set of states
                    currentStates = Array.from(nextStates);
                  }
                  // Check if any of the current states is a final state
                  const isAccepted = currentStates.length > 0 && currentStates.some(sId => {
                    const state = automaton.states.find(s => s.id === sId);
                    return state?.final;
                  });
                  
                  if (isAccepted) {
                    alert(`Input "${input}" is accepted.`);
                  } else {
                    alert(`Input "${input}" is rejected.`);
                  }
                  
                
              }
            }}
          >
            Fast Run
          </div>

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
              selectedTool === "initial" ? "active" : ""
            }`}
            title="Mark State as Initial"
            onClick={() => setSelectedTool("initial")}
          >
            ⓘ
          </button>
          <button
            className={`tool-button ${
              selectedTool === "final" ? "active" : ""
            }`}
            title="Toggle State as Final"
            onClick={() => setSelectedTool("final")}
          >
            ⓕ
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
          <button className="tool-button" title="Undo" onClick={undo}>
            ↶
          </button>
          <button className="tool-button" title="Redo" onClick={redo}>
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
