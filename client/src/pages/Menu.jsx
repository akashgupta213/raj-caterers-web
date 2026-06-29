import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import api from "../utils/api";

const CATEGORIES = ["Appetizers", "Main Course", "Desserts", "Beverages", "Live Counters"];

const DIETARY_COLORS = {
  "Vegetarian":  "bg-green-100 text-green-700",
  "Vegan":       "bg-emerald-100 text-emerald-700",
  "Halal":       "bg-blue-100 text-blue-700",
  "Gluten Free": "bg-amber-100 text-amber-700",
};

export default function Menu() {
  const [items,    setItems]    = useState([]);
  const [category, setCategory] = useState("Appetizers");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    api.get("/menu")
      .then(res => {
        // handle both {data: [...]} and {data: {data: [...]}} shapes
        const result = res.data?.data ?? res.data ?? [];
        setItems(Array.isArray(result) ? result : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const displayed = items.filter(i => i.category === category);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="font-body text-label-caps uppercase tracking-widest text-secondary mb-2">Crafted with Care</p>
        <h1 className="font-display text-5xl text-primary">Our Signature Menu</h1>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full border font-body text-[11px] uppercase tracking-wider transition ${
              category === c
                ? "bg-secondary text-on-primary border-secondary"
                : "border-outline-variant text-on-surface-variant hover:border-secondary"
            }`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-on-surface-variant font-body">Loading menu…</div>
      ) : error ? (
        <div className="text-center py-20 text-on-surface-variant font-body">
          Menu items will appear here once added from the admin panel.
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant font-body">
          No items in {category} yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map(item => (
            <div key={item._id} className="bg-surface rounded-xl overflow-hidden border border-outline-variant premium-shadow group">
              <div className="aspect-video bg-surface-container overflow-hidden">
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                      <span className="material-symbols-outlined text-[56px]">restaurant</span>
                    </div>
                }
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-display text-title-sm text-primary">{item.name}</h3>
                  <span className="font-body text-secondary font-semibold">₹{item.price}</span>
                </div>
                {item.description && (
                  <p className="font-body text-body-sm text-on-surface-variant mb-3">{item.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {(item.dietary || []).map(d => (
                    <span key={d} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${DIETARY_COLORS[d] || "bg-surface-container text-on-surface-variant"}`}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}