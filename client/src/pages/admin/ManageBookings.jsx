import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import BookingTable from "../../components/admin/BookingTable";
import { useBookings } from "../../hooks/useBookings";
import { updateBooking } from "../../utils/api";

const FILTERS = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

export default function ManageBookings() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { bookings, loading, refresh } = useBookings(activeFilter);

  const handleStatusChange = async (id, status) => {
    await updateBooking(id, { status });
    refresh();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-headline-md text-primary">Manage Bookings</h1>
          <button className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-label-caps uppercase">+ New Booking</button>
        </header>
        <div className="flex gap-3 mb-6 flex-wrap">
          {FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
              className={`px-4 py-2 rounded-full border font-body text-label-caps uppercase transition ${
                activeFilter === t
                  ? "border-secondary text-secondary"
                  : "border-outline-variant text-on-surface-variant hover:border-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {loading
          ? <p className="font-body text-body-sm text-on-surface-variant">Loading...</p>
          : <BookingTable rows={bookings} onStatusChange={handleStatusChange} />}
      </main>
    </div>
  );
}