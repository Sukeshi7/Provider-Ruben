export default function DeployPanel({ service, config, node, status, onDeploy }) {
  const ready = service && node;

  return (
    <div className="step-block deploy-panel">
      <div className="step-header">
        <span className="step-num">04</span>
        <div>
          <div className="step-title">Déployer</div>
          <div className="step-sub">Vérifiez la configuration et lancez le déploiement Ansible</div>
        </div>
      </div>

      {ready ? (
        <div className="deploy-summary">
          <div className="ds-row">
            <span className="ds-key">Service</span>
            <span className="ds-val">{service.icon} {service.label}</span>
          </div>
          <div className="ds-row">
            <span className="ds-key">Stack</span>
            <span className="ds-val">{service.stack.join(" · ")}</span>
          </div>
          <div className="ds-row">
            <span className="ds-key">CPU</span>
            <span className="ds-val">{config.cpu} vCPU</span>
          </div>
          <div className="ds-row">
            <span className="ds-key">RAM</span>
            <span className="ds-val">{config.ram} GB</span>
          </div>
          <div className="ds-row">
            <span className="ds-key">Stockage</span>
            <span className="ds-val">{config.storage} GB</span>
          </div>
          <div className="ds-row">
            <span className="ds-key">Machine cible</span>
            <span className="ds-val">
              {node.label} — <span className="ds-host">{node.hostname}</span>
            </span>
          </div>
          <div className="ds-row">
            <span className="ds-key">Playbook Ansible</span>
            <span className="ds-val ds-code">roles/{service.id}/main.yml</span>
          </div>
        </div>
      ) : (
        <div className="deploy-empty">
          Complétez les étapes 01, 02 et 03 pour déployer.
        </div>
      )}

      {status && (
        <div className={`deploy-status status-${status.type}`}>
          <span className="status-dot-anim" />
          {status.message}
        </div>
      )}

      <button
        className="btn-deploy"
        disabled={!ready || status?.type === "loading"}
        onClick={onDeploy}
      >
        {status?.type === "loading" ? "Déploiement en cours..." : "Lancer le déploiement →"}
      </button>
    </div>
  );
}
