import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";

export default function Features() {
  return (
    <div>
      <NavigationBar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 font-sans">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Powerful Features for <span className="text-blue-800">Computational Theory</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to design, simulate, and understand formal languages and automata theory — all in your browser.
          </p>
        </section>

        {/* Core Models Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-semibold text-center mb-4">
            Computational Models
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Build and simulate the fundamental models of computation
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Finite Automata",
                desc: "Design and simulate Deterministic (DFA) and Non-Deterministic (NFA) Finite Automata with visual state transitions.",
                icon: "🔄",
                features: ["DFA & NFA support", "State minimization", "NFA to DFA conversion", "Visual simulation"]
              },
              {
                title: "Regular Expressions",
                desc: "Create and test regular expressions with instant pattern matching and validation.",
                icon: "🔤",
                features: ["Pattern builder", "Live testing", "Convert to automata", "Syntax highlighting"]
              },
              {
                title: "Context-Free Grammars",
                desc: "Define production rules, generate parse trees, and visualize derivations step by step.",
                icon: "📜",
                features: ["Grammar editor", "Parse tree generation", "Derivation steps", "Ambiguity detection"]
              },
              {
                title: "Turing Machines",
                desc: "Build and execute Turing Machines with complete tape visualization and control.",
                icon: "🤖",
                features: ["Unlimited tape", "Multi-track support", "Step-by-step execution", "Halting detection"]
              }
            ].map((model) => (
              <div
                key={model.title}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-200"
              >
                <div className="text-4xl mb-4">{model.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{model.title}</h3>
                <p className="text-slate-600 mb-4 text-sm">{model.desc}</p>
                <ul className="space-y-2">
                  {model.features.map((feature) => (
                    <li key={feature} className="text-sm text-slate-500 flex items-start gap-2">
                      <span className="text-blue-800 font-bold">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Functionalities Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-white/50">
          <h2 className="text-3xl font-semibold text-center mb-4">
            Built for Learning & Productivity
          </h2>
          <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
            Intuitive tools designed to help students and educators explore computational theory
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Interactive Design Tools",
                desc: "Drag-and-drop interface for building state diagrams. Add states, transitions, and labels with intuitive controls.",
                icon: "✏️",
                color: "blue"
              },
              {
                title: "Step-by-Step Debugging",
                desc: "Walk through each computation step to understand exactly how your automaton processes input strings.",
                icon: "🐛",
                color: "purple"
              },
              {
                title: "Input Testing",
                desc: "Test multiple input strings at once. See which are accepted or rejected, with detailed execution traces.",
                icon: "✅",
                color: "green"
              },
              {
                title: "Save & Load Projects",
                desc: "Never lose your work. Save automata and grammars to your account and continue working anytime, anywhere.",
                icon: "💾",
                color: "orange"
              },
              {
                title: "Learning Support",
                desc: "Built-in tutorials, examples, and tooltips to guide you through complex concepts and operations.",
                icon: "📚",
                color: "pink"
              },
              {
                title: "Export & Share",
                desc: "Export diagrams as images or share project links with classmates and instructors for collaboration.",
                icon: "🔗",
                color: "teal"
              }
            ].map((func) => (
              <div
                key={func.title}
                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{func.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">{func.title}</h3>
                <p className="text-slate-600 leading-relaxed">{func.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white p-12 shadow-xl">
            <h2 className="text-3xl font-semibold mb-6 text-center">
              Why Choose WebFlap?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">No Installation Required</h3>
                    <p className="text-blue-100 text-sm">Works directly in your browser — Chrome, Firefox, Safari, or Edge.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Education-Focused</h3>
                    <p className="text-blue-100 text-sm">Designed specifically for students and instructors of computational theory courses.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Modern & Fast</h3>
                    <p className="text-blue-100 text-sm">Built with cutting-edge web technologies for smooth, responsive performance.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Visual & Intuitive</h3>
                    <p className="text-blue-100 text-sm">See your automata in action with beautiful, interactive visualizations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
                    <p className="text-blue-100 text-sm">Your projects are stored securely, accessible only to you.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-2xl">🆓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Free for Students</h3>
                    <p className="text-blue-100 text-sm">Access all core features at no cost — because learning should be accessible.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to Explore Formal Languages?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Join students and educators worldwide who are using WebFlap to master automata theory and formal languages.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-950 transition-colors shadow-sm"
            >
              Get Started Now
            </Link>
            <Link
              to="#"
              className="border border-slate-300 px-8 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              View Examples
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-200">
          WebFlap — Empowering Computer Science Education
        </footer>
      </main>
    </div>
  );
}
