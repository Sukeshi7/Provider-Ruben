import { NODES } from "../data/config";

export default function NodePicker({ selected, onSelect }) {
  return (
    <div className="step-block">
      <div className="step-header">
        <span className="step-num">03</span>
        <div>
          <div className="step-title">Choisir la machine cible</div>
          <div className="step-sub">Sur quelle machine déployer ce service ?</div>
        </div>
      </div>
      <div className="node-list">
        {NODES.map((n) => (
          <button
            key={n.id}
            className={`node-card${selected?.id === n.id ? " selected" : ""}`}
            onClick={() => onSelect(n)}
          >
            <div className="nc-left">
              <span className={`nc-indicator ${n.role === "master" ? "ind-master" : "ind-node"}`} />
              <div>
                <div className="nc-label">{n.label}</div>
                <div className="nc-host">{n.hostname} · {n.os}</div>
              </div>
            </div>
            <span className={`badge ${n.role === "master" ? "badge-master" : "badge-node"}`}>
              {n.role}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
