import { SERVICES } from "../data/config";

export default function ServicePicker({ selected, onSelect }) {
  return (
    <div className="step-block">
      <div className="step-header">
        <span className="step-num">01</span>
        <div>
          <div className="step-title">Choisir un service</div>
          <div className="step-sub">Quel type de serveur voulez-vous déployer ?</div>
        </div>
      </div>
      <div className="service-grid">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            className={`service-card${selected?.id === s.id ? " selected" : ""}`}
            onClick={() => onSelect(s)}
          >
            <div className="sc-top">
              <span className="sc-icon">{s.icon}</span>
              <span className={`sc-dot dot-${s.color}`} />
            </div>
            <div className="sc-label">{s.label}</div>
            <div className="sc-desc">{s.desc}</div>
            <div className="sc-stack">
              {s.stack.map((t) => (
                <span key={t} className="stack-tag">{t}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
