import { useState } from "react";
import { useEnquiry } from "../../hooks/useEnquiry";

export default function EnquiryForm() {
  const { submit, submitting } = useEnquiry();
  const [form, setForm] = useState({ name: "", email: "", phone: "", eventType: "Wedding", date: "", guests: "", message: "" });
  const [done, setDone] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try { await submit(form); setDone(true); } catch (err) { console.error(err); }
  };

  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface">
      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-4">Reserve Your Date</span>
          <h2 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-8">Plan Your Perfect Event</h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-8">Every great event begins with a conversation. Share your vision with us, and let our consultants design a menu that exceeds your expectations.</p>
        </div>
        <form onSubmit={onSubmit} className="bg-surface-container-lowest p-8 rounded-xl premium-shadow space-y-6">
          {done && <p className="bg-secondary-fixed text-on-secondary-container p-3 rounded">Thanks! We'll be in touch within 24 hours.</p>}
          {["name", "email", "phone"].map((f) => (
            <div key={f}>
              <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">{f}</label>
              <input required name={f} value={form[f]} onChange={onChange} className="w-full bg-transparent border-b border-outline py-2 text-body-lg" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">Event Type</label>
              <select name="eventType" value={form.eventType} onChange={onChange} className="w-full bg-transparent border-b border-outline py-2 text-body-lg">
                <option>Wedding</option><option>Corporate</option><option>Private Dining</option><option>Social Soiree</option>
              </select>
            </div>
            <div>
              <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">Guests</label>
              <input type="number" name="guests" value={form.guests} onChange={onChange} className="w-full bg-transparent border-b border-outline py-2 text-body-lg" />
            </div>
          </div>
          <div>
            <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">Date</label>
            <input type="date" name="date" value={form.date} onChange={onChange} className="w-full bg-transparent border-b border-outline py-2 text-body-lg" />
          </div>
          <div>
            <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">Message</label>
            <textarea name="message" rows="3" value={form.message} onChange={onChange} className="w-full bg-transparent border-b border-outline py-2 text-body-lg" />
          </div>
          <button disabled={submitting} className="w-full bg-secondary text-on-primary py-4 rounded-full font-body text-label-caps uppercase hover:opacity-90 disabled:opacity-60">
            {submitting ? "Sending..." : "Send Enquiry"}
          </button>
        </form>
      </div>
    </section>
  );
}
