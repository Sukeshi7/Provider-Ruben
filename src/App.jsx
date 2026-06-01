import { useState } from "react";
import { MACHINES, getBestProvider } from "./data/machines";
import MachineCard from "./components/MachineCard";
import ArchBar from "./components/ArchBar";
import RecommendPanel from "./components/RecommendPanel";

function initConfigs() {
  return Object.fromEntries(MACHINES.map((m) => [m.id, { ...m.defaults }]));
}

export default function App() {
  const [configs, setConfigs] = useState(initConfigs);

  function updateConfig(id, newConfig) {
    setConfigs((prev) => ({ ...prev, [id]: newConfig }));
  }

  function handleDeploy() {
    const lines = MACHINES.map((m) => {
      const cfg = configs[m.id];
      const p = getBestProvider(m, cfg);
      return `${m.title} (${m.role}): ${cfg.cpu} vCPU, ${cfg.ram}GB RAM, ${cfg.storage}GB — ${p.name} @ ${p.price.toFixed(2)}€/mo`;
    }).join("\n");
    alert("Config prête !\n\n" + lines + "\n\n→ Branchez votre API Ansible/Terraform ici.");
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">Projet<span>Ruben</span></div>
        <div className="nav-links">
          <a href="#config">Configurateur</a>
          <a href="#arch">Architecture</a>
          <a href="#">Docs</a>
        </div>
        <button className="nav-btn" onClick={() => document.getElementById("config").scrollIntoView({ behavior: "smooth" })}>
          Déployer
        </button>
      </nav>

      <main className="main">
        <section className="hero">
          <h1>Configurez votre<br /><strong>cluster privé</strong></h1>
          <p>4 machines modulaires. Ajustez CPU, RAM et stockage —<br />le provider optimal est calculé en temps réel.</p>
        </section>

        <section id="arch">
          <ArchBar configs={configs} />
        </section>

        <section id="config" className="config-section">
          <div className="machines-grid">
            {MACHINES.map((m) => (
              <MachineCard
                key={m.id}
                machine={m}
                config={configs[m.id]}
                onChange={(newConfig) => updateConfig(m.id, newConfig)}
              />
            ))}
          </div>
          <RecommendPanel configs={configs} onDeploy={handleDeploy} />
        </section>
      </main>

      <footer className="footer">
        <span className="footer-logo">Projet Ruben</span>
        <span>Infrastructure privée · Cluster managé</span>
        <span>© 2025</span>
      </footer>
    </div>
  );
}
