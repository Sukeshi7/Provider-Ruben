import { useState } from "react";
import ServicePicker  from "./components/ServicePicker";
import ResourceConfig from "./components/ResourceConfig";
import NodePicker     from "./components/NodePicker";
import DeployPanel    from "./components/DeployPanel";

const DEFAULT_CONFIG = { cpu: 2, ram: 4, storage: 40 };

export default function App() {
  const [service,          setService]          = useState(null);
  const [config,           setConfig]           = useState(DEFAULT_CONFIG);
  const [resourcesTouched, setResourcesTouched] = useState(false);
  const [node,             setNode]             = useState(null);
  const [status,           setStatus]           = useState(null);

  async function handleDeploy() {
    setStatus({ type: "loading", message: "Déploiement en cours..." });

    try {
      const res = await fetch("http://localhost:3001/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, config, node }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      setStatus({
        type: "success",
        message: `✓ ${data.message}`,
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: `✗ ${err.message}`,
      });
    }
  }

  return (
    <div className="app">

      <nav className="nav">
        <div className="nav-logo">Projet<span>Ruben</span></div>
        <div className="nav-links">
          <a href="#">Dashboard</a>
          <a href="#">Docs</a>
        </div>
        <div className="nav-cluster">
          <span className="cluster-dot" />
          Cluster local · 3 machines
        </div>
      </nav>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-title">Déploiement</div>
          <div className="sidebar-steps">
            <div className={`sidebar-step ${service ? "done" : "active"}`}>
              <span className="ss-num">01</span>
              <span className="ss-label">Service</span>
              {service && <span className="ss-check">✓</span>}
            </div>
            <div className={`sidebar-step ${resourcesTouched ? "done" : service ? "active" : ""}`}>
              <span className="ss-num">02</span>
              <span className="ss-label">Ressources</span>
              {resourcesTouched && <span className="ss-check">✓</span>}
            </div>
            <div className={`sidebar-step ${node ? "done" : service ? "active" : ""}`}>
              <span className="ss-num">03</span>
              <span className="ss-label">Machine</span>
              {node && <span className="ss-check">✓</span>}
            </div>
            <div className={`sidebar-step ${node ? "active" : ""}`}>
              <span className="ss-num">04</span>
              <span className="ss-label">Déployer</span>
            </div>
          </div>

          {(service || node) && (
            <div className="sidebar-recap">
              {service && (
                <div className="recap-row">
                  <span className="recap-key">Service</span>
                  <span className="recap-val">{service.icon} {service.label}</span>
                </div>
              )}
              <div className="recap-row">
                <span className="recap-key">CPU</span>
                <span className="recap-val">{config.cpu} vCPU</span>
              </div>
              <div className="recap-row">
                <span className="recap-key">RAM</span>
                <span className="recap-val">{config.ram} GB</span>
              </div>
              <div className="recap-row">
                <span className="recap-key">Stockage</span>
                <span className="recap-val">{config.storage} GB</span>
              </div>
              {node && (
                <div className="recap-row">
                  <span className="recap-key">Machine</span>
                  <span className="recap-val">{node.label}</span>
                </div>
              )}
            </div>
          )}
        </aside>

        <main className="main">
          <div className="page-header">
            <h1>Déployer un service</h1>
            <p>Sélectionnez un service, configurez les ressources et choisissez la machine cible.</p>
          </div>
          <div className="steps">
            <ServicePicker
              selected={service}
              onSelect={(s) => { setService(s); setStatus(null); }}
            />
            <ResourceConfig
              service={service}
              config={config}
              onChange={(c) => { setConfig(c); setResourcesTouched(true); }}
            />
            <NodePicker
              selected={node}
              onSelect={(n) => { setNode(n); setStatus(null); }}
            />
            <DeployPanel
              service={service}
              config={config}
              node={node}
              status={status}
              onDeploy={handleDeploy}
            />
          </div>
        </main>
      </div>

      <footer className="footer">
        <span className="footer-logo">Projet Ruben</span>
        <span>Infrastructure locale · Docker Swarm</span>
        <span>© 2025</span>
      </footer>
    </div>
  );
}