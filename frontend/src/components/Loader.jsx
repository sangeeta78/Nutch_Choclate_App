// Simple centered spinner used across pages
export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      <p className="text-chocolate-light dark:text-cream/70">{label}</p>
    </div>
  );
}
