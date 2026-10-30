interface FingerGuideProps {
  /** e.g. "left index finger", or empty when the key has no finger mapping. */
  label: string;
}

/**
 * Tells the user which finger is about to be needed.
 *
 * Shown above the keyboard so it can be read without looking away from the
 * hands, and it disappears when there is no finger to name.
 */
export default function FingerGuide({ label }: FingerGuideProps) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm" aria-live="polite">
      {label ? (
        <>
          <span className="text-base-content/60">Next:</span>
          <span className="badge badge-primary badge-outline gap-1.5 normal-case">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 4.5v3M12 3v4.5M16 4.5v3M6 11.5a6 6 0 0112 0V13a6 6 0 01-6 6h-1a5 5 0 01-5-5v-2.5z"
              />
            </svg>
            {label}
          </span>
        </>
      ) : (
        <span className="text-base-content/40">&nbsp;</span>
      )}
    </div>
  );
}
