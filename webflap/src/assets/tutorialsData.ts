export interface Tutorial {
  category: string;
  title: string;
  desc: string;
  steps?: string[];
  image?: string;
  // Could add in an image property if desired to include one?
}

export const tutorials: Tutorial[] = [
  {
    category: "general",
    title: "Start a New Project",
    desc: "Create a new project from one of our app's modules from scratch.",
    steps: [
      "1. Click 'New Project' in the top right corner of the site.",
      "2. Choose the type of project you'd like to create.",
      "3. When complete, save your file if desired and return to the site's homepage by clicking the 'WebFlap' logo.",
    ],
  },
  {
    category: "general",
    title: "Import Existing Project",
    desc: "Import a project you already have a .jff file of, which can be obtained either in JFlap or WebFlap.",
    steps: [
      "1. Click 'New Project' in the top right corner of the site.",
      "2. Select the 'Open Project' button on the right half of the screen next to the chosen file indicator.",
      "3. Verify that the file represented matches the file you wanted to open. If not, repeat.",
    ],
  },
  {
    category: "general",
    title: "Site Navigation",
    desc: "Learn how to navigate the site and access the full range of functionality.",
    steps: [
      "1. Select options in the Navigation Bar at the top of the site to traverse top-level pages.",
      "2. Learn more about our site's suite of features under the 'Features' tab.",
      "3. For our core functionality — project creation — click 'New Project' and get started.",
    ],
  },
  {
    category: "grammars",
    title: "Grammar",
    desc: "How to make a Grammar",
    image: "/src/assets/WebFlap_Grammar.png",
  },
  {
    category: "automata",
    title: "Automata",
    desc: "How to make an Automaton",
    image: "/src/assets/WebFlap_Automata.png",
  },
  {
    category: "regex",
    title: "Regular Expressions",
    desc: "How to make Regular Expressions",
    image: "/src/assets/WebFlap_REGEX.png",
  },
];
