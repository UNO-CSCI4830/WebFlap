export type JFFType = "grammar" | "automata" | "regex" | "invalid";

export interface ParsedJFF {
  xml: Document;
  text: string;
  projectType: JFFType;
}

/* parses a .jff file and determines its project type */
export async function parseJFFFile(file: File): Promise<ParsedJFF> {
  const text = await file.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");

  const typeNode = xml.querySelector("type");
  const type = typeNode?.textContent?.trim();

  let projectType: JFFType = "invalid";
  if (type === "grammar") projectType = "grammar";
  else if (type === "fa") projectType = "automata";
  else if (type === "re") projectType = "regex";

  return { xml, text, projectType };
}

/* extracts regex expression fron regex .jff file */
export function extractRegex(xml: Document): string {
  return xml.querySelector("expression")?.textContent?.trim() ?? "";
}

/* extracts productions from grammar .jff file */
export function extractGrammarProductions(xml: Document): { lhs: string, rhs: string }[] {
    const productions: { lhs: string, rhs: string }[] = [];
  
    const productionNodes = xml.querySelectorAll("production");
    productionNodes.forEach(prod => {
      const left = prod.querySelector("left")?.textContent?.trim() ?? "";
      const right = prod.querySelector("right")?.textContent?.trim() ?? "";
      productions.push({ lhs: left, rhs: right });
    });
  
    return productions;
}

/* extracts states and transitions from automata .jff file */
export interface ParsedJFFState {
  id: string;
  name: string;
  x: number;
  y: number;
  initial?: boolean;
  final?: boolean;
}

export interface ParsedJFFTransition {
  from: string;
  to: string;
  read: string;
}

export interface ParsedJFFNote {
  text: string;
  x: number;
  y: number;
}

export interface ParsedAutomaton {
  states: ParsedJFFState[];
  transitions: ParsedJFFTransition[];
  notes: ParsedJFFNote[];
}

export function parseAutomatonJFF(xmlText: string): ParsedAutomaton {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");

  const stateNodes = Array.from(xml.getElementsByTagName("state"));
  const transitionNodes = Array.from(xml.getElementsByTagName("transition"));
  const noteNodes = Array.from(xml.getElementsByTagName("note"));

  const states: ParsedJFFState[] = stateNodes.map((node) => ({
    id: node.getAttribute("id") ?? "",
    name: node.getAttribute("name") ?? "",
    x: parseFloat(node.getElementsByTagName("x")[0]?.textContent ?? "200"),
    y: parseFloat(node.getElementsByTagName("y")[0]?.textContent ?? "200"),
    initial: node.getElementsByTagName("initial").length > 0,
    final: node.getElementsByTagName("final").length > 0,
  }));

  const transitions: ParsedJFFTransition[] = transitionNodes.map((node) => ({
    from: node.getElementsByTagName("from")[0].textContent ?? "",
    to: node.getElementsByTagName("to")[0].textContent ?? "",
    read: node.getElementsByTagName("read")[0]?.textContent ?? "ε",
  }));

  // Extract notes from JFF file
  const notes: ParsedJFFNote[] = noteNodes.map((node) => ({
    text: node.getElementsByTagName("text")[0]?.textContent?.trim() ?? "",
    x: parseFloat(node.getElementsByTagName("x")[0]?.textContent ?? "100"),
    y: parseFloat(node.getElementsByTagName("y")[0]?.textContent ?? "100"),
  }));

  return { states, transitions, notes };
}