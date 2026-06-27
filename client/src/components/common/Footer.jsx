import { Link } from "react-router-dom";
import { NAV_LINKS } from "../../utils/constants";

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface mt-section-gap">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-headline-md-mobile mb-4">Raj Caterers</h3>
          <p className="text-body-sm opacity-80">Premium hospitality and bespoke culinary experiences for life's most precious moments.</p>
        </div>
        <div>
          <h4 className="font-body text-label-caps uppercase tracking-widest mb-4 text-gold">Explore</h4>
          <ul className="space-y-2 text-body-sm">
            {NAV_LINKS.slice(0, 5).map(l => <li key={l.path}><Link to={l.path} className="hover:text-gold">{l.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-body text-label-caps uppercase tracking-widest mb-4 text-gold">Company</h4>
          <ul className="space-y-2 text-body-sm">
            {NAV_LINKS.slice(5).map(l => <li key={l.path}><Link to={l.path} className="hover:text-gold">{l.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-body text-label-caps uppercase tracking-widest mb-4 text-gold">Contact</h4>
          <p className="text-body-sm opacity-80">Gardani Bagh, Tahir Lane, Road no. - 16 <br/>Patna, Bihar, 800002</p>
          <p className="text-body-sm opacity-80 mt-2">+91 93341 27247<br/></p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-body-sm opacity-70">
        © {new Date().getFullYear()} Raj Caterers. All rights reserved.
      </div>
    </footer>
  );
}
