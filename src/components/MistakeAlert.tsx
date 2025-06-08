interface MistakeAlertProps {
  show: boolean;
  incorrectNewlinePosition: number;
}

export default function MistakeAlert({ show, incorrectNewlinePosition }: MistakeAlertProps) {
  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
      {incorrectNewlinePosition !== -1 
        ? "Press Backspace to remove the incorrect newline" 
        : "Fix the mistake before continuing!"}
    </div>
  );
} 