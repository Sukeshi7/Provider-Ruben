export const MACHINES = [
  {
    id: "master",
    role: "master",
    title: "Serveur principal",
    description: "Point d'entrée du cluster. Gère le routage, le DNS et le firewall.",
    stack: ["Nginx", "Firewall", "DNS", "SSL"],
    cpuOpts: [1, 2, 4, 8],
    ramOpts: [2, 4, 8, 16, 32],
    storageOpts: [40, 80, 160, 320],
    defaults: { cpu: 2, ram: 4, storage: 80 },
    providers: [
      { cpu: 1, ram: 2,  storage: 40,  name: "Scaleway DEV1-XS", price: 3.99  },
      { cpu: 2, ram: 4,  storage: 80,  name: "Hetzner CX22",     price: 5.83  },
      { cpu: 2, ram: 8,  storage: 80,  name: "Hetzner CX32",     price: 11.66 },
      { cpu: 4, ram: 8,  storage: 160, name: "Hetzner CX42",     price: 22.90 },
      { cpu: 4, ram: 16, storage: 160, name: "OVH VPS Pro",      price: 29.99 },
      { cpu: 8, ram: 32, storage: 320, name: "OVH Advance-1",    price: 59.99 },
    ],
  },
  {
    id: "multisite",
    role: "shared",
    title: "Hébergement multi-site",
    description: "Héberge plusieurs sites PHP sur un même serveur mutualisé.",
    stack: ["Apache", "PHP 8.3", "MariaDB", "phpMyAdmin"],
    cpuOpts: [1, 2, 4],
    ramOpts: [1, 2, 4, 8],
    storageOpts: [20, 50, 100, 200],
    defaults: { cpu: 1, ram: 2, storage: 50 },
    providers: [
      { cpu: 1, ram: 1,  storage: 20,  name: "OVH Starter",    price: 3.50  },
      { cpu: 1, ram: 2,  storage: 50,  name: "OVH Pro",        price: 5.99  },
      { cpu: 2, ram: 4,  storage: 100, name: "Hetzner CX22",   price: 5.83  },
      { cpu: 2, ram: 8,  storage: 200, name: "Hetzner CX32",   price: 11.66 },
      { cpu: 4, ram: 8,  storage: 200, name: "Scaleway GP1-S", price: 14.99 },
    ],
  },
  {
    id: "wordpress",
    role: "node",
    title: "WordPress / Node.js",
    description: "Node dédié aux apps WordPress et projets Node.js.",
    stack: ["Node.js 20", "WordPress", "Redis", "PM2"],
    cpuOpts: [1, 2, 4, 8],
    ramOpts: [2, 4, 8, 16],
    storageOpts: [20, 40, 80, 160],
    defaults: { cpu: 2, ram: 4, storage: 40 },
    providers: [
      { cpu: 1, ram: 2,  storage: 20,  name: "Hetzner CX11",         price: 3.79  },
      { cpu: 2, ram: 4,  storage: 40,  name: "Hetzner CX22",         price: 5.83  },
      { cpu: 2, ram: 8,  storage: 80,  name: "Hetzner CX32",         price: 11.66 },
      { cpu: 4, ram: 8,  storage: 80,  name: "DigitalOcean CPU-Opt", price: 21.00 },
      { cpu: 4, ram: 16, storage: 160, name: "Vultr High Perf",      price: 40.00 },
      { cpu: 8, ram: 16, storage: 160, name: "Hetzner CX52",         price: 35.90 },
    ],
  },
  {
    id: "vps",
    role: "node",
    title: "VPS Debian",
    description: "Machine Debian bare-metal, accès root complet, usage libre.",
    stack: ["Debian 12", "SSH", "UFW", "Fail2ban"],
    cpuOpts: [1, 2, 4, 8],
    ramOpts: [1, 2, 4, 8, 16],
    storageOpts: [20, 40, 80, 160, 320],
    defaults: { cpu: 1, ram: 2, storage: 40 },
    providers: [
      { cpu: 1, ram: 1,  storage: 20,  name: "Contabo VPS XS",   price: 3.99  },
      { cpu: 1, ram: 2,  storage: 40,  name: "Hetzner CX11",     price: 3.79  },
      { cpu: 2, ram: 4,  storage: 80,  name: "Hetzner CX22",     price: 5.83  },
      { cpu: 4, ram: 8,  storage: 160, name: "OVH VPS Value",    price: 7.99  },
      { cpu: 4, ram: 16, storage: 320, name: "Scaleway GP1-XS",  price: 28.90 },
      { cpu: 8, ram: 16, storage: 320, name: "Hetzner CX52",     price: 35.90 },
    ],
  },
];

export function getBestProvider(machine, config) {
  const { cpu, ram, storage } = config;
  const scored = machine.providers.map((p) => {
    const cpuScore    = Math.abs(p.cpu - cpu) * 3;
    const ramScore    = Math.abs(p.ram - ram) * 2;
    const storageScore = Math.abs(p.storage / 10 - storage / 10);
    return { ...p, score: cpuScore + ramScore + storageScore };
  });
  return scored.sort((a, b) => a.score - b.score)[0];
}

export function formatStorage(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + " TB" : n + " GB";
}
