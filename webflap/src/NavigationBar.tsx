import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NavigationBar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Tutorials", path: "/tutorials" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white shadow-sm border-b border-slate-200">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight text-slate-900 hover:text-blue-900 transition-colors"
        >
          WebFlap
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-blue-900"
                  : "text-slate-600 hover:text-blue-800"
              } after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-blue-900 after:left-0 after:-bottom-1 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left ${
                location.pathname === link.path ? "after:scale-x-100" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/new"
            className="bg-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-950 transition-colors shadow-sm"
          >
            New Project
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-slate-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 sm:hidden">
            <div className="flex flex-col items-start p-4 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`w-full text-base font-medium ${
                    location.pathname === link.path
                      ? "text-blue-900"
                      : "text-slate-700 hover:text-blue-800"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/new"
                className="w-full bg-blue-900 text-white text-center py-2 rounded-lg hover:bg-blue-950 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                New Project
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
