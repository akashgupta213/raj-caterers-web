import Sidebar from "../../components/admin/Sidebar";
import StatCard from "../../components/admin/StatCard";
import RevenueChart from "../../components/admin/RevenueChart";
import BookingTable from "../../components/admin/BookingTable";
import EnquiryTable from "../../components/admin/EnquiryTable";

const recent = [
  { id: 1, clientName: "The Sharmas", eventType: "Wedding", date: Date.now(), guests: 350, amount: 770000, status: "Confirmed" },
  { id: 2, clientName: "Acme Corp", eventType: "Corporate", date: Date.now(), guests: 120, amount: 240000, status: "Pending" },
];
const enquiries = [
  { id: 1, name: "Priya Nair", email: "priya@x.com", eventType: "Wedding", date: Date.now(), guests: 200 },
];

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-headline-md text-primary">Dashboard</h1>
            <p className="font-body text-body-sm text-on-surface-variant">Welcome back, here's today's snapshot.</p>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-8">
          <StatCard icon="event" label="Bookings" value="42" trend="+12%" />
          <StatCard icon="payments" label="Revenue (M)" value="₹18.4L" trend="+8%" />
          <StatCard icon="groups" label="Clients" value="186" trend="+5%" />
          <StatCard icon="mark_email_unread" label="New Enquiries" value="11" trend="+24%" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-8">
          <div className="lg:col-span-2"><RevenueChart /></div>
          <div className="bg-surface-container-lowest rounded-xl p-6 premium-shadow">
            <h3 className="font-display text-title-lg text-primary mb-4">Top Packages</h3>
            <ul className="space-y-3 text-body-sm">
              <li className="flex justify-between"><span>Gold</span><span className="text-secondary">48%</span></li>
              <li className="flex justify-between"><span>Platinum</span><span className="text-secondary">32%</span></li>
              <li className="flex justify-between"><span>Silver</span><span className="text-secondary">20%</span></li>
            </ul>
          </div>
        </div>
        <h2 className="font-display text-title-lg text-primary mb-4">Recent Bookings</h2>
        <div className="mb-8"><BookingTable rows={recent} /></div>
        <h2 className="font-display text-title-lg text-primary mb-4">Latest Enquiries</h2>
        <EnquiryTable rows={enquiries} />
      </main>
    </div>
  );
}
