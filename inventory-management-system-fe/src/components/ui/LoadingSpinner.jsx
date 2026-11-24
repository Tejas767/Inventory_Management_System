/**
 * ============================================================
 * LOADING SPINNER — Premium indigo loading indicator
 * ============================================================
 *
 * USAGE:
 *   <LoadingSpinner />
 *   <LoadingSpinner message="Fetching data..." fullScreen />
 */

export default function LoadingSpinner({ message = "Loading...", fullScreen = false }) {
  return (
    <div className={`
      flex flex-col items-center justify-center text-text-secondary
      ${fullScreen ? "min-h-screen" : "min-h-[200px]"}
    `}>
      <div className="w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full animate-spin mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
