import { useState } from "react";
import SectionHeading from "../components/common/SectionHeading";
import GalleryFilter from "../components/gallery/GalleryFilter";
import MasonryGrid from "../components/gallery/MasonryGrid";
import Lightbox from "../components/gallery/Lightbox";

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const items = Array.from({ length: 12 });
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <SectionHeading eyebrow="Moments to Remember" title="Event Gallery" />
      <GalleryFilter active={filter} onChange={setFilter} />
      <div onClick={() => setOpen(true)} className="cursor-zoom-in"><MasonryGrid items={items} /></div>
      <Lightbox open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
