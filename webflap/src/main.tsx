// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import './index.css'
// import App from './App.tsx'
// import Home from './Home.tsx'
// import Grammars from './Grammars.tsx'
// import BruteForceParse from './BruteForceParse'
// import Automatons from './Automatons.tsx'
// import ProjectSelection from './ProjectSelection.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/grammars" element={<Grammars />} />
//         <Route path="/bruteforce" element={<BruteForceParse />} />
//         <Route path="/automatons" element={<Automatons />} />
//         <Route path="/new" element={<ProjectSelection />} />
//       </Routes>
//     </BrowserRouter>
//   </StrictMode>,
// )





import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './Home.tsx'
import Grammars from './Grammars.tsx'
import BruteForceParse from './BruteForceParse'
import Automatons from './Automatons.tsx'
import ProjectSelection from './ProjectSelection.tsx'
import Features from './Features.tsx' // ✅ added Features page

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/grammars" element={<Grammars />} />
        <Route path="/bruteforce" element={<BruteForceParse />} />
        <Route path="/automatons" element={<Automatons />} />
        <Route path="/new" element={<ProjectSelection />} />
        <Route path="/features" element={<Features />} /> {/* ✅ new route */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
