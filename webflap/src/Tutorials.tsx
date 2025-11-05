import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";

export default function Tutorials() {
  return (
    <div>
      <NavigationBar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 font-sans">
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            WebFlap <span className="text-blue-800">Tutorials</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            New to WebFlap or just looking to take full advantage of our app's
            features? Use our tutorials below to learn more, with more to come
            as feature development continues.
          </p>
        </section>

        {/* General Tutorials */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-semibold text-center mb-10">General</h2>
          <div className="grid md:grid-cols-3 gap-20">
            {[
              {
                title: "Starting a New Project",
                desc: "Create a new project from one of our app's modules from scratch.",
              },
              {
                title: "Importing Existing Project",
                desc: "Import a project you already have from a .jff file, which can be obtained either in JFlap or WebFlap.",
              },
              {
                title: "Site Navigation",
                desc: "Learn how to navigate the site and access the full range of functionality.",
              },
            ].map((tutorial) => (
              <Link
                to="/tutorials"
                key={tutorial.title}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-200"
              >
                <h3 className="text-xl font-semibold mb-3">{tutorial.title}</h3>
                <p className="text-slate-600 mb-4 text-sm">{tutorial.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Grammar Tutotials */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-semibold text-center mb-4">Grammars</h2>
          <h3 className="py-8 text-xl text-center">Coming soon...</h3>
        </section>

        {/* Grammar Tutotials */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-semibold text-center mb-4">Automata</h2>
          <h3 className="py-8 text-xl text-center">Coming soon...</h3>
        </section>

        {/* Call to Action */}
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold mb-4">Want to Learn More?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            In case you're looking for help not covered by the site at the
            moment or would like to consult the documentation of the original
            tool on which our site is based, get in contact with a member of the
            team or consult the original JFlap site below.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-950 transition-colors shadow-sm"
            >
              Contact Us
            </Link>
            <Link
              to="https://www.jflap.org/"
              target="_blank"
              className="border border-slate-300 px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Visit JFlap Site
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
