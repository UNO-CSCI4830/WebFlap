import { useState, useEffect, useRef, use } from "react";
import { useLocation } from "react-router-dom";
import "./Automata.css";
import NavigationBar from "./NavigationBar";
import type { ParsedAutomaton } from "./jffParser";


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
export function simulateAutomaton(automaton: Automaton, input: string): boolean {
  // Find initial state(s)
  function epsilonClosure(states: string[]): string[] {
    const closure = new Set<string>(states);
    const stack = [...states];
    
    while (stack.length > 0) {
      const state = stack.pop()!;
      
      // Find all epsilon transitions from this state
      automaton.transitions.forEach(t => {
        if (t.from === state && (t.label === '' || t.label === 'ε' )) {
          if (!closure.has(t.to)) {
            closure.add(t.to);
            stack.push(t.to);
          }
        }
      });
    }
    return Array.from(closure);
  }
  let initialStates = automaton.states
    .filter(s => s.initial)
    .map(s => s.id);
  let currentStates = epsilonClosure(initialStates);

  // Process each symbol in the input
  for (const symbol of input) {
    const nextStates = new Set<string>();
    
    automaton.transitions.forEach(t => {
      if (currentStates.includes(t.from) && t.label === symbol) {
        nextStates.add(t.to);
      }
    });
    
    currentStates = epsilonClosure(Array.from(nextStates));
  }

  // Check if any current state is a final state
  return currentStates.length > 0 && currentStates.some(sId => {
    const state = automaton.states.find(s => s.id === sId);
    return state?.final;
  });
}

