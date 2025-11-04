import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
        <NavigationBar />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 font-sans">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
            <h1 className="text-5xl font-bold tracking-tight leading-tight text-slate-900">
                Build, Simulate, and Visualize <br />
                <span className="text-blue-800">Automata & Grammars</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-md">
                WebFlap is a modern, browser-based platform for exploring formal
                languages — design DFAs, NFAs, PDAs, grammars, and Turing machines
                directly in your browser.
            </p>
            <div className="flex gap-4 mt-6">
                <Link
                to="#"
                className="bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-950 transition-colors shadow-sm"
                >
                Get Started
                </Link>
                <Link
                to="#"
                className="border border-slate-300 px-6 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                Learn More
                </Link>
            </div>
            </div>

            <div className="flex-1">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-white border border-slate-200 hover:scale-105 transform transition-transform duration-300">
                <img
                src=""
                alt="Automata preview"
                className="w-full h-full object-cover opacity-90"
                />
            </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 py-24">
            <h2 className="text-3xl font-semibold text-center mb-12">
            What You Can Do with WebFlap
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
            {[
                {
                title: "Visual Automata Builder",
                desc: "Create and test DFAs, NFAs, PDAs, and Turing Machines with an intuitive drag-and-drop interface.",
                icon: "⚙️",
                },
                {
                title: "Grammar & Parsing Tools",
                desc: "Design context-free grammars, generate derivation trees, and visualize parsing steps interactively.",
                icon: "📜",
                },
                {
                title: "Modern & Collaborative",
                desc: "All in your browser — no installs required. Fast, responsive, and ready for classrooms or solo projects.",
                icon: "🌐",
                },
            ].map((f) => (
                <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm p-6 transition-transform duration-300 hover:scale-105 hover:shadow-md"
                >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
                </div>
            ))}
            </div>
        </section>

        {/* Call to Action */}
        <section className="bg-blue-900 text-white py-20">
            <div className="max-w-5xl mx-auto text-center px-6">
            <h2 className="text-3xl font-semibold mb-4">
                Start Building Automata in Seconds
            </h2>
            <p className="text-blue-100 mb-8">
                No setup. No downloads. WebFlap brings computational models straight
                to your browser.
            </p>
            <Link
                to="#"
                className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors"
            >
                Launch WebFlap
            </Link>
            </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center text-slate-500 text-sm">
            WebFlap — Built for Computer Science learners
        </footer>
        </main>
    </div>
    
  );
}
