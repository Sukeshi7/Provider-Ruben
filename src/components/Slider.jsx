export default function Slider({ label, value, options, onChange, format }) {
  const idx = options.indexOf(value);
  const pct = options.length > 1 ? (idx / (options.length - 1)) * 100 : 0;

  return (
    <div className="slider-group">
      <div className="slider-meta">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{format ? format(value) : value}</span>
      </div>
      <div className="slider-track-wrap">
        <input
          type="range"
          min={0}
          max={options.length - 1}
          step={1}
          value={idx}
          onChange={(e) => onChange(options[parseInt(e.target.value)])}
          style={{ "--pct": `${pct}%` }}
        />
        <div className="slider-ticks">
          {options.map((o) => (
            <span key={o}>{format ? format(o) : o}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
