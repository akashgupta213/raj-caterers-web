import { useState } from "react";
import { useEnquiry } from "../../hooks/useEnquiry";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { FloralFlower, FloralStyles } from "../common/FloralDecor";

export default function EnquiryForm() {
  const { submit, submitting } = useEnquiry();
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    eventType: "Wedding", date: "",
    guests: "", message: ""
  });
  const [done, setDone] = useState(false);
  const [sectionRef, visible] = useScrollReveal();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await submit(form);
      setDone(true);
      setForm({ name: "", email: "", phone: "", eventType: "Wedding", date: "", guests: "", message: "" });
      setTimeout(() => setDone(false), 5000);
    } catch (err) {}
  };

  return (
    <section ref={sectionRef} className="relative py-section-gap px-margin-mobile md:px-margin-desktop bg-surface overflow-hidden">
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes drawCircle {
          from { stroke-dashoffset: 157; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drawTick {
          from { stroke-dashoffset: 50; }
          to   { stroke-dashoffset: 0; }
        }

        .success-circle {
          animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both;
        }
        .svg-circle {
          stroke-dasharray: 157;
          stroke-dashoffset: 157;
          animation: drawCircle 0.5s ease-out 0.3s forwards;
        }
        .svg-tick {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: drawTick 0.4s ease-out 0.7s forwards;
        }
        .success-text {
          animation: fadeUp 0.4s ease-out 0.8s both;
        }
        .success-link {
          animation: fadeUp 0.4s ease-out 1s both;
        }
      `}</style>

      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left text */}
        <div
          className={`relative transition-all duration-700 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <FloralFlower size={30} className="absolute -top-6 -left-4 text-secondary/50" />
          <span className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-4">
            Reserve Your Date
          </span>
          <h2 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-8">
            Plan Your Perfect Event
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-8">
            Every great event begins with a conversation. Share your vision with us,
            and let our consultants design a menu that exceeds your expectations.
          </p>
        </div>

        {/* Right — success OR form */}
        <div
          className={`relative transition-all duration-700 delay-150 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <FloralFlower size={30} className="absolute -bottom-6 -right-4 text-secondary/50 z-10" />

          {done ? (
            <div className="bg-surface-container-lowest p-8 rounded-xl premium-shadow flex flex-col items-center justify-center gap-6 text-center min-h-[420px]">

              {/* Animated green circle + tick */}
              <div className="success-circle w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
                <svg viewBox="0 0 52 52" className="w-12 h-12">
                  <circle
                    className="svg-circle"
                    cx="26" cy="26" r="24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                  />
                  <path
                    className="svg-tick"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 27 l8 8 l16 -16"
                  />
                </svg>
              </div>

              {/* Text */}
              <div className="success-text flex flex-col gap-2">
                <h3 className="font-display text-2xl text-primary">Enquiry Sent!</h3>
                <p className="font-body text-on-surface-variant text-sm max-w-xs mx-auto">
                  Thank you! We've received your enquiry and will get back
                  to you within <strong>24 hours</strong>.
                </p>
              </div>

              {/* Reset link */}
              <button
                onClick={() => setDone(false)}
                className="success-link text-secondary text-sm font-body underline underline-offset-2"
              >
                Send another enquiry
              </button>
            </div>

          ) : (

            <form
              onSubmit={onSubmit}
              className="bg-surface-container-lowest p-8 rounded-xl premium-shadow space-y-6"
            >
              {["name", "email", "phone"].map((f) => (
                <div key={f}>
                  <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">
                    {f}
                  </label>
                  <input
                    required
                    name={f}
                    value={form[f]}
                    onChange={onChange}
                    className="w-full bg-transparent border-b border-outline py-2 text-body-lg focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={form.eventType}
                    onChange={onChange}
                    className="w-full bg-transparent border-b border-outline py-2 text-body-lg focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option>Wedding</option>
                    <option>Corporate</option>
                    <option>Private Dining</option>
                    <option>Social Soiree</option>
                    <option>Birthday</option>
                    <option>Engagement</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={form.guests}
                    onChange={onChange}
                    className="w-full bg-transparent border-b border-outline py-2 text-body-lg focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-transparent border-b border-outline py-2 text-body-lg focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant block mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="3"
                  value={form.message}
                  onChange={onChange}
                  className="w-full bg-transparent border-b border-outline py-2 text-body-lg focus:outline-none focus:border-secondary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-secondary text-on-primary py-4 rounded-full font-body text-label-caps uppercase hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </>
                ) : "Send Enquiry"}
              </button>
            </form>
          )}
        </div>

      </div>

      <FloralStyles />
    </section>
  );
}