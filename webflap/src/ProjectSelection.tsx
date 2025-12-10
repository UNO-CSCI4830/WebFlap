import NavigationBar from "./NavigationBar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProjectSelection() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"grammar" | "automata" | "regex"| "invalid" | null>(null);
  const [message, setMessage] = useState("");

  // checks whether JFF file is grammar, automaton, or regular expression
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];

    // handles no file uploaded
    if (!uploaded) {
      setFile(null);
      setFileType(null);
      setMessage("");
      return;
    }
  
    setFile(uploaded);
  
    const text = await uploaded.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
  
    const typeNode = xml.querySelector("type");
    const type = typeNode?.textContent?.trim();
  
    if (!type) {
      setFileType("invalid");
      setMessage("Invalid .jff file");
      return;
    }
  
    if (type === "grammar") {
      setFileType("grammar");
      setMessage("Valid grammar project uploaded");
    } else if (type === "fa") {
      setFileType("automata");
      setMessage("Valid automata project uploaded");
    }
      else if (type === "re") {
      setFileType("regex");
      setMessage("Valid regular expression project uploaded");
    } else {
      setFileType("invalid");
      setMessage("Please upload a grammar, automata, or regular expression .jff file");
    }
  };

  // handles whether project file has been uploaded and navigates to appropriate page
  const navigateProject = async () => {
    if (!file || !fileType) {
      setFileType("invalid");
      setMessage("Please upload a file before opening a project");
      return;
    }
  
    const text = await file.text();
  
    if (fileType === "grammar") {
      navigate("/grammars", { state: { fileText: text } });
    } else if (fileType === "automata") {
      navigate("/automata", { state: { fileText: text } });
    } else if (fileType === "regex") {
      navigate("/regex", { state: { fileText: text } });
    }
  };

  const messageClass =
  fileType === "invalid"
    ? "text-red-600"
    : fileType === null
    ? ""
    : "text-green-600";
  
  
  return (
    <div>
      <NavigationBar />
      <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-900 font-sans flex justify-between">
        {/* new project selection */}
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
                link: "/grammars",
              },
              {
                name: "Automata",
                description: "Design and simulate finite automata.",
                link: "/automata",
              },
              {
                name: "Regular Expressions",
                description: "Build and utilize regular expressions.",
                link: "/regex",
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
        
        {/* open project  */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-4xl font-bold text-center">Open Project</h1>
          <p className="text-center text-slate-600 mt-4">
            Load an existing project from your device:
          </p>
          <div className="max-w-4xl mx-auto px-6 py-12">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col md:flex-row items-center gap-4">
              <input
                type="file"
                accept=".jff"
                onChange={handleFile}
                className="
                  w-full md:w-auto block rounded-lg border border-slate-300 bg-white text-slate-700
                  file:mr-4 file:rounded-lg file:border file:border-slate-300 file:bg-white
                  file:shadow-sm file:px-4 file:py-2 file:text-slate-700
                  file:cursor-pointer hover:file:bg-slate-100 transition
                "
              />
              <button
                type="button"
                onClick={navigateProject}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-950 transition-colors"
              >
                Open Project
              </button>
            </form>

            {/* file type feedback message */}
            {message && (
              <p className={`text-sm mt-2 font-semibold ${messageClass}`}>
                {message}
              </p>
            )}

          </div>
        </section>
        <section className=""></section>
      </main>
    </div>
  );
}
