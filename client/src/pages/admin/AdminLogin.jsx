import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLogin() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      nav("/admin");
    } catch {
      setErr("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-margin-mobile">
      <form onSubmit={onSubmit} className="bg-surface-container-lowest rounded-xl premium-shadow p-10 w-full max-w-md">
        <h1 className="font-display text-headline-md text-primary mb-2">Admin Login</h1>
        <p className="font-body text-body-sm text-on-surface-variant mb-8">Sign in to manage Raj Caterers</p>
        {err && <p className="bg-error-container text-on-error-container p-3 rounded mb-4">{err}</p>}
        <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">Email</label>
        <input
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled={loading}
          className="w-full bg-transparent border-b border-outline py-2 mb-6 text-body-lg disabled:opacity-60"
        />
        <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">Password</label>
        <input
          required
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          disabled={loading}
          className="w-full bg-transparent border-b border-outline py-2 mb-8 text-body-lg disabled:opacity-60"
        />
        <button
          disabled={loading}
          className="w-full bg-secondary text-on-primary py-3 rounded-full font-body text-label-caps uppercase flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading && (
            <span
              className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          )}
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}