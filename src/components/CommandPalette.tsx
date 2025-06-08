import { Command } from "../lib/commands";

interface CommandPaletteProps {
  showCommandPalette: boolean;
  commandSearch: string;
  onCommandSearchChange: (value: string) => void;
  onCommandSelect: (command: Command) => void;
  commands: Command[];
}

export default function CommandPalette({
  showCommandPalette,
  commandSearch,
  onCommandSearchChange,
  onCommandSelect,
  commands,
}: CommandPaletteProps) {
  if (!showCommandPalette) return null;

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
    cmd.description.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
      <div className="bg-base-100 dark:bg-gray-800 w-full max-w-lg rounded-lg shadow-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search commands..."
            className="input input-bordered w-full"
            value={commandSearch}
            onChange={(e) => onCommandSearchChange(e.target.value)}
            autoFocus
          />
          <kbd className="kbd kbd-sm">⌘K</kbd>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => onCommandSelect(cmd)}
              className="w-full text-left p-2 hover:bg-base-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-between group"
            >
              <div>
                <div className="font-medium">{cmd.name}</div>
                <div className="text-sm text-base-content/70">{cmd.description}</div>
              </div>
              <kbd className="kbd kbd-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {cmd.shortcut}
              </kbd>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 