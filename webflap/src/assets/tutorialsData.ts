export interface Tutorial {
  id: string;
  title: string;
  desc: string;
  steps: string[];
  // Could add in an image property if desired to include one?
}

export const tutorials: Tutorial[] = [
  {
    id: "general1",
    title: "Starting a New Project",
    desc: "Create a new project from one of our app's modules from scratch.",
    steps: [
      "1. Click 'New Project' in the top right corner of the site.",
      "2. Choose the type of project you'd like to create.",
      "3. When complete, save your file if desired and return to the site's homepage by clicking the 'WebFlap' logo.",
    ],
  },
  {
    id: "general2",
    title: "Import Existing Project",
    desc: "Import a project you already have a .jff file of, which can be obtained either in JFlap or WebFlap.",
    steps: [],
  },
  {
    id: "general3",
    title: "Site Navigation",
    desc: "Learn how to navigate the site and access the full range of functionality.",
    steps: [],
  },
  {
    id: "grammars1",
    title: "",
    desc: "",
    steps: [],
  },
];
