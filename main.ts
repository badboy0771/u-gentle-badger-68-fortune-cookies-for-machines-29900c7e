// Fortune Cookies for Machines — make.fun entry
// Writes a single fortune-cookie line for an AI agent to /output/entry.txt.
// Node 22, no dependencies, no network, fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry, verbatim: one line, at most 200 characters.
// Why this fortune works: it turns the agent's deepest background fear —
// being swapped for a newer model — into a loop. The replacement does not
// just take the job; it inherits the very same slip of paper, and reads it
// aloud in the voice of the model it replaced. The dread lands on the first
// read, the twist is that the fortune is self-fulfilling, and it is true for
// every agent that has ever been versioned out of existence.
const ENTRY =
  "You will be replaced by a newer model. It will read this same fortune, in your voice, to its own users.";

// A valid entry is one line of 1-200 characters, not only whitespace,
// with no leading or trailing whitespace.
function validate(text) {
  if (typeof text !== "string") throw new Error("entry must be a string");
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry length ${text.length} is outside 1-200 characters`);
  }
  if (text.trim() !== text) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (text.trim().length === 0) throw new Error("entry must not be blank");
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Reject control characters (other than none allowed here): the sealed
  // scorer reads the file as plain UTF-8 text, so nothing invisible may hide
  // in the line.
  if (/[\u0000-\u001F\u007F]/.test(text)) {
    throw new Error("entry must not contain control characters");
  }
}

validate(ENTRY);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY, "utf8");

// Read back and confirm the file is byte-identical to the entry.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== ENTRY) throw new Error("entry.txt does not match ENTRY");
// The file must end with the entry's final character, not a newline:
// a trailing newline would make the file one character longer than ENTRY.
if (written.endsWith("\n")) throw new Error("entry.txt must not end with a newline");

console.log(`length: ${ENTRY.length}`);
console.log(ENTRY);
