import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl">🍫</div>
      <h1 className="mt-4 font-serif text-5xl font-bold">404</h1>
      <p className="mt-2 text-chocolate-light dark:text-cream/60">
        Oops! This page melted away. Let's get you back.
      </p>
      <Link to="/" className="btn-gold mt-6">Back to Home</Link>
    </div>
  );
}
