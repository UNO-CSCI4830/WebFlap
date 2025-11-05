import { useState, useEffect, useRef } from "react";
import "./Automata.css";

// Simple state interface
interface State {
  id: string;
  x: number;
  y: number;
}

function Automata() {
  // Track which menu is open
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Automaton data
  const [states, setStates] = useState<State[]>([]);
  const [stateCount, setStateCount] = useState(0);

  // Track which tool is selected
  const [selectedTool, setSelectedTool] = useState<string>("");

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

  // Draw states on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each state
    states.forEach((state) => {
      // Draw circle
      ctx.beginPath();
      ctx.arc(state.x, state.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = "#fef3c7";
      ctx.fill();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(state.id, state.x, state.y);
    });
  }, [states]);

  // Click to add state
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only place states if the state tool is selected
    if (selectedTool !== "state") return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new state
    const newState: State = {
      id: `q${stateCount}`,
      x: x,
      y: y,
    };

    setStates([...states, newState]);
    setStateCount(stateCount + 1);
  };

  return (
    <div className="jflap-container">
      {/* Title bar */}
      <div className="jflap-title-bar">
        <span>WebFlap: Automata</span>
      </div>

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
        <div className="editor-tab">Editor</div>

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
            onClick={handleCanvasClick}
          ></canvas>
        </div>
      </div>
    </div>
  );
}

export default Automata;
