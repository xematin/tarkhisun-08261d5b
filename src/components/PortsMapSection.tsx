import { MapPin } from "lucide-react";

// Iranian ports positioned on a simple world-map SVG (approximate, normalized 0-100)
const ports = [
  { name: "بندرعباس شهید رجایی", x: 67, y: 56 },
  { name: "بندر امام خمینی", x: 64, y: 53 },
  { name: "بندر چابهار", x: 70, y: 58 },
  { name: "بندر بوشهر", x: 65, y: 54 },
  { name: "بندر انزلی", x: 64, y: 47 },
  { name: "بندر جاسک", x: 69, y: 57 },
];

const destinations = [
  { x: 50, y: 45 }, // Europe
  { x: 78, y: 60 }, // India
  { x: 85, y: 50 }, // China
  { x: 22, y: 50 }, // Americas
  { x: 90, y: 75 }, // SE Asia
];

const PortsMapSection = () => {
  const origin = ports[0];

  return (
    <section id="ports" className="relative py-20 ports-map-bg overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, hsl(0 0% 100%) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10" dir="rtl">
        <div className="text-center mb-12">
          <div className="inline-flex hero-chip mb-4 text-persian">
            <MapPin className="w-4 h-4 text-accent-light" />
            <span>پوشش سراسری</span>
          </div>
          <h2 className="heading-secondary text-white mb-4">
            حضور <strong>ترخیصان</strong> در تمام بنادر اصلی ایران
          </h2>
          <p className="text-lg text-white/75 max-w-2xl mx-auto text-persian">
            از بندرعباس شهید رجایی تا بندر امام خمینی، چابهار، بوشهر، انزلی و جاسک — هرکجا نیاز به ترخیص دارید، ما کنار شما هستیم.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* World map visual */}
          <div className="lg:col-span-3 relative">
            <div className="relative aspect-[16/10] rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden p-4">
              <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Simplified world landmasses (stylized blobs) */}
                <g fill="hsl(0 0% 100% / 0.08)" stroke="hsl(160 84% 55% / 0.25)" strokeWidth="0.15">
                  {/* Americas */}
                  <path d="M10,15 Q14,12 18,16 L20,28 Q18,38 22,48 L18,54 Q12,52 10,42 Q8,30 10,15 Z" />
                  {/* Europe + Africa */}
                  <path d="M42,12 Q50,10 56,14 L58,22 Q56,30 60,42 L56,52 Q48,54 44,44 Q40,30 42,12 Z" />
                  {/* Asia + Oceania */}
                  <path d="M60,12 Q72,10 84,14 Q92,16 94,24 L92,34 Q88,42 80,44 L72,40 Q66,32 64,24 Q62,18 60,12 Z" />
                  <path d="M82,48 Q88,46 92,50 L90,56 Q86,58 82,54 Z" />
                </g>

                {/* Dotted destination lines from main port */}
                {destinations.map((d, i) => (
                  <line
                    key={i}
                    x1={origin.x}
                    y1={origin.y}
                    x2={d.x}
                    y2={d.y}
                    stroke="hsl(160 84% 55% / 0.6)"
                    strokeWidth="0.3"
                    className="dash-path"
                  />
                ))}

                {/* Destination dots */}
                {destinations.map((d, i) => (
                  <circle key={`d-${i}`} cx={d.x} cy={d.y} r="0.6" fill="hsl(0 0% 100% / 0.5)" />
                ))}
              </svg>

              {/* Port dots overlaid (HTML for animation crispness) */}
              {ports.map((p) => (
                <div
                  key={p.name}
                  className="port-dot"
                  style={{ left: `${p.x}%`, top: `${p.y * (10/6) + 6}%` }}
                  title={p.name}
                />
              ))}
            </div>
          </div>

          {/* Ports list */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {ports.map((p) => (
              <div
                key={p.name}
                className="glass-card !bg-white/10 !border-white/20 !rounded-2xl p-4 flex items-center gap-3 hover:!bg-white/15 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-accent-light" />
                </div>
                <span className="text-white text-sm text-persian leading-tight"><strong>{p.name}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortsMapSection;
