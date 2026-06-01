import { MACHINES, getBestProvider, formatStorage } from "../data/machines";

const ROLE_LABEL = { master: "master", shared: "shared", node: "node" };
const ROLE_CLS   = { master: "badge-master", shared: "badge-shared", node: "badge-node" };

export default function RecommendPanel({ configs, onDeploy }) {
  const rows = MACHINES.map((m) => ({
    machine:  m,
    config:   configs[m.id],
    provider: getBestProvider(m, configs[m.id]),
  }));

  const totalRam     = MACHINES.reduce((s, m) => s + configs[m.id].ram, 0);
  const totalStorage = MACHINES.reduce((s, m) => s + configs[m.id].storage, 0);
  const totalCpu     = MACHINES.reduce((s, m) => s + configs[m.id].cpu, 0);
  const totalPrice   = rows.reduce((s, r) => s + r.provider.price, 0);

  return (
    <div className="rec-panel">
      <div className="rec-header">
        <span className="rec-title">Récapitulatif</span>
        <span className="rec-live"><span className="live-dot" />temps réel</span>
      </div>

      <div className="rec-stats">
        <div className="rec-stat">
          <div className="rs-label">vCPU total</div>
          <div className="rs-value">{totalCpu}</div>
        </div>
        <div className="rec-stat">
          <div className="rs-label">RAM totale</div>
          <div className="rs-value">{totalRam} GB</div>
        </div>
        <div className="rec-stat">
          <div className="rs-label">Stockage</div>
          <div className="rs-value">{formatStorage(totalStorage)}</div>
        </div>
        <div className="rec-stat">
          <div className="rs-label">Architecture</div>
          <div className="rs-value">1M · 3N</div>
        </div>
      </div>

      <div className="rec-rows">
        {rows.map(({ machine, config, provider }, i) => (
          <div key={machine.id} className="rec-row">
            <span className="rec-idx">0{i + 1}</span>
            <div className="rec-info">
              <div className="rec-row-top">
                <span className="rec-machine-title">{machine.title}</span>
                <span className={`badge ${ROLE_CLS[machine.role]}`}>
                  {ROLE_LABEL[machine.role]}
                </span>
              </div>
              <div className="rec-row-detail">
                {config.cpu} vCPU · {config.ram} GB RAM · {formatStorage(config.storage)}
              </div>
            </div>
            <div className="rec-provider">
              <div className="rec-provider-name">{provider.name}</div>
              <div className="rec-provider-price">
                {provider.price.toFixed(2)} <em>€/mo</em>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rec-footer">
        <div className="rec-total">
          <div className="rec-total-label">Total estimé / mois</div>
          <div className="rec-total-price">
            <sup>€</sup>{totalPrice.toFixed(2)}
          </div>
        </div>
        <button className="btn-deploy" onClick={onDeploy}>
          Générer Ansible / Terraform →
        </button>
      </div>
    </div>
  );
}
