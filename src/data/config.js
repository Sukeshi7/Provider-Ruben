// Types de services déployables
export const SERVICES = [
  {
    id: "multisite",
    label: "Hébergement multi-site",
    icon: "🌐",
    desc: "Plusieurs sites PHP sur un seul serveur",
    stack: ["Apache", "PHP 8.3", "MariaDB", "phpMyAdmin"],
    color: "amber",
    minRam: 1,
    minCpu: 1,
  },
  {
    id: "ready",
    label: "Serveur prêt à l'emploi",
    icon: "⚡",
    desc: "Serveur configuré clé en main, Nginx + SSL",
    stack: ["Nginx", "SSL", "Firewall", "DNS"],
    color: "blue",
    minRam: 2,
    minCpu: 1,
  },
  {
    id: "wordpress",
    label: "WordPress / Node.js",
    icon: "📦",
    desc: "Stack WordPress ou application Node.js",
    stack: ["Node.js 20", "WordPress", "Redis", "PM2"],
    color: "green",
    minRam: 2,
    minCpu: 1,
  },
  {
    id: "vps",
    label: "VPS Debian",
    icon: "🖥️",
    desc: "Machine Debian bare-metal, accès root complet",
    stack: ["Debian 12", "SSH", "UFW", "Fail2ban"],
    color: "gray",
    minRam: 1,
    minCpu: 1,
  },
];

// Machines physiques du cluster local
export const NODES = [
  {
    id: "master",
    label: "Master",
    hostname: "192.168.1.10",
    role: "master",
    os: "Debian 12",
  },
  {
    id: "node1",
    label: "Node 1",
    hostname: "192.168.1.11",
    role: "node",
    os: "Debian 12",
  },
  {
    id: "node2",
    label: "Node 2",
    hostname: "192.168.1.12",
    role: "node",
    os: "Debian 12",
  },
];

export const CPU_OPTS     = [1, 2, 4, 8];
export const RAM_OPTS     = [1, 2, 4, 8, 16];
export const STORAGE_OPTS = [20, 40, 80, 160, 320];

export function getImpact(cpu, ram) {
  if (cpu >= 4 && ram >= 8)  return { label: "Haute performance", color: "green" };
  if (cpu >= 2 && ram >= 4)  return { label: "Usage standard",    color: "blue"  };
  return                            { label: "Minimal",           color: "gray"  };
}
