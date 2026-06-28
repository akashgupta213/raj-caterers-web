import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import ClientTable from "../../components/admin/ClientTable";
import { fetchClients } from "../../utils/api";

export default function ClientDatabase() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  const load = (q = "") => {
    setLoading(true);
    fetchClients(q).then(setClients).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(window._cs);
    window._cs = setTimeout(() => load(val), 400);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-headline-md text-primary">Client Database</h1>
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search clients..."
            className="bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-full font-body text-body-sm w-64"
          />
        </header>
        {loading
          ? <p className="font-body text-body-sm text-on-surface-variant">Loading...</p>
          : <ClientTable rows={clients} />}
      </main>
    </div>
  );
}