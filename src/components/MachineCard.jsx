import Slider from "./Slider";
import { getBestProvider, formatStorage } from "../data/machines";

const ROLE_STYLES = {
  master: { label: "master",    cls: "badge-master" },
  shared: { label: "shared",    cls: "badge-shared" },
  node:   { label: "node",      cls: "badge-node"   },
};

export default function MachineCard({ machine, config, onChange }) {
  const provider = getBestProvider(machine, config);
  const role = ROLE_STYLES[machine.role];

  return (
    <div className={`machine-card${machine.role === "master" ? " is-master" : ""}`}>
      <div className="card-top">
        <span className={`badge ${role.cls}`}>{role.label}</span>
        <span className="card-price">
          {provider.price.toFixed(2)} <em>€/mo</em>
        </span>
      </div>

      <h3 className="card-title">{machine.title}</h3>
      <p className="card-desc">{machine.description}</p>

      <div className="card-stack">
        {machine.stack.map((s) => (
          <span key={s} className="stack-tag">{s}</span>
        ))}
      </div>

      <div className="card-specs">
        <div className="spec">
          <span className="spec-key">CPU</span>
          <span className="spec-val">{config.cpu} <em>vCPU</em></span>
        </div>
        <div className="spec">
          <span className="spec-key">RAM</span>
          <span className="spec-val">{config.ram} <em>GB</em></span>
        </div>
        <div className="spec">
          <span className="spec-key">Stockage</span>
          <span className="spec-val">{formatStorage(config.storage)}</span>
        </div>
        <div className="spec">
          <span className="spec-key">Provider</span>
          <span className="spec-val spec-provider">{provider.name}</span>
        </div>
      </div>

      <div className="card-sliders">
        <Slider
          label="CPU"
          value={config.cpu}
          options={machine.cpuOpts}
          onChange={(v) => onChange({ ...config, cpu: v })}
          format={(v) => `${v} vCPU`}
        />
        <Slider
          label="RAM"
          value={config.ram}
          options={machine.ramOpts}
          onChange={(v) => onChange({ ...config, ram: v })}
          format={(v) => `${v} GB`}
        />
        <Slider
          label="Stockage"
          value={config.storage}
          options={machine.storageOpts}
          onChange={(v) => onChange({ ...config, storage: v })}
          format={formatStorage}
        />
      </div>
    </div>
  );
}
