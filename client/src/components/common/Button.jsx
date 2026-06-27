import { cls } from "../../utils/helpers";
export default function Button({ variant = "primary", className = "", children, ...rest }) {
  const base = "px-8 py-3 rounded-full font-body text-label-caps uppercase transition-all duration-300";
  const variants = {
    primary: "bg-gold text-on-background shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    secondary: "bg-secondary text-on-primary hover:opacity-90 transform hover:scale-105",
    outline: "border border-white/50 text-white backdrop-blur-md hover:bg-white/10",
    ghost: "text-secondary border-b border-secondary rounded-none px-0 py-1",
  };
  return <button {...rest} className={cls(base, variants[variant], className)}>{children}</button>;
}
