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
                    <span className="text-blue-800">Automata, Grammars, <br /></span>
                    <span className="text-blue-800">& Regex</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-md">
                    WebFlap is a modern, browser-based platform for exploring formal
                    languages. Design DFAs, NFAs, grammars, and regular expressions
                    directly in your browser.
                </p>
                <div className="flex gap-4 mt-6">
                    <Link
                    to="/new"
                    className="bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-950 transition-colors shadow-sm"
                    >
                    Get Started
                    </Link>
                    <Link
                    to="/features"
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
                    className="w-full h-full object-cover opacity-90"
                    />
                </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <h2 className="text-4xl font-semibold text-center mb-12 text-slate-900">
                What You Can Do with WebFlap
                </h2>
                <div className="grid md:grid-cols-3 gap-10">
                {[
                    {
                    title: "Automata Builder",
                    desc: "Create and simulate DFAs and NFAs with an intuitive drag-and-drop interface. Define states, transitions, and test input strings instantly."
                    },
                    {
                    title: "Grammar & Regex Tools",
                    desc: "Design grammars and regular expressions with ease. Convert into automata and visualize the structure of formal languages effortlessly."
                    },
                    {
                    title: "Modern & Accessible",
                    desc: "All in your browser — no extra installs required. Fast, responsive, and ready for classrooms or solo projects."
                    },
                ].map((f) => (
                    <div
                    key={f.title}
                    className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm p-6 transition-transform duration-300 hover:scale-105 hover:shadow-md"
                    >
                    <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                    <p className="text-slate-600">{f.desc}</p>
                    </div>
                ))}
                </div>
            </section>

            {/* Tutorials Section */}
            <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-semibold mb-6 text-slate-900">
                    Learn as You Build
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mb-14">
                    New to automata theory or just want a quick refresher?  
                    Explore interactive tutorials on DFAs, NFAs, grammars, and regular expressions. 
                    </p>

                    <div className="grid sm:grid-cols-3 gap-8 mb-14">
                        {[
                            {
                            title: "Designing & Building",
                            desc: "Learn to create DFAs and NFAs from scratch with guided visual examples.",
                            },
                            {
                            title: "Converting Forms",
                            desc: "Master transformations between automata, grammars, and regular expressions.",
                            },
                            {
                            title: "Testing",
                            desc: "Simulate input strings, debug automata, and verify grammar outputs with live feedback.",
                            },
                        ].map((item) => (
                            <div
                            key={item.title}
                            className="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-6 flex flex-col text-left space-y-3">
                                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                                    {item.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm flex-grow">{item.desc}</p>
                                    <Link
                                    to="/tutorials"
                                    className="text-blue-700 font-medium hover:text-blue-900 transition-colors mt-2 inline-flex items-center gap-1"
                                    >
                                    Explore Tutorial
                                    <span className="transition-transform group-hover:translate-x-1">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16">
                    <Link
                        to="/tutorials"
                        className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-950 transition-colors shadow-sm"
                    >
                        Browse All Tutorials
                    </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-900 text-white py-20">
                <div className="max-w-5xl mx-auto text-center px-6">
                    <h2 className="text-3xl font-semibold mb-4">
                        Start Building Formal Languages in Seconds
                    </h2>
                    <p className="text-blue-100 mb-8">
                        No setup. No downloads. WebFlap brings computational models straight
                        to your browser.
                    </p>
                    <Link
                        to="/new"
                        className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        Launch WebFlap
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 text-center text-slate-500 text-sm">
                WebFlap — Empowering Computer Science Education
            </footer>
        </main>
    </div>

  );
}
