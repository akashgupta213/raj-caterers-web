import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { fetchMenuItems, deleteMenuItem } from "../../utils/api";

export default function ManageMenu() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchMenuItems().then(setItems).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await deleteMenuItem(id);
    load();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-headline-md text-primary">Manage Menu</h1>
          <button className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-label-caps uppercase">+ Add Dish</button>
        </header>
        {loading ? (
          <p className="font-body text-body-sm text-on-surface-variant">Loading...</p>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden premium-shadow">
            <table className="w-full text-left">
              <thead className="bg-surface-container text-on-surface-variant font-body text-label-caps uppercase">
                <tr>{["Image", "Name", "Category", "Price", ""].map((h) => <th key={h} className="px-6 py-4">{h}</th>)}</tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r._id} className="border-t border-outline-variant text-body-sm">
                    <td className="px-6 py-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden image-placeholder">
                        {r.imageUrl
                          ? <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                          : <span className="flex items-center justify-center h-full text-xs text-on-surface-variant">img</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">{r.name}</td>
                    <td className="px-6 py-4">{r.category}</td>
                    {/* pricePerPlate — actual model field */}
                    <td className="px-6 py-4">₹{r.pricePerPlate ?? "—"}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button className="text-secondary hover:underline">Edit</button>
                      <button onClick={() => handleDelete(r._id)} className="text-error hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}