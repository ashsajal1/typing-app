export interface Command {
  id: string;
  name: string;
  shortcut: string;
  action: () => void;
  description: string;
}

export const createCommands = (handleSubmit: () => void): Command[] => [
  {
    id: "restart",
    name: "Restart Test",
    shortcut: "⌘R",
    action: () => window.location.reload(),
    description: "Start a new typing test"
  },
  {
    id: "finish",
    name: "Finish Test",
    shortcut: "⌘Enter",
    action: handleSubmit,
    description: "End the current test and view results"
  },
  {
    id: "toggle-theme",
    name: "Toggle Theme",
    shortcut: "⌘T",
    action: () => document.documentElement.classList.toggle("dark"),
    description: "Switch between light and dark mode"
  },
  {
    id: "focus-input",
    name: "Focus Input",
    shortcut: "⌘I",
    action: () => document.querySelector("textarea")?.focus(),
    description: "Focus on the typing area"
  }
]; 