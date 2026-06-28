import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/admin/Sidebar";
import BookingTable from "../../components/admin/BookingTable";
import EnquiryTable from "../../components/admin/EnquiryTable";
import {
  fetchBookingStats, fetchBookings,
  fetchEnquiries, fetchClientStats, fetchEnquiryStats,
} from "../../utils/api";

/* ─── helpers ─────────────────────────────────────────────────────────── */
const MONTHS_FULL = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const THIS_YEAR   = new Date().getFullYear();

const fmt  = (n) => !n ? "—" : n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${n.toLocaleString("en-IN")}`;
const pct  = (a, b) => b === 0 ? null : (((a - b) / b) * 100).toFixed(1);

const MONTH_OPTIONS = MONTHS_FULL.map((m, i) => ({ label: m, value: i + 1 }));
const YEAR_OPTIONS  = [THIS_YEAR, THIS_YEAR - 1, THIS_YEAR - 2];

/* ─── Status colour map matching ManageBookings ───────────────────────── */
const STATUS_PILL = {
  "Pending":     "bg-amber-100 text-amber-700 border border-amber-300",
  "Confirmed":   "bg-emerald-100 text-emerald-700 border border-emerald-300",
  "In Progress": "bg-blue-100 text-blue-700 border border-blue-300",
  "Completed":   "bg-slate-200 text-slate-700 border border-slate-400",
  "Cancelled":   "bg-red-100 text-red-600 border border-red-300",
};

/* ─── Trend badge ─────────────────────────────────────────────────────── */
function Trend({ value }) {
  if (value === null || value === undefined) return null;
  const n = parseFloat(value);
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
      n > 0  ? "bg-emerald-100 text-emerald-700" :
      n < 0  ? "bg-red-100 text-red-600" :
               "bg-surface-container text-on-surface-variant"
    }`}>
      {n > 0 ? "▲" : n < 0 ? "▼" : "─"} {Math.abs(n)}%
    </span>
  );
}

