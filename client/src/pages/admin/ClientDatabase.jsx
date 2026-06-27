import Sidebar from "../../components/admin/Sidebar";
import ClientTable from "../../components/admin/ClientTable";

const CLIENTS = [
  { id: 1, name: "Aanya Sharma", email: "aanya@x.com", phone: "+91 98000 11111", eventsCount: 3, totalSpend: 850000 },
  { id: 2, name: "Acme Corp", email: "events@acme.com", phone: "+91 98000 22222", eventsCount: 7, totalSpend: 2400000 },
  { id: 3, name: "The Mehras", email: "mehra@x.com", phone: "+91 98000 33333", eventsCount: 2, totalSpend: 420000 },
];

export default function ClientDatabase() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-headline-md text-primary">Client Database</h1>
          <input placeholder="Search clients..." className="bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-full font-body text-body-sm w-64" />
        </header>
        <ClientTable rows={CLIENTS} />
      </main>
    </div>
  );
}
