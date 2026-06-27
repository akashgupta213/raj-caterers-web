import SectionHeading from "../components/common/SectionHeading";
import PackageCard from "../components/packages/PackageCard";

const PKGS = [
  { name: "Silver", price: "₹1,200/plate", perks: ["3-course menu", "Standard service", "Basic tableware", "100+ guests"] },
  { name: "Gold", price: "₹2,200/plate", perks: ["5-course menu", "Premium service", "Bone china", "Live counter", "Mocktail bar"], featured: true },
  { name: "Platinum", price: "₹3,800/plate", perks: ["7-course tasting", "Dedicated chef", "Crystal & silver", "Sommelier", "Floral & decor"] },
];

export default function Packages() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <SectionHeading eyebrow="Tailored Tiers" title="Packages & Pricing" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">
        {PKGS.map(p => <PackageCard key={p.name} {...p} />)}
      </div>
    </section>
  );
}
