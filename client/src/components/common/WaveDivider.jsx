export default function WaveDivider({ fillColor = "#FDF8F5", flip = false }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`}>
      <svg
        className="w-full h-[60px] md:h-[90px]"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,40 L1440,100 L0,100 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}