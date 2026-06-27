import Sidebar from "../../components/admin/Sidebar";
import BookingTable from "../../components/admin/BookingTable";
import { useBookings } from "../../hooks/useBookings";

export default function ManageBookings() {
  const { bookings, loading } = useBookings();
  const fallback = [
    { id: 1, clientName: "The Sharmas", eventType: "Wedding", date: Date.now(), guests: 350, amount: 770000, status: "Confirmed" },
    { id: 2, clientName: "Acme Corp", eventType: "Corporate", date: Date.now(), guests: 120, amount: 240000, status: "Pending" },
    { id: 3, clientName: "Mehra Family", eventType: "Anniversary", date: Date.now(), guests: 80, amount: 160000, status: "Cancelled" },
  ];
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-headline-md text-primary">Manage Bookings</h1>
          <button className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-label-caps uppercase">+ New Booking</button>
        </header>
        <div className="flex gap-3 mb-6">
          {["All", "Pending", "Confirmed", "Cancelled"].map(t => (
            <button key={t} className="px-4 py-2 rounded-full border border-outline-variant font-body text-label-caps uppercase text-on-surface-variant hover:border-secondary">{t}</button>
          ))}
        </div>
        <BookingTable rows={loading || !bookings.length ? fallback : bookings} />
      </main>
    </div>
  );
}
