import { useState } from "react";
import SectionHeading from "../components/common/SectionHeading";
import MenuTabs from "../components/menu/MenuTabs";
import FoodCard from "../components/menu/FoodCard";

const ITEMS = {
  "Appetizers": [
    { name: "Truffle Arancini", desc: "Crispy risotto bites with black truffle.", price: "₹450", tags: ["Vegetarian"] },
    { name: "Tandoori Prawns", desc: "Charcoal-grilled, saffron yogurt marinade.", price: "₹650", tags: ["Halal"] },
    { name: "Garden Bruschetta", desc: "Heirloom tomato, basil, aged balsamic.", price: "₹350", tags: ["Vegan", "Vegetarian"] },
  ],
  "Main Course": [
    { name: "Lamb Rogan Josh", desc: "Slow-braised lamb in Kashmiri spices.", price: "₹850", tags: ["Halal"] },
    { name: "Paneer Pasanda", desc: "Stuffed cottage cheese in cashew gravy.", price: "₹600", tags: ["Vegetarian"] },
  ],
  "Desserts": [
    { name: "Saffron Kulfi", desc: "Slow-churned with pistachio crumble.", price: "₹300", tags: ["Vegetarian", "Gluten-Free"] },
  ],
  "Beverages": [{ name: "Rose Falooda", desc: "Chilled milk, rose syrup, vermicelli.", price: "₹250", tags: ["Vegetarian"] }],
  "Live Counters": [{ name: "Chaat Bar", desc: "Live papdi, sev puri, dahi bhalla.", price: "On request", tags: ["Vegetarian"] }],
};

export default function Menu() {
  const [active, setActive] = useState("Appetizers");
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <SectionHeading eyebrow="Crafted with Care" title="Our Signature Menu" />
      <MenuTabs active={active} onChange={setActive} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {ITEMS[active].map(i => <FoodCard key={i.name} {...i} />)}
      </div>
    </section>
  );
}
