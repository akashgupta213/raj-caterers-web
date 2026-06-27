import Sidebar from "../../components/admin/Sidebar";

const ITEMS = [
  { name: "Truffle Arancini", category: "Appetizers", price: "₹450" },
  { name: "Lamb Rogan Josh", category: "Main Course", price: "₹850" },
  { name: "Saffron Kulfi", category: "Desserts", price: "₹300" },
];

export default function ManageMenu() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-headline-md text-primary">Manage Menu</h1>
          <button className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-label-caps uppercase">+ Add Dish</button>
        </header>
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden premium-shadow">
          <table className="w-full text-left">
            <thead className="bg-surface-container text-on-surface-variant font-body text-label-caps uppercase">
              <tr>{["Image", "Name", "Category", "Price", ""].map(h => <th key={h} className="px-6 py-4">{h}</th>)}</tr>
            </thead>
            <tbody>
              {ITEMS.map((r, i) => (
                <tr key={i} className="border-t border-outline-variant text-body-sm">
                  <td className="px-6 py-3"><div className="w-14 h-14 rounded-lg image-placeholder">txt</div></td>
                  <td className="px-6 py-4 font-medium text-primary">{r.name}</td>
                  <td className="px-6 py-4">{r.category}</td>
                  <td className="px-6 py-4">{r.price}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="text-secondary hover:underline">Edit</button>
                    <button className="text-error hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
