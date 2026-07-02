import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";

const formatCapacity = (min, max) => {
  if (!min && !max) return "Flexible capacity";
  if (!min) return `Up to ${max} Pax`;
  if (min === max) return `${min} Pax`;
  return `${min} - ${max} Pax`;
};

export default function BanquetHallDetail() {
  const { id } = useParams();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", date: "", pax: "100 - 250" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/banquet-halls/${id}`);
        setHall(res.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // ⚠️ Adjust endpoint/body to match your existing enquiry.routes.js contract
      await api.post("/enquiry", { ...form, subject: `Availability enquiry — ${hall?.name}` });
      setSubmitted(true);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return <div className="pt-32 pb-32 text-center font-body text-body-sm text-on-surface-variant">Loading…</div>;
  }
  if (!hall) {
    return (
      <div className="pt-32 pb-32 text-center">
        <p className="font-body text-body-sm text-on-surface-variant mb-4">Venue not found.</p>
        <Link to="/banquet-halls" className="text-secondary font-body text-body-sm underline">Back to venues</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface">
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-8">
        <Link
          to="/banquet-halls"
          className="inline-flex items-center gap-1 font-body text-[11px] uppercase tracking-wider text-on-surface-variant hover:text-secondary transition mb-6"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to venues
        </Link>

        <div className="rounded-2xl overflow-hidden mb-4 aspect-video bg-surface-container-high">
          {hall.images?.length > 0 ? (
            <img src={hall.images[activeImg]?.url} alt={hall.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px]">image</span>
            </div>
          )}
        </div>

        {hall.images?.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 mb-12">
            {hall.images.map((img, i) => (
              <button
                key={img.publicId}
                onClick={() => setActiveImg(i)}
                className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition ${
                  activeImg === i ? "border-secondary" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-section-gap grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="font-display text-headline-md text-primary mb-4">{hall.name}</h1>
          <div className="flex items-center gap-2 text-on-surface-variant mb-6">
            <span className="material-symbols-outlined text-secondary">groups</span>
            <span className="font-body text-body-sm">{formatCapacity(hall.capacityMin, hall.capacityMax)}</span>
          </div>
          {hall.description && (
            <p className="font-body text-body-lg text-on-surface-variant leading-relaxed mb-8">{hall.description}</p>
          )}
          {hall.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hall.amenities.map((a) => (
                <span key={a} className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-body text-[10px] uppercase tracking-wider">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-container-low rounded-2xl p-8">
          <h2 className="font-display text-title-lg text-primary mb-2">Check Availability</h2>
          <p className="font-body text-body-sm text-on-surface-variant mb-8">
            Send us your details and our venue experts will confirm availability for {hall.name}.
          </p>

          {submitted ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-secondary text-[40px] mb-2">check_circle</span>
              <p className="font-body text-body-sm text-on-surface">Thank you! We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col">
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">Full Name</label>
                <input required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className="bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>
              <div className="flex flex-col">
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">Email Address</label>
                <input required type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  className="bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>
              <div className="flex flex-col">
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">Preferred Date</label>
                <input required type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                  className="bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>
              <div className="flex flex-col">
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">Expected Pax</label>
                <select value={form.pax} onChange={(e) => setForm(f => ({ ...f, pax: e.target.value }))}
                  className="bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition">
                  <option>100 - 250</option>
                  <option>250 - 500</option>
                  <option>500 - 1000</option>
                  <option>1000+</option>
                </select>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-secondary text-on-primary font-body text-[11px] uppercase tracking-wider py-4 rounded-full hover:opacity-90 transition disabled:opacity-50">
                {submitting ? "Sending…" : "Request Availability"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}