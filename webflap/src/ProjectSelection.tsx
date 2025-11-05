import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";

export default function ProjectSelection() {
  return (
    <div>
      <NavigationBar />
      <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-900 font-sans flex justify-between">
        <section className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-4xl font-bold text-center">New Project</h1>
          <p className="text-center text-slate-600 mb-12 mt-4">
            Select a project type to get started:
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Grammars",
                description: "Create and analyze formal grammars.",
                link: "/projects/grammars",
              },
              {
                name: "Automata",
                description: "Design and simulate finite automata.",
                link: "/projects/automata",
              },
              {
                name: "Etc",
                description: "Hi.",
                link: "",
              },
            ].map((project) => (
              <Link
                to={project.link}
                key={project.name}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-slate-200 hover:border-blue-800 transition-colors"
              >
                <h2 className="text-2xl font-semibold mb-2">{project.name}</h2>
                <p className="text-slate-600">{project.description}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-4xl font-bold text-center">Open Project</h1>
          <p className="text-center text-slate-600 mt-4">
            Load an existing project from your device:
          </p>
          <div className="max-w-4xl mx-auto px-6 py-12">
            <form className="flex flex-col md:flex-row items-center gap-4">
              <input
                type="file"
                accept=".json"
                className="border border-slate-300 rounded px-4 py-2 w-full md:w-auto"
              />
              <button
                type="submit"
                className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Open Project
              </button>
            </form>
          </div>
        </section>
        <section className=""></section>
      </main>
    </div>
  );
}