/* ─── Filter bar ──────────────────────────────────────────────────────── */
function FilterBar({ month, year, onMonth, onYear, onReset }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-surface-container-lowest rounded-xl premium-shadow">
      <span className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] tracking-widest">
        Filter by
      </span>
      <div className="relative inline-flex items-center border border-outline-variant rounded-full px-4 py-1.5 gap-1 hover:border-secondary transition">
        <span className="font-body text-body-sm">{month === 0 ? "All Months" : MONTHS_FULL[month - 1]}</span>
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
        <select value={month} onChange={(e) => onMonth(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer">
          <option value={0}>All Months</option>
          {MONTH_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>
      <div className="relative inline-flex items-center border border-outline-variant rounded-full px-4 py-1.5 gap-1 hover:border-secondary transition">
        <span className="font-body text-body-sm">{year}</span>
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
        <select value={year} onChange={(e) => onYear(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer">
          {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {month > 0 && (
        <span className="font-body text-body-sm text-secondary font-medium">
          Showing: {MONTHS_FULL[month - 1]} {year}
        </span>
      )}
      {month > 0 && (
        <button onClick={onReset}
          className="ml-auto text-[11px] font-body uppercase text-on-surface-variant hover:text-secondary transition">
          Reset
        </button>
      )}
    </div>
  );
}

/* ─── Revenue Bar Chart ───────────────────────────────────────────────── */
function RevenueBarChart({ data, filterMonth }) {
  const [tooltip, setTooltip] = useState(null);
  const maxVal = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 premium-shadow">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-display text-title-lg text-primary">Monthly Revenue</h3>
        {filterMonth > 0 && (
          <span className="font-body text-[11px] text-secondary uppercase tracking-wider">
            {MONTHS_FULL[filterMonth - 1]} highlighted
          </span>
        )}
      </div>
      <p className="font-body text-[11px] text-on-surface-variant mb-4 uppercase tracking-widest">
        Revenue (₹) · Completed bookings only
      </p>

      {/* Tooltip */}
      <div className={`mb-3 h-8 flex items-center transition-opacity duration-200 ${tooltip ? "opacity-100" : "opacity-0"}`}>
        {tooltip && (
          <div className="bg-primary text-on-primary text-[11px] font-body px-3 py-1.5 rounded-lg">
            <span className="font-bold">{tooltip.month}</span>
            {tooltip.bookings > 0 && (
              <> · {tooltip.bookings} booking{tooltip.bookings !== 1 ? "s" : ""}</>
            )}
            {" · "}
            <span className="font-bold">{fmt(tooltip.revenue)}</span>
          </div>
        )}
      </div>

      {/* Y-axis label + bars */}
      <div className="flex gap-2">
        {/* Y-axis */}
        <div className="flex flex-col justify-between items-end pr-2 h-48 text-[10px] font-body text-on-surface-variant select-none">
          <span>{fmt(maxVal)}</span>
          <span>{fmt(Math.round(maxVal * 0.5))}</span>
          <span>₹0</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end gap-1.5 h-48 relative">
          {/* Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-full border-t border-dashed border-outline-variant/40" />
            ))}
          </div>
          {data.map((d) => {
            const heightPct = Math.max((d.revenue / maxVal) * 100, d.revenue > 0 ? 2 : 0.5);
            const isActive  = filterMonth === 0 || filterMonth === d._id;
            return (
              <div
                key={d._id}
                className="flex-1 flex flex-col justify-end h-full cursor-pointer group"
                onMouseEnter={() => setTooltip({ month: MONTHS_FULL[d._id - 1], revenue: d.revenue, bookings: d.bookings })}
                onMouseLeave={() => setTooltip(null)}
              >
                <div
                  className={`rounded-t transition-all duration-200 ${
                    isActive
                      ? "bg-secondary/80 group-hover:bg-secondary"
                      : "bg-secondary/15 group-hover:bg-secondary/30"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex gap-1.5 mt-2 pl-[calc(2rem+8px)]">
        {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => (
          <div key={i} className="flex-1 text-center">
            <span className={`text-[10px] font-body uppercase ${
              filterMonth === i + 1 ? "text-secondary font-bold" : "text-on-surface-variant"
            }`}>{m}</span>
          </div>
        ))}
      </div>
      <p className="text-center font-body text-[10px] text-on-surface-variant mt-1 uppercase tracking-widest">Month</p>
    </div>
  );
}

/* ─── Booking Detail Drawer ───────────────────────────────────────────── */
function BookingDrawer({ booking, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    return () => setVisible(false);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!booking) return null;

  const fields = [
    ["Client",       booking.clientName],
    ["Email",        booking.clientEmail],
    ["Phone",        booking.clientPhone],
    ["Event Type",   booking.eventType],
    ["Package",      booking.packageType],
    ["Date",         booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" }) : "—"],
    ["Time",         booking.eventTime],
    ["Venue",        booking.venue],
    ["Guests",       booking.guestCount],
    ["Budget",       booking.estimatedBudget ? fmt(booking.estimatedBudget) : "—"],
    ["Total Amount", booking.totalAmount ? fmt(booking.totalAmount) : "—"],
    ["Special Requests", booking.specialRequests || "—"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />
      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl flex flex-col transition-transform duration-300 ease-out ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div>
            <h2 className="font-display text-headline-sm text-primary">Booking Details</h2>
            <p className="font-body text-body-sm text-on-surface-variant mt-0.5">#{booking._id?.slice(-6).toUpperCase()}</p>
          </div>
          <button onClick={close}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Status badge */}
        <div className="px-6 pt-5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_PILL[booking.status] || "bg-surface-container text-on-surface"}`}>
            {booking.status}
          </span>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {fields.map(([label, val]) => (
            <div key={label} className="border-b border-outline-variant/40 pb-3">
              <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">{label}</p>
              <p className="font-body text-body-sm text-on-surface">{val ?? "—"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Recent Bookings Table with View button ─────────────────────────── */
function RecentBookingsTable({ rows }) {
  const [selected, setSelected] = useState(null);

  if (!rows.length) return <p className="font-body text-body-sm text-on-surface-variant">No bookings in this period.</p>;

  return (
    <>
      <div className="overflow-x-auto rounded-xl premium-shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-lowest">
              {["Client","Event","Date","Package","Status",""].map((h) => (
                <th key={h} className="px-4 py-3 font-body text-[10px] uppercase tracking-widest text-on-surface-variant">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b._id} className="border-b border-outline-variant/40 hover:bg-surface-container-lowest/60 transition">
                <td className="px-4 py-3 font-body text-body-sm text-on-surface">{b.clientName}</td>
                <td className="px-4 py-3 font-body text-body-sm text-on-surface-variant">{b.eventType}</td>
                <td className="px-4 py-3 font-body text-body-sm text-on-surface-variant">
                  {b.eventDate ? new Date(b.eventDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—"}
                </td>
                <td className="px-4 py-3 font-body text-body-sm text-on-surface-variant">{b.packageType}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_PILL[b.status] || "bg-surface-container text-on-surface"}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelected(b)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-outline-variant text-[11px] font-body uppercase tracking-wider text-on-surface-variant hover:border-secondary hover:text-secondary transition"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && <BookingDrawer booking={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [allBookings,  setAllBookings]  = useState([]);
  const [enquiries,    setEnquiries]    = useState([]);
  const [clients,      setClients]      = useState(null);
  const [enquiryStats, setEnquiryStats] = useState(null);

  const [filterMonth, setFilterMonth] = useState(0);
  const [filterYear,  setFilterYear]  = useState(THIS_YEAR);

  useEffect(() => {
    fetchBookings()
      .then((b) => setAllBookings(b.sort((a, z) => new Date(z.eventDate) - new Date(a.eventDate))))
      .catch(console.error);
    fetchEnquiries()
      .then((e) => {
        const sorted = [...e].sort((a, b) => new Date(a.preferredDate) - new Date(b.preferredDate));
        setEnquiries(sorted.slice(0, 5));
      })
      .catch(console.error);
    fetchClientStats().then(setClients).catch(console.error);
    fetchEnquiryStats().then(setEnquiryStats).catch(console.error);
  }, []);

  /* ── Filtered bookings ──────────────────────────────────────────────── */
  const filtered = allBookings.filter((b) => {
    const d = new Date(b.eventDate);
    const matchYear  = d.getFullYear() === filterYear;
    const matchMonth = filterMonth === 0 || d.getMonth() + 1 === filterMonth;
    return matchYear && matchMonth;
  });

  /* ── Stats from filtered ────────────────────────────────────────────── */
  const filteredBookings = filtered.length;

  /* FIX: revenue from totalAmount OR estimatedBudget for Completed bookings */
  const filteredRevenue = filtered
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  /* Unique clients in filtered period */
  const filteredClients = filterMonth === 0
    ? (clients?.total ?? 0)
    : new Set(filtered.map((b) => b.clientEmail || b.clientName)).size;

  const filteredEnquiries = filterMonth === 0
    ? (enquiryStats?.newCount ?? 0)
    : enquiries.filter((e) => {
        const d = new Date(e.preferredDate);
        return d.getFullYear() === filterYear && d.getMonth() + 1 === filterMonth;
      }).length;

  /* ── Prev-period for trends ─────────────────────────────────────────── */
  const prevMonth = filterMonth === 0 ? 0 : filterMonth === 1 ? 12 : filterMonth - 1;
  const prevYear  = filterMonth === 1 ? filterYear - 1 : filterYear;

  const prevFiltered = allBookings.filter((b) => {
    const d = new Date(b.eventDate);
    if (filterMonth === 0) return d.getFullYear() === filterYear - 1;
    return d.getFullYear() === prevYear && d.getMonth() + 1 === prevMonth;
  });

  const prevBookings = prevFiltered.length;
  const prevRevenue  = prevFiltered
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const bookingTrend = pct(filteredBookings, prevBookings);
  const revenueTrend = pct(filteredRevenue, prevRevenue);

  /* ── Status breakdown ───────────────────────────────────────────────── */
  const statusCount = (s) => filtered.filter((b) => b.status === s).length;

  /* ── Status revenue breakdown ───────────────────────────────────────── */
  const statusRevenue = (s) => filtered
    .filter((b) => b.status === s)
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  /* ── Package breakdown ──────────────────────────────────────────────── */
  const pkgMap = filtered.reduce((acc, b) => {
    acc[b.packageType] = (acc[b.packageType] || 0) + 1;
    return acc;
  }, {});
  const pkgTotal = filtered.length || 1;
  const topPackages = Object.entries(pkgMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

  /* ── Monthly chart data (revenue) ───────────────────────────────────── */
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthBookings = allBookings.filter((b) => {
      const d = new Date(b.eventDate);
      return d.getFullYear() === filterYear && d.getMonth() + 1 === month;
    });
    const revenue = monthBookings
      .filter((b) => b.status === "Completed")
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { _id: month, revenue, bookings: monthBookings.length };
  });

  /* Recent 5 of filtered */
  const recentBookings = filtered.slice(0, 5);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">

        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display text-headline-md text-primary">Dashboard</h1>
            <p className="font-body text-body-sm text-on-surface-variant">
              Welcome back —{" "}
              {filterMonth > 0 ? `${MONTHS_FULL[filterMonth - 1]} ${filterYear}` : `Full year ${filterYear}`}
            </p>
          </div>
        </header>

        {/* Filter bar */}
        <FilterBar
          month={filterMonth} year={filterYear}
          onMonth={setFilterMonth} onYear={setFilterYear}
          onReset={() => setFilterMonth(0)}
        />

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-8">
          {[
            { icon: "event",            label: "Bookings",     val: filteredBookings,               trend: bookingTrend, sub: null },
            { icon: "payments",         label: "Revenue",      val: fmt(filteredRevenue),            trend: revenueTrend, sub: "Completed bookings only" },
            { icon: "groups",           label: "Clients",      val: filterMonth === 0 ? (clients?.total ?? "—") : filteredClients, trend: null, sub: null },
            { icon: "mark_email_unread",label: "New Enquiries",val: filteredEnquiries,              trend: null, sub: null },
          ].map(({ icon, label, val, trend, sub }) => (
            <div key={label} className="bg-surface-container-lowest rounded-xl p-6 premium-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <Trend value={trend} />
              </div>
              <div className="font-display text-headline-md text-primary">{val}</div>
              <div className="font-body text-label-caps uppercase text-on-surface-variant tracking-widest mt-1">{label}</div>
              {sub && <div className="font-body text-[10px] text-on-surface-variant/60 mt-0.5">{sub}</div>}
            </div>
          ))}
        </div>

        {/* Status breakdown — with revenue */}
        <div className="mb-8">
          <h2 className="font-display text-title-lg text-primary mb-3">Status Overview</h2>
          <div className="flex flex-wrap gap-3">
            {[
              ["Pending",     "bg-amber-50 text-amber-700 border border-amber-200"],
              ["Confirmed",   "bg-emerald-50 text-emerald-700 border border-emerald-200"],
              ["In Progress", "bg-blue-50 text-blue-700 border border-blue-200"],
              ["Completed",   "bg-slate-100 text-slate-700 border border-slate-300"],
              ["Cancelled",   "bg-red-50 text-red-600 border border-red-200"],
            ].map(([s, cls]) => (
              <div key={s} className={`flex flex-col px-5 py-3 rounded-2xl gap-1 ${cls}`}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">{s}</span>
                  <span className="font-display text-lg font-bold">{statusCount(s)}</span>
                </div>
                {statusRevenue(s) > 0 && (
                  <span className="text-[11px] font-body opacity-80">{fmt(statusRevenue(s))}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart + Top Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-8">
          <div className="lg:col-span-2">
            <RevenueBarChart data={chartData} filterMonth={filterMonth} />
          </div>

          {/* Top Packages */}
          <div className="bg-surface-container-lowest rounded-xl p-6 premium-shadow">
            <h3 className="font-display text-title-lg text-primary mb-1">Top Packages</h3>
            <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
              By booking volume
            </p>
            {topPackages.length > 0 ? (
              <ul className="space-y-4">
                {topPackages.map(([pkg, count]) => (
                  <li key={pkg}>
                    <div className="flex justify-between font-body text-body-sm mb-1">
                      <span>{pkg}</span>
                      <span className="text-secondary font-bold">{Math.round((count / pkgTotal) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-outline-variant rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${(count / pkgTotal) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body text-body-sm text-on-surface-variant">No bookings in this period.</p>
            )}

            {filtered.length > 0 && (
              <div className="mt-6 pt-4 border-t border-outline-variant">
                <p className="font-body text-[11px] uppercase text-on-surface-variant tracking-wider mb-2">Total Guests</p>
                <p className="font-display text-headline-sm text-primary">
                  {filtered.reduce((s, b) => s + (b.guestCount || 0), 0).toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-title-lg text-primary">Recent Bookings</h2>
          <span className="font-body text-body-sm text-on-surface-variant">{filtered.length} total in period</span>
        </div>
        <div className="mb-8">
          <RecentBookingsTable rows={recentBookings} />
        </div>

        {/* Latest Enquiries */}
        <h2 className="font-display text-title-lg text-primary mb-4">Latest Enquiries</h2>
        {enquiries.length > 0
          ? <EnquiryTable rows={enquiries} />
          : <p className="font-body text-body-sm text-on-surface-variant">No enquiries yet.</p>}
      </main>
    </div>
  );
}