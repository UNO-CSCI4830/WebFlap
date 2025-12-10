import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { tutorials, type Tutorial } from "./assets/tutorialsData";

export default function Tutorials() {
  const [generalTutorial, setGeneralTutorial] = useState<Tutorial | null>(null);
  const [grammarsTutorial, setGrammarsTutorial] = useState<Tutorial | null>(
    null
  );
  const [automataTutorial, setAutomataTutorial] = useState<Tutorial | null>(
    null
  );
  const [regexTutorial, setRegexTutorial] = useState<Tutorial | null>(null);

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
        <section className="max-w-7xl mx-auto px-6 py-16 grid gap-10">
          <h2 className="text-3xl font-semibold text-center">General</h2>
          <div className="grid md:grid-cols-3 gap-20">
            {tutorials
              .filter((t) => t.category === "general")
              .map((tutorial) => (
                <button
                  key={tutorial.title}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg hover:border-blue-200 cursor-pointer"
                  onClick={() => setGeneralTutorial(tutorial)}
                >
                  <h3 className="text-xl font-semibold mb-3">
                    {tutorial.title}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">{tutorial.desc}</p>
                </button>
              ))}
          </div>
          {generalTutorial !== null && (
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm p-6 transition-all duration-300 hover:scale-101 hover:shadow-lg hover:border-blue-200 text-center">
              <button
                onClick={() => setGeneralTutorial(null)}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close tutorial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h3 className="text-2xl font-semibold mb-3">
                {generalTutorial.title}
              </h3>
              {generalTutorial.steps.map((step) => (
                <p>{step}</p>
              ))}
            </div>
          )}
        </section>

        {/* Grammars Tutorials */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid gap-10">
          <h2 className="text-3xl font-semibold text-center">Grammars</h2>
          <div className="grid md:grid-cols-3 gap-20">
            {tutorials
              .filter((t) => t.category === "grammars")
              .map((tutorial) => (
                <button
                  key={tutorial.title}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg hover:border-blue-200 cursor-pointer"
                  onClick={() => setGrammarsTutorial(tutorial)}
                >
                  <h3 className="text-xl font-semibold mb-3">
                    {tutorial.title}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">{tutorial.desc}</p>
                </button>
              ))}
          </div>
          {grammarsTutorial !== null && (
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm p-6 transition-all duration-300 hover:scale-101 hover:shadow-lg hover:border-blue-200 text-center">
              <button
                onClick={() => setGrammarsTutorial(null)}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close tutorial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h3 className="text-2xl font-semibold mb-3">
                {grammarsTutorial.title}
              </h3>
              {grammarsTutorial.steps.map((step) => (
                <p>{step}</p>
              ))}
            </div>
          )}
        </section>

        {/* Automata Tutorials */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid gap-10">
          <h2 className="text-3xl font-semibold text-center">Automata</h2>
          <div className="grid md:grid-cols-3 gap-20">
            {tutorials
              .filter((t) => t.category === "automata")
              .map((tutorial) => (
                <button
                  key={tutorial.title}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg hover:border-blue-200 cursor-pointer"
                  onClick={() => setAutomataTutorial(tutorial)}
                >
                  <h3 className="text-xl font-semibold mb-3">
                    {tutorial.title}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">{tutorial.desc}</p>
                </button>
              ))}
          </div>
          {automataTutorial !== null && (
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm p-6 transition-all duration-300 hover:scale-101 hover:shadow-lg hover:border-blue-200 text-center">
              <button
                onClick={() => setAutomataTutorial(null)}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close tutorial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h3 className="text-2xl font-semibold mb-3">
                {automataTutorial.title}
              </h3>
              {automataTutorial.steps.map((step) => (
                <p>{step}</p>
              ))}
            </div>
          )}
        </section>

        {/* RegEx Tutorials */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid gap-10">
          <h2 className="text-3xl font-semibold text-center">
            Regular Expressions
          </h2>
          <div className="grid md:grid-cols-3 gap-20">
            {tutorials
              .filter((t) => t.category === "regex")
              .map((tutorial) => (
                <button
                  key={tutorial.title}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg hover:border-blue-200 cursor-pointer"
                  onClick={() => setRegexTutorial(tutorial)}
                >
                  <h3 className="text-xl font-semibold mb-3">
                    {tutorial.title}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">{tutorial.desc}</p>
                </button>
              ))}
          </div>
          {regexTutorial !== null && (
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm p-6 transition-all duration-300 hover:scale-101 hover:shadow-lg hover:border-blue-200 text-center">
              <button
                onClick={() => setRegexTutorial(null)}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close tutorial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h3 className="text-2xl font-semibold mb-3">
                {regexTutorial.title}
              </h3>
              {regexTutorial.steps.map((step) => (
                <p>{step}</p>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold mb-4">Want to Learn More?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            In case you're looking for help not covered by the site at the
            moment or would like to consult the documentation of the original
            tool on which our site is based, consult the original JFlap site
            below or feel free to reach out to a member of our team.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="https://www.jflap.org/"
              target="_blank"
              className="border border-slate-300 px-4 py-3 rounded-lg font-medium text-white bg-blue-900 hover:bg-blue-950 transition-colors"
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
