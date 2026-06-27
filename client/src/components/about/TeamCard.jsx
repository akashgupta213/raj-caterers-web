export default function TeamCard({ name, role }) {
  return (
    <div className="text-center">
      <div className="w-40 h-40 mx-auto rounded-full overflow-hidden image-placeholder mb-4">text here</div>
      <h4 className="font-display text-title-lg text-primary">{name}</h4>
      <p className="font-body text-label-caps uppercase text-secondary tracking-widest mt-1">{role}</p>
    </div>
  );
}