// Comment interface - text annotations on the canvas
export interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
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


   //Adds a new state at the given coordinates (reuses lowest available ID)
  addState(x: number, y: number, initial: boolean = false) {
    // Find the lowest available state number
    const usedNumbers = this.states.map(s => parseInt(s.id.substring(1)));
    let newId = 0;
    while (usedNumbers.includes(newId)) {
      newId++;
    }
    this.states = [...this.states, { id: `q${newId}`, x, y, initial }];
    this.nextId = Math.max(this.nextId, newId + 1);
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

  //Deletes a specific transition by from, to, and label
  deleteTransition(from: string, to: string, label: string) {
    this.transitions = this.transitions.filter(
      (t) => !(t.from === from && t.to === to && t.label === label)
    );
    // Remove from allPlacedTransitions too
    allPlacedTransitions = allPlacedTransitions.filter(
      (t) => !(t.from === from && t.to === to && t.label === label)
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

export function Automata() {
  const location = useLocation();
  const imported = (location.state?.automaton as ParsedAutomaton) ?? null;
  // Track which menu is open
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Automaton data with undo/redo history
  const [automaton, setAutomaton] = useState(() => {
    if (!imported) return new Automaton();
  
    const states = imported.states.map(s => ({
      id: s.name,          // use name as ID for display
      x: s.x,
      y: s.y,
      initial: s.initial,
      final: s.final,
    }));
  
    const transitions = imported.transitions.map(t => ({
      from: imported.states.find(s => s.id === t.from)!.name,
      to: imported.states.find(s => s.id === t.to)!.name,
      label: t.read,
    }));
  
    return new Automaton(states, transitions, states.length);
  });
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
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);

  // Transition dragging
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const [dragTo, setDragTo] = useState<{ x: number; y: number } | null>(null);

  // State dragging (for select tool)
  const [draggingState, setDraggingState] = useState<string | null>(null);

  // Comments on canvas
  const [comments, setComments] = useState<Comment[]>([]);
  const [draggingComment, setDraggingComment] = useState<string | null>(null);
  const commentIdRef = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper to find comment at position
  const getCommentAt = (x: number, y: number): Comment | null => {
    return comments.find((c) => Math.abs(c.x - x) < 50 && Math.abs(c.y - y) < 15) || null;
  };

  // Helper to find transition at click position
  const getTransitionAt = (x: number, y: number): Transition | null => {
    // Check if reverse transition exists for bidirectional detection
    const hasReverse = (fromId: string, toId: string) => {
      return transitions.some(tr => tr.from === toId && tr.to === fromId);
    };
    
    for (const t of transitions) {
      const from = states.find((s) => s.id === t.from);
      const to = states.find((s) => s.id === t.to);
      if (!from || !to) continue;

      // Check if self-loop (label is above the state)
      if (t.from === t.to) {
        const labelX = from.x;
        const labelY = from.y - 75;
        if (Math.abs(x - labelX) < 30 && Math.abs(y - labelY) < 20) {
          return t;
        }
      } else {
        // Regular transition - check near the label position
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const startX = from.x + 30 * Math.cos(angle);
        const startY = from.y + 30 * Math.sin(angle);
        const endX = to.x - 30 * Math.cos(angle);
        const endY = to.y - 30 * Math.sin(angle);
        
        // Account for curve offset if bidirectional
        const hasBidirectional = hasReverse(t.from, t.to);
        const curveOffset = hasBidirectional ? 20 : 0;
        const perpX = -Math.sin(angle) * curveOffset;
        const perpY = Math.cos(angle) * curveOffset;
        const midX = (startX + endX) / 2 + perpX;
        const midY = (startY + endY) / 2 + perpY - 10;
        
        if (Math.abs(x - midX) < 30 && Math.abs(y - midY) < 20) {
          return t;
        }
      }
    }
    return null;
  };

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

        // Check if there's a reverse transition (bidirectional)
        const reverseKey = `${toId}->${fromId}`;
        const hasBidirectional = groupedTransitions.has(reverseKey);
        
        // Curve offset for bidirectional arrows
        const curveOffset = hasBidirectional ? 20 : 0;
        const perpX = -Math.sin(angle) * curveOffset;
        const perpY = Math.cos(angle) * curveOffset;
        const ctrlX = (startX + endX) / 2 + perpX;
        const ctrlY = (startY + endY) / 2 + perpY;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        if (hasBidirectional) {
          // Draw curved line for bidirectional
          ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
        } else {
          ctx.lineTo(endX, endY);
        }
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Arrowhead (adjust angle for curved arrow)
        const headlen = 15;
        const arrowAngle = hasBidirectional 
          ? Math.atan2(endY - ctrlY, endX - ctrlX) 
          : angle;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headlen * Math.cos(arrowAngle - Math.PI / 6),
          endY - headlen * Math.sin(arrowAngle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headlen * Math.cos(arrowAngle + Math.PI / 6),
          endY - headlen * Math.sin(arrowAngle + Math.PI / 6)
        );
        ctx.stroke();

        // Draw labels at midpoint (or curve peak for bidirectional)
        const midX = hasBidirectional ? ctrlX : (startX + endX) / 2;
        const midY = hasBidirectional ? ctrlY : (startY + endY) / 2;
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

    // Draw comments -> really easy to alter if you guys want different fonts.
    comments.forEach((comment) => {
      ctx.fillStyle = "#6b7280";
      ctx.font = "14px Arial";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(comment.text, comment.x, comment.y);
    });
  }, [states, transitions, dragFrom, dragTo, comments]);

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
      // First check if clicking on a state
      const state = automaton.getStateAt(x, y);
      if (state) {
        const newAutomaton = automaton.clone();
        newAutomaton.deleteState(state.id);
        updateAutomaton(newAutomaton);
        return;
      }
      // Check if clicking on a transition label
      const transition = getTransitionAt(x, y);
      if (transition) {
        const newAutomaton = automaton.clone();
        newAutomaton.deleteTransition(transition.from, transition.to, transition.label);
        updateAutomaton(newAutomaton);
        return;
      }
      // Check if clicking on a comment
      const comment = getCommentAt(x, y);
      if (comment) {
        setComments(comments.filter((c) => c.id !== comment.id));
      }
    } else if (selectedTool === "select") {
      const comment = getCommentAt(x, y);
      if (comment) {
        setDraggingComment(comment.id);
        return;
      }
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
    else if (selectedTool === "comment") {
      const text = prompt("Enter comment:");
      if (text) {
        setComments([...comments, { id: `c${commentIdRef.current++}`, x, y, text }]);
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
    } else if (draggingComment) {
      setComments(comments.map((c) => c.id === draggingComment ? { ...c, x, y } : c));
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Finish state dragging and save to history
    if (draggingState) {
      updateAutomaton(automaton.clone());
      setDraggingState(null);
      return;
    }
    if (draggingComment) {
      setDraggingComment(null);
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
              
          <div
            className="menu-option"
            onClick={() => {
  const input = prompt("Enter input string:");
  if (input !== null) {
    const isAccepted = simulateAutomaton(automaton, input);
    
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
            Test for Nondeterminism
          </button>
          {openMenu === "test" && (
            <div className="dropdown-menu">
              <div className="menu-option"
              onClick={() => {
                let isNonDeterministic = false;
                for (const i of allPlacedTransitions) {
                  const matchingTransitions = automaton.transitions.filter(t =>
                    t.from === i.from &&  t.label === i.label
                  );
                  if (matchingTransitions.length > 1) {
                    isNonDeterministic = true;
                    break;
                  }
                  if (i.label === 'ε') {
                    isNonDeterministic = true;
                    break;
                  }
                }
                if (isNonDeterministic) {
                  alert("The automaton is Non-Deterministic.");
                } else {
                  alert("The automaton is Deterministic.");
                }

              }
              }
              >Check for Non-Determinism</div>
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
              }

            }
          }

          >
            Help
          </button>
        </div>
      </div>

      {/* Editor section with canvas */}
      <div className="editor-section">
        <div className="editor-tab">Automata Editor</div>

        {/* Toolbar - can be collapsed to save space, selected tool stays active */}
        {toolbarCollapsed ? (
          <div className="toolbar toolbar-collapsed">
            <button
              className="tool-button toggle-btn"
              title="Show Tools"
              onClick={() => setToolbarCollapsed(false)}
            >
              ∨
            </button>
          </div>
        ) : (
          <div className="toolbar">
            <button
              className={`tool-button ${selectedTool === "select" ? "active" : ""}`}
              title="Select"
              onClick={() => setSelectedTool("select")}
            >
              ➤
            </button>
            <button
              className={`tool-button ${selectedTool === "state" ? "active" : ""}`}
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
              className={`tool-button ${selectedTool === "transition" ? "active" : ""}`}
              title="Add Transition"
              onClick={() => setSelectedTool("transition")}
            >
              →
            </button>
            <button
              className={`tool-button ${selectedTool === "delete" ? "active" : ""}`}
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
            <button
              className={`tool-button ${selectedTool === "comment" ? "active" : ""}`}
              title="Add Comment"
              onClick={() => setSelectedTool("comment")}
            >
              💬
            </button>
            {/* Collapse button - hides toolbar to give more canvas space */}
            <button
              className="tool-button toggle-btn"
              title="Hide Tools"
              onClick={() => setToolbarCollapsed(true)}
            >
              ∧
            </button>
            
        </div>
        )}

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
