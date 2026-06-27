import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-margin-mobile">
      <h1 className="font-display text-display-lg text-primary mb-4">404</h1>
      <p className="font-body text-body-lg text-on-surface-variant mb-8">This page seems to have wandered off the menu.</p>
      <Link to="/" className="bg-secondary text-on-primary px-8 py-3 rounded-full font-body text-label-caps uppercase">Back Home</Link>
    </section>
  );
}
