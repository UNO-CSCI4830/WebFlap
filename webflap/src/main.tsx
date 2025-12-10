import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Home.tsx";
import Grammars from "./Grammars.tsx";
import BruteForceParse from "./BruteForceParse";
import Automata from "./Automata.tsx";
import ProjectSelection from "./ProjectSelection.tsx";
import Features from "./Features.tsx";
import Tutorials from "./Tutorials.tsx";
import MultipleBruteForceParse from "./MultipleBruteForce.tsx";
import Regex from "./Regex.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grammars" element={<Grammars />} />
        <Route path="/bruteforce" element={<BruteForceParse />} />
        <Route path="/multiplebruteforce" element={<MultipleBruteForceParse />} />
        <Route path="/automata" element={<Automata />} />
        <Route path="/new" element={<ProjectSelection />} />
        <Route path="/features" element={<Features />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/regex" element={<Regex />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
