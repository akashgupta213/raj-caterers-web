import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { fetchClients } from "../../utils/api";

/* ─── helpers ─────────────────────────────────────────────────────────── */
const fmt = (n) =>
  !n ? "—" :
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr` :
  n >= 100000   ? `₹${(n / 100000).toFixed(2)}L` :
                  `₹${n.toLocaleString("en-IN")}`;

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const THIS_YEAR    = new Date().getFullYear();

/* ─── Stat Card ───────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 premium-shadow">
      <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary mb-3">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div className="font-display text-headline-sm text-primary">{value}</div>
      <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">{label}</div>
      {sub && <div className="font-body text-[10px] text-on-surface-variant/60 mt-0.5">{sub}</div>}
    </div>
  );
}

/* ─── Monthly Clients Bar Chart (mirrors Dashboard style) ─────────────── */
function ClientsBarChart({ clients }) {
  const [tooltip, setTooltip] = useState(null);

  // Count new clients per month based on their first booking date
  const monthData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const count = clients.filter((c) => {
      if (!c.firstBookingDate) return false;
      const d = new Date(c.firstBookingDate);
      return d.getFullYear() === THIS_YEAR && d.getMonth() + 1 === month;
    }).length;
    const revenue = clients
      .filter((c) => {
        if (!c.firstBookingDate) return false;
        const d = new Date(c.firstBookingDate);
        return d.getFullYear() === THIS_YEAR && d.getMonth() + 1 === month;
      })
      .reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    return { month, count, revenue };
  });

  const maxVal = Math.max(...monthData.map((d) => d.count), 1);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 premium-shadow">
      <h3 className="font-display text-title-lg text-primary mb-0.5">New Clients</h3>
      <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">
        By first booking · {THIS_YEAR}
      </p>

      {/* Tooltip */}
      <div className={`mb-2 h-7 flex items-center transition-opacity duration-200 ${tooltip ? "opacity-100" : "opacity-0"}`}>
        {tooltip && (
          <div className="bg-primary text-on-primary text-[11px] font-body px-3 py-1 rounded-lg">
            <span className="font-bold">{MONTHS_SHORT[tooltip.month - 1]}</span>
            {" · "}
            <span>{tooltip.count} client{tooltip.count !== 1 ? "s" : ""}</span>
            {tooltip.revenue > 0 && <> · <span className="font-bold">{fmt(tooltip.revenue)}</span></>}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {/* Y-axis */}
        <div className="flex flex-col justify-between items-end pr-2 h-36 text-[10px] font-body text-on-surface-variant select-none">
          <span>{maxVal}</span>
          <span>{Math.round(maxVal * 0.5)}</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end gap-1 h-36 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-full border-t border-dashed border-outline-variant/40" />
            ))}
          </div>
          {monthData.map((d) => {
            const heightPct = Math.max((d.count / maxVal) * 100, d.count > 0 ? 4 : 0.5);
            return (
              <div
                key={d.month}
                className="flex-1 flex flex-col justify-end h-full cursor-pointer group"
                onMouseEnter={() => setTooltip(d)}
                onMouseLeave={() => setTooltip(null)}
              >
                <div
                  className="rounded-t bg-secondary/70 group-hover:bg-secondary transition-all duration-200"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis */}
      <div className="flex gap-1 mt-1.5 pl-[calc(2rem+8px)]">
        {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[9px] font-body uppercase text-on-surface-variant">{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Top Spenders Mini Chart ─────────────────────────────────────────── */
function TopSpendersChart({ clients }) {
  const top = [...clients]
    .filter((c) => c.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const maxSpend = top[0]?.totalSpent || 1;

  if (!top.length) return (
    <div className="bg-surface-container-lowest rounded-xl p-5 premium-shadow flex items-center justify-center h-full">
      <p className="font-body text-body-sm text-on-surface-variant">No spend data yet.</p>
    </div>
  );

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 premium-shadow">
      <h3 className="font-display text-title-lg text-primary mb-0.5">Top Spenders</h3>
      <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
        By total booking value
      </p>
      <ul className="space-y-3">
        {top.map((c, i) => (
          <li key={c._id || c.clientEmail}>
            <div className="flex justify-between font-body text-body-sm mb-1">
              <span className="text-on-surface truncate max-w-[60%]">
                <span className="text-secondary font-bold mr-1.5">#{i + 1}</span>
                {c.clientName || c.name}
              </span>
              <span className="text-secondary font-bold shrink-0">{fmt(c.totalSpent)}</span>
            </div>
            <div className="h-1.5 bg-outline-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: `${(c.totalSpent / maxSpend) * 100}%` }}
              />
            </div>
            <p className="font-body text-[10px] text-on-surface-variant mt-0.5">
              {c.bookingCount ?? 0} booking{(c.bookingCount ?? 0) !== 1 ? "s" : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Client Row ──────────────────────────────────────────────────────── */
function ClientRow({ c }) {
  const [expanded, setExpanded] = useState(false);

  const statusPill = {
    "Completed":   "bg-emerald-100 text-emerald-700",
    "Confirmed":   "bg-blue-100 text-blue-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Pending":     "bg-amber-100 text-amber-700",
    "Cancelled":   "bg-red-100 text-red-600",
  };

  return (
    <>
      <tr
        className="border-b border-outline-variant/40 hover:bg-surface-container-lowest/60 transition cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Avatar + name */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-[13px] shrink-0">
              {(c.clientName || c.name || "?")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-body text-body-sm text-on-surface font-medium truncate">
                {c.clientName || c.name}
              </p>
              <p className="font-body text-[11px] text-on-surface-variant truncate">
                {c.clientEmail || c.email}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 font-body text-body-sm text-on-surface-variant hidden sm:table-cell">
          {c.clientPhone || c.phone || "—"}
        </td>
        <td className="px-4 py-3 font-body text-body-sm text-secondary font-semibold">
          {fmt(c.totalSpent)}
        </td>
        <td className="px-4 py-3 font-body text-body-sm text-on-surface-variant hidden md:table-cell">
          {c.bookingCount ?? 0}
        </td>
        <td className="px-4 py-3 font-body text-[11px] text-on-surface-variant hidden lg:table-cell">
          {c.lastBookingDate
            ? new Date(c.lastBookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "—"}
        </td>
        <td className="px-4 py-3">
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
            expand_more
          </span>
        </td>
      </tr>

      {/* Expanded bookings */}
      {expanded && c.bookings?.length > 0 && (
        <tr className="bg-surface-container-lowest/40">
          <td colSpan={6} className="px-4 pb-4 pt-2">
            <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
              Booking History
            </p>
            <div className="space-y-2">
              {c.bookings.map((b, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-outline-variant/40">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusPill[b.status] || "bg-surface-container text-on-surface"}`}>
                    {b.status}
                  </span>
                  <span className="font-body text-body-sm text-on-surface">{b.eventType}</span>
                  {b.eventDate && (
                    <span className="font-body text-[11px] text-on-surface-variant">
                      {new Date(b.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                  {b.packageType && (
                    <span className="font-body text-[11px] text-on-surface-variant">· {b.packageType}</span>
                  )}
                  {(b.totalAmount || b.estimatedBudget) && (
                    <span className="ml-auto font-body text-[11px] text-secondary font-semibold">
                      {fmt(b.totalAmount || b.estimatedBudget)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function ClientDatabase() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [sortField, setSortField] = useState("totalSpent");
  const [sortDir,   setSortDir]   = useState("desc");
  const debounceRef = useRef(null);

  const load = (q = "") => {
    setLoading(true);
    fetchClients(q).then(setClients).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(val), 400);
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  /* ── Derived stats ──────────────────────────────────────────────────── */
  const totalRevenue   = clients.reduce((s, c) => s + (c.totalSpent || 0), 0);
  const repeatClients  = clients.filter((c) => (c.bookingCount ?? 0) > 1).length;
  const avgSpend       = clients.length ? Math.round(totalRevenue / clients.length) : 0;

  /* ── Sorted list ────────────────────────────────────────────────────── */
  const sorted = [...clients].sort((a, b) => {
    let av, bv;
    if (sortField === "name")        { av = (a.clientName || a.name || ""); bv = (b.clientName || b.name || ""); }
    if (sortField === "totalSpent")  { av = a.totalSpent || 0; bv = b.totalSpent || 0; }
    if (sortField === "bookingCount"){ av = a.bookingCount || 0; bv = b.bookingCount || 0; }
    if (sortField === "lastBooking") { av = new Date(a.lastBookingDate || 0); bv = new Date(b.lastBookingDate || 0); }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const SortBtn = ({ field, label }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`inline-flex items-center gap-1 font-body text-[10px] uppercase tracking-widest transition ${
        sortField === field ? "text-secondary" : "text-on-surface-variant hover:text-secondary"
      }`}
    >
      {label}
      {sortField === field && (
        <span className="material-symbols-outlined text-[12px]">
          {sortDir === "asc" ? "arrow_upward" : "arrow_downward"}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 bg-surface p-4 md:p-8 min-h-screen overflow-x-hidden">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
          <div>
            <h1 className="font-display text-headline-md text-primary">Client Database</h1>
            <p className="font-body text-body-sm text-on-surface-variant mt-1">
              {clients.length} client{clients.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
              search
            </span>
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search clients…"
              className="bg-surface-container-lowest border border-outline-variant pl-9 pr-4 py-2 rounded-full font-body text-body-sm w-full sm:w-64 focus:outline-none focus:border-secondary transition"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); load(""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary transition"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-surface-container-lowest rounded-xl p-5 premium-shadow animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon="groups"        label="Total Clients"    value={clients.length} />
              <StatCard icon="payments"      label="Total Revenue"    value={fmt(totalRevenue)} sub="From all bookings" />
              <StatCard icon="repeat"        label="Repeat Clients"   value={repeatClients} sub="2+ bookings" />
              <StatCard icon="trending_up"   label="Avg. Spend"       value={fmt(avgSpend)} sub="Per client" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <ClientsBarChart clients={clients} />
              <TopSpendersChart clients={clients} />
            </div>

            {/* Table */}
            {sorted.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-outline-variant rounded-xl">
                <p className="font-body text-body-sm text-on-surface-variant">
                  {search ? "No clients match your search." : "No clients yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl premium-shadow">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-lowest">
                      <th className="px-4 py-3"><SortBtn field="name" label="Client" /></th>
                      <th className="px-4 py-3 font-body text-[10px] uppercase tracking-widest text-on-surface-variant hidden sm:table-cell">Phone</th>
                      <th className="px-4 py-3"><SortBtn field="totalSpent" label="Total Spent" /></th>
                      <th className="px-4 py-3 hidden md:table-cell"><SortBtn field="bookingCount" label="Bookings" /></th>
                      <th className="px-4 py-3 hidden lg:table-cell"><SortBtn field="lastBooking" label="Last Booking" /></th>
                      <th className="px-4 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((c) => (
                      <ClientRow key={c._id || c.clientEmail || c.email} c={c} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}