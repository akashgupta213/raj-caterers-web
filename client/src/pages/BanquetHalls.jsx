import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const formatCapacity = (min, max) => {
  if (!min && !max) return "Flexible capacity";
  if (!min) return `Up to ${max} Pax`;
  if (min === max) return `${min} Pax`;
  return `${min} - ${max} Pax`;
};

export default function BanquetHalls() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/banquet-halls");
        setHalls(res.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative h-[420px] md:h-[560px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center scale-105"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAS4INVZY7RJhos1RAJCP7YQNYUy6eTpTdjoDGw9qxHsb7lxTiFyNiVeYL-g9kfTJf4tswEh4tkUhtzfbiaBSsIsUa_nZOo-GdeoreErGDUlPhpUwvxlQ-RzVu9HqLtBQJQ9QYMcGjucehPrNRwCazSM2Zrc6F6aYCTLqdnP5YoPRvy8NKtt0Mrti7wtDbFh_iQkLXDUTNLBlVXa5-sHEUt5cFNRnl89vW0359dkL37Z5aSD7Nmtx0Ie7d7cAe2HSQfmBD7HqPmtjPm')" }}
          />
          <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop text-white max-w-4xl mx-auto">
          <span className="font-body text-[11px] uppercase tracking-[0.3em] mb-4 text-secondary-fixed">
            Curation &amp; Grandeur
          </span>
          <h1 className="font-display text-headline-md md:text-display-lg mb-6 leading-tight">
            Our Signature Venues
          </h1>
          <p className="font-body text-body-sm md:text-body-lg max-w-2xl text-white/90 leading-relaxed">
            Experience the intersection of architectural beauty and bespoke hospitality — a curated
            selection of premium banquet halls for every celebration.
          </p>
        </div>
      </section>

      {/* Halls grid */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-headline-md text-primary mb-4">The Collection</h2>
          <div className="w-20 h-px bg-secondary mx-auto" />
        </div>

        {loading ? (
          <p className="font-body text-body-sm text-on-surface-variant text-center">Loading venues…</p>
        ) : halls.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant font-body text-body-sm border-2 border-dashed border-outline-variant rounded-xl">
            Venues coming soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {halls.map((hall) => (
              <div
                key={hall._id}
                onClick={() => navigate(`/banquet-halls/${hall._id}`)}
                className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm flex flex-col transition-transform duration-400 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="relative h-56 md:h-72 overflow-hidden">
                  {hall.images?.[0]?.url ? (
                    <img src={hall.images[0].url} alt={hall.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[40px]">image</span>
                    </div>
                  )}
                  {hall.featured && (
                    <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-4 py-1 rounded-full font-body text-[10px] uppercase tracking-wider">
                      Premium
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                    <span className="font-body text-[10px] uppercase tracking-wider">
                      {formatCapacity(hall.capacityMin, hall.capacityMax)}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-grow flex flex-col">
                  <h3 className="font-body text-title-lg text-on-surface mb-3">{hall.name}</h3>
                  {hall.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {hall.amenities.slice(0, 3).map((a) => (
                        <span
                          key={a}
                          className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-body text-[10px] uppercase tracking-wider"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/banquet-halls/${hall._id}`); }}
                    className="mt-auto w-full border border-secondary text-secondary font-body text-[11px] uppercase tracking-wider py-4 rounded hover:bg-secondary hover:text-white transition-all"
                  >
                    View Availability &amp; Photos
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}