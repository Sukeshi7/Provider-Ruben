import { useState, useEffect } from "react";
import { NODES } from "../data/config";

const SERVICES_RUNNING = {
  master: [
    { name: "Nginx", status: "running", port: 80,   cpu: 0.4, ram: 128  },
    { name: "DNS",   status: "running", port: 53,   cpu: 0.1, ram: 48   },
  ],
  node1: [],
  node2: [],
};

function randomBetween(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(1);
}

function useLiveStats() {
  const [stats, setStats] = useState({
    master: { cpu: 18, ram: 34, uptime: "3d 14h" },
    node1:  { cpu: 0,  ram: 12, uptime: "3d 14h" },
    node2:  { cpu: 0,  ram: 10, uptime: "3d 14h" },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        master: { ...prev.master, cpu: randomBetween(12, 28), ram: randomBetween(30, 45) },
        node1:  { ...prev.node1,  cpu: randomBetween(0,  8),  ram: randomBetween(8,  20) },
        node2:  { ...prev.node2,  cpu: randomBetween(0,  6),  ram: randomBetween(8,  18) },
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}

function GaugeBar({ value, max = 100, color = "accent" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="gauge-wrap">
      <div className="gauge-bar">
        <div
          className={`gauge-fill gauge-${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="gauge-val">{value}%</span>
    </div>
  );
}

function MachineCard({ node, stats, services }) {
  const isOnline = true;
  return (
    <div className={`mc-card ${node.role === "master" ? "mc-master" : ""}`}>
      <div className="mc-card-header">
        <div className="mc-card-left">
          <span className={`mc-status-dot ${isOnline ? "online" : "offline"}`} />
          <div>
            <div className="mc-card-title">{node.label}</div>
            <div className="mc-card-host">{node.hostname} · {node.os}</div>
          </div>
        </div>
        <span className={`badge ${node.role === "master" ? "badge-master" : "badge-node"}`}>
          {node.role}
        </span>
      </div>

      <div className="mc-metrics">
        <div className="mc-metric">
          <div className="mc-metric-label">CPU</div>
          <GaugeBar value={stats.cpu} color={stats.cpu > 70 ? "red" : stats.cpu > 40 ? "amber" : "green"} />
        </div>
        <div className="mc-metric">
          <div className="mc-metric-label">RAM</div>
          <GaugeBar value={stats.ram} color={stats.ram > 80 ? "red" : stats.ram > 60 ? "amber" : "blue"} />
        </div>
      </div>

      <div className="mc-meta">
        <div className="mc-meta-item">
          <span className="mc-meta-key">Uptime</span>
          <span className="mc-meta-val">{stats.uptime}</span>
        </div>
        <div className="mc-meta-item">
          <span className="mc-meta-key">Services</span>
          <span className="mc-meta-val">{services.length > 0 ? services.length : "—"}</span>
        </div>
        <div className="mc-meta-item">
          <span className="mc-meta-key">Statut</span>
          <span className="mc-meta-val mc-online">En ligne</span>
        </div>
      </div>

      {services.length > 0 && (
        <div className="mc-services">
          {services.map((s) => (
            <div key={s.name} className="mc-service-row">
              <div className="mc-svc-left">
                <span className="mc-svc-dot" />
                <span className="mc-svc-name">{s.name}</span>
                <span className="mc-svc-port">:{s.port}</span>
              </div>
              <div className="mc-svc-right">
                <span className="mc-svc-cpu">{s.cpu}% CPU</span>
                <span className="mc-svc-ram">{s.ram} MB</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {services.length === 0 && (
        <div className="mc-empty">Aucun service déployé</div>
      )}
    </div>
  );
}

export default function MachinesView() {
  const stats = useLiveStats();

  const nodeStats = {
    master: stats.master,
    node1:  stats.node1,
    node2:  stats.node2,
  };

  return (
    <div className="machines-view">
      <div className="mv-header">
        <div>
          <h1 className="mv-title">Machines</h1>
          <p className="mv-sub">État du cluster local en temps réel</p>
        </div>
        <div className="mv-cluster-info">
          <span className="cluster-dot" />
          <span>3 machines · Docker Swarm</span>
        </div>
      </div>

      <div className="mv-summary">
        <div className="mv-sum-item">
          <div className="mv-sum-label">Machines en ligne</div>
          <div className="mv-sum-val">3 / 3</div>
        </div>
        <div className="mv-sum-sep" />
        <div className="mv-sum-item">
          <div className="mv-sum-label">Services actifs</div>
          <div className="mv-sum-val">2</div>
        </div>
        <div className="mv-sum-sep" />
        <div className="mv-sum-item">
          <div className="mv-sum-label">CPU moyen</div>
          <div className="mv-sum-val">{((stats.master.cpu + stats.node1.cpu + stats.node2.cpu) / 3).toFixed(1)}%</div>
        </div>
        <div className="mv-sum-sep" />
        <div className="mv-sum-item">
          <div className="mv-sum-label">Architecture</div>
          <div className="mv-sum-val">1M · 2N</div>
        </div>
      </div>

      <div className="mv-grid">
        {NODES.map((node) => (
          <MachineCard
            key={node.id}
            node={node}
            stats={nodeStats[node.id] || { cpu: 0, ram: 0, uptime: "—" }}
            services={SERVICES_RUNNING[node.id] || []}
          />
        ))}
      </div>
    </div>
  );
}