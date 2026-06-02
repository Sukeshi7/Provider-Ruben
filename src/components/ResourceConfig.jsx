import { CPU_OPTS, RAM_OPTS, STORAGE_OPTS, getImpact } from "../data/config";

function Slider({ label, value, options, onChange, unit }) {
  const idx = options.indexOf(value);
  const pct = (idx / (options.length - 1)) * 100;
  return (
    <div className="res-slider">
      <div className="res-slider-meta">
        <span className="res-slider-label">{label}</span>
        <span className="res-slider-val">{value} <em>{unit}</em></span>
      </div>
      <input
        type="range"
        min={0}
        max={options.length - 1}
        step={1}
        value={idx}
        style={{ "--pct": `${pct}%` }}
        onChange={(e) => onChange(options[+e.target.value])}
      />
      <div className="res-ticks">
        {options.map((o) => (
          <span key={o}>{o}{unit === "GB" && o >= 1000 ? "T" : unit === "GB" ? "G" : ""}</span>
        ))}
      </div>
    </div>
  );
}

export default function ResourceConfig({ config, onChange, service }) {
  if (!service) return null;
  const impact = getImpact(config.cpu, config.ram);

  function set(key, val) {
    onChange({ ...config, [key]: val });
  }

  return (
    <div className="step-block">
      <div className="step-header">
        <span className="step-num">02</span>
        <div>
          <div className="step-title">Configurer les ressources</div>
          <div className="step-sub">Ajustez CPU, RAM et stockage selon votre usage</div>
        </div>
      </div>

      <div className="res-specs-bar">
        <div className="res-spec-item">
          <span className="res-spec-key">CPU</span>
          <span className="res-spec-val">{config.cpu} <em>vCPU</em></span>
        </div>
        <div className="res-spec-sep" />
        <div className="res-spec-item">
          <span className="res-spec-key">RAM</span>
          <span className="res-spec-val">{config.ram} <em>GB</em></span>
        </div>
        <div className="res-spec-sep" />
        <div className="res-spec-item">
          <span className="res-spec-key">Stockage</span>
          <span className="res-spec-val">{config.storage} <em>GB</em></span>
        </div>
        <div className="res-spec-sep" />
        <div className="res-spec-item">
          <span className="res-spec-key">Profil</span>
          <span className={`res-impact impact-${impact.color}`}>{impact.label}</span>
        </div>
      </div>

      <div className="res-sliders">
        <Slider label="CPU"      value={config.cpu}     options={CPU_OPTS}     onChange={(v) => set("cpu", v)}     unit="vCPU" />
        <Slider label="RAM"      value={config.ram}     options={RAM_OPTS}     onChange={(v) => set("ram", v)}     unit="GB"   />
        <Slider label="Stockage" value={config.storage} options={STORAGE_OPTS} onChange={(v) => set("storage", v)} unit="GB"   />
      </div>

      {config.cpu === 1 && service.minCpu > 1 && (
        <div className="res-warning">
          ⚠ Ce service recommande au minimum {service.minCpu} vCPU
        </div>
      )}
      {config.ram < service.minRam && (
        <div className="res-warning">
          ⚠ Ce service recommande au minimum {service.minRam} GB de RAM
        </div>
      )}
    </div>
  );
}
