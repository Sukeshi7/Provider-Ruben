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
    id: "node_server",
    label: "Serveur Node.js",
    icon: "⚡",
    desc: "Serveur Node.js prêt à l'emploi avec PM2",
    stack: ["Node.js", "PM2", "Nginx"],
    color: "blue",
    minRam: 1,
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

export const NODES = [
  {
    id: "master",
    label: "WordPress",
    hostname: "35.233.39.41",
    role: "master",
    os: "Debian 12",
  },
  {
    id: "node1",
    label: "Multisite",
    hostname: "34.38.220.206",
    role: "node",
    os: "Debian 12",
  },
  {
    id: "node2",
    label: "Node Server",
    hostname: "34.62.22.224",
    role: "node",
    os: "Debian 12",
  },
  {
    id: "node3",
    label: "VPS Debian",
    hostname: "34.62.75.51",
    role: "node",
    os: "Debian 12",
  },
];

export const CPU_OPTS     = [1, 2, 4, 8];
export const RAM_OPTS     = [1, 2, 4, 8, 16];
export const STORAGE_OPTS = [20, 40, 80, 160, 320];

export function getImpact(cpu, ram) {
  if (cpu >= 4 && ram >= 8) return { label: "Haute performance", color: "green" };
  if (cpu >= 2 && ram >= 4) return { label: "Usage standard",    color: "blue"  };
  return                           { label: "Minimal",           color: "gray"  };
}