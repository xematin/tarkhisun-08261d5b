import { MapPin } from "lucide-react";

/**
 * Coordinates are percentages relative to the square map container.
 * The Iran SVG (public/iran-map.svg) is rendered via CSS mask in a 1:1 box,
 * so x/y in % map directly onto its bounding box.
 *
 * labelSide controls which side the floating label sits on, so labels never
 * cover the country shape or each other.
 */
type Port = {
  name: string;
  short: string;
  x: number;
  y: number;
  labelSide: "top" | "bottom" | "left" | "right";
  delay?: string;
};

// Coordinates derived from real lat/lng of each port projected onto the
// Iran SVG bounding box (lng 44.0–63.33°E → x 0–99.83%, lat 25.06–39.78°N → y 6.54–93.50%).
const ports: (Port & { labelOffsetX?: string })[] = [
  { name: "بندر آستارا", short: "آستارا", x: 25.2, y: 14.5, labelSide: "top", delay: "0s" },
  { name: "بندر انزلی", short: "انزلی", x: 28.2, y: 20.2, labelSide: "top", delay: "0.2s" },
  { name: "بندر باشماق", short: "باشماق", x: 10.7, y: 30.9, labelSide: "left", delay: "0.4s" },
  { name: "بندر سرخس", short: "سرخس", x: 88.6, y: 25.7, labelSide: "top", delay: "0.6s" },
  { name: "بندر ماهیرود", short: "ماهیرود", x: 83.3, y: 48.6, labelSide: "right", delay: "0.8s" },
  { name: "بندر خرمشهر", short: "خرمشهر", x: 21.6, y: 61.8, labelSide: "left", delay: "1s" },
  { name: "بندر امام خمینی", short: "امام خمینی", x: 26.2, y: 61.8, labelSide: "top", delay: "1.2s" },
  { name: "بندر بوشهر", short: "بوشهر", x: 35.3, y: 70.4, labelSide: "left", delay: "1.4s" },
  { name: "بندرعباس شهید رجایی", short: "شهید رجایی", x: 63.3, y: 81.2, labelSide: "top", delay: "1.6s" },
  { name: "بندر سیریک", short: "سیریک", x: 67.3, y: 84.9, labelSide: "bottom", delay: "1.8s" },
  { name: "بندر جاسک", short: "جاسک", x: 71.1, y: 90.0, labelSide: "bottom", delay: "2s" },
  { name: "بندر چابهار", short: "چابهار", x: 85.8, y: 92.1, labelSide: "right", delay: "2.2s", labelOffsetX: "-110%" },
];

const labelPositionClasses: Record<Port["labelSide"], string> = {
  top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
  bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
  left: "right-full mr-3 top-1/2 -translate-y-1/2",
  right: "left-full ml-3 top-1/2 -translate-y-1/2",
};

const PortsMapSection = () => {
  return (
    <section id="ports" className="relative py-20 ports-map-bg overflow-hidden">
      {/* subtle dot grid background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10" dir="rtl">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex hero-chip mb-4 text-persian">
            <MapPin className="w-4 h-4 text-accent-light" />
            <span>پوشش سراسری</span>
          </div>
          <h2 className="heading-secondary text-white mb-4">
            حضور <strong>ترخیصان</strong> در تمام بنادر اصلی ایران
          </h2>
          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto text-persian">
            از آستارا و انزلی در شمال تا سرخس و ماهیرود در شرق، از باشماق و خرمشهر در غرب تا شهید رجایی، سیریک، چابهار، بوشهر، امام خمینی و جاسک در جنوب — هرکجا نیاز به ترخیص دارید، ما کنار شما هستیم.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Map container — square aspect so port percentages stay aligned */}
          <div className="relative w-full aspect-square">
            {/* Iran shape rendered via CSS mask so we control color via design tokens */}
            <div className="iran-map-shape" aria-hidden="true" />
            <div className="iran-map-glow" aria-hidden="true" />

            {/* Port markers */}
            {ports.map((p) => (
              <div
                key={p.name}
                className="absolute"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                aria-label={p.name}
              >
                <div className="relative">
                  {/* pulsing dot */}
                  <span
                    className="port-dot-v2"
                    style={{ animationDelay: p.delay }}
                  />
                  {/* floating label */}
                  <div
                    className={`port-label-v2 ${labelPositionClasses[p.labelSide]} ${p.short === 'چابهار' ? 'chabahar-label' : ''}`}
                    style={p.labelOffsetX ? { transform: `translateX(${p.labelOffsetX})` } : undefined}
                  >
                    <span className="text-persian whitespace-nowrap">{p.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile-friendly list under map */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {ports.map((p) => (
            <div
              key={`list-${p.name}`}
              className="!bg-white/95 !border-white/40 border rounded-2xl p-3 flex items-center gap-3 shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-accent-light shadow-[0_0_12px_hsl(var(--accent-light)/0.8)] flex-shrink-0" />
              <span className="text-slate-900 text-sm text-persian leading-tight">
                <strong>{p.name}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortsMapSection;
