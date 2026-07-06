import { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { fetchHallEnquiries, updateHallEnquiry, deleteHallEnquiry } from "../../utils/api";
import { useConfirm } from "../../hooks/useConfirm";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const STATUS_OPTIONS = ["New", "Contacted", "Closed"];

const STATUS_PILL = {
  "New":       "bg-secondary/10 text-secondary border border-secondary/30",
  "Contacted": "bg-blue-50 text-blue-700 border border-blue-200",
  "Closed":    "bg-slate-100 text-slate-600 border border-slate-300",
};

export default function ManageHallEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch]       = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { confirm, dialog, handleConfirm, handleCancel } = useConfirm();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchHallEnquiries();
      setEnquiries(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesStatus = statusFilter === "All" || e.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q ||
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.phone?.toLowerCase().includes(q) ||
        e.hallName?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [enquiries, statusFilter, search]);

  const counts = useMemo(() => ({
    All: enquiries.length,
    New: enquiries.filter((e) => e.status === "New").length,
    Contacted: enquiries.filter((e) => e.status === "Contacted").length,
    Closed: enquiries.filter((e) => e.status === "Closed").length,
  }), [enquiries]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const updated = await updateHallEnquiry(id, { status });
      setEnquiries((prev) => prev.map((e) => (e._id === id ? updated : e)));
    } catch (e) { console.error(e); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (id, name) => {
    const ok = await confirm(`Delete the enquiry from "${name}" permanently?`);
    if (!ok) return;
    setDeletingId(id);
    try {
      await deleteHallEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 bg-surface p-4 md:p-8 min-h-screen overflow-x-hidden">
        <h1 className="font-display text-headline-md text-primary mb-2">Banquet Hall Enquiries</h1>
        <p className="font-body text-body-sm text-on-surface-variant mb-8">
          Every availability request submitted from the Banquet Halls page.
        </p>

        {/* Stat pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {["All", "New", "Contacted", "Closed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`bg-surface-container-lowest rounded-xl p-4 premium-shadow text-left transition ${
                statusFilter === s ? "ring-2 ring-secondary" : "hover:ring-1 hover:ring-outline-variant"
              }`}
            >
              <div className="font-display text-2xl text-primary">{counts[s]}</div>
              <div className="font-body text-[10px] uppercase text-on-surface-variant tracking-widest mt-1">{s}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, hall, email, or phone…"
            className="w-full bg-surface-container-lowest rounded-full pl-10 pr-4 py-2.5 font-body text-body-sm border border-outline-variant focus:outline-none focus:border-secondary transition"
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="font-body text-body-sm text-on-surface-variant">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant font-body text-body-sm border-2 border-dashed border-outline-variant rounded-xl">
            No enquiries match this view.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl premium-shadow">
            <table className="w-full text-left min-w-[760px]">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  {["Name","Hall","Phone","Email","Preferred Date","Pax","Received","Status",""].map((h) => (
                    <th key={h} className="px-3 md:px-4 py-3 font-body text-[10px] uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e._id} className="border-b border-outline-variant/40 hover:bg-surface-container-lowest/60 transition">
                    <td className="px-3 md:px-4 py-3 font-body text-body-sm text-on-surface whitespace-nowrap">{e.name}</td>
                    <td className="px-3 md:px-4 py-3 font-body text-body-sm text-secondary font-medium whitespace-nowrap">{e.hallName}</td>
                    <td className="px-3 md:px-4 py-3 font-body text-body-sm text-on-surface-variant whitespace-nowrap">{e.phone}</td>
                    <td className="px-3 md:px-4 py-3 font-body text-body-sm text-on-surface-variant whitespace-nowrap">{e.email}</td>
                    <td className="px-3 md:px-4 py-3 font-body text-body-sm text-on-surface-variant whitespace-nowrap">
                      {e.date ? new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-3 md:px-4 py-3 font-body text-body-sm text-on-surface-variant whitespace-nowrap">{e.pax || "—"}</td>
                    <td className="px-3 md:px-4 py-3 font-body text-body-sm text-on-surface-variant whitespace-nowrap">
                      {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-3 md:px-4 py-3">
                      <div className="relative inline-block">
  <select
    value={e.status}
    disabled={updatingId === e._id}
    onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
    className={`appearance-none [-webkit-appearance:none] [-moz-appearance:none] bg-none pr-7 pl-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer outline-none disabled:opacity-50 ${STATUS_PILL[e.status] || "bg-surface-container text-on-surface"}`}
    style={{ backgroundImage: "none" }}
  >
    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
  </select>
  <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none">expand_more</span>
</div>
                    </td>
                    <td className="px-3 md:px-4 py-3">
                      <button
                        onClick={() => handleDelete(e._id, e.name)}
                        disabled={deletingId === e._id}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <ConfirmDialog {...dialog} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}