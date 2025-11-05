import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Home.tsx";
import Grammars from "./Grammars.tsx";
import BruteForceParse from "./BruteForceParse";
import Automata from "./Automata.tsx";
import ProjectSelection from "./ProjectSelection.tsx";
import Features from "./Features.tsx"; // ✅ added Features page

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grammars" element={<Grammars />} />
        <Route path="/bruteforce" element={<BruteForceParse />} />
        <Route path="/automata" element={<Automata />} />
        <Route path="/new" element={<ProjectSelection />} />
        <Route path="/features" element={<Features />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
