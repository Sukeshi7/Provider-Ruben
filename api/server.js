require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const { exec }   = require("child_process");
const path       = require("path");
const { generatePassword, encrypt, decrypt } = require("./aes");
const { sendTokenToESP32, listPorts }        = require("./esp32");

const app  = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.post("/api/deploy", async (req, res) => {
  const { service, config, node } = req.body;

  if (!service || !config || !node) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  try {
    const password = generatePassword(16);
    console.log(`[deploy] Mot de passe SSH généré pour ${node.label}`);

    try {
      await sendTokenToESP32(password);
      console.log(`[deploy] Mot de passe envoyé sur ${process.env.ESP32_PORT}`);
    } catch (esp32Err) {
      console.warn(`[deploy] ESP32 non disponible : ${esp32Err.message}`);
    }

    const stackFile = path.resolve(__dirname, `../stacks/${service.id}.yml`);
    const stackName = service.id;

    // Le mot de passe SSH est pour le VPS uniquement
    // Les autres services (wordpress, multisite) ont leurs propres mots de passe fixes dans le yml
    const env = Object.assign({}, process.env, {
      CPU_LIMIT: String(config.cpu),
      RAM_LIMIT: `${config.ram * 1024}M`,
      VPS_ROOT_PASSWORD: password,   // uniquement pour le VPS Debian
    });

    const deployCmd = `docker stack deploy -c "${stackFile}" ${stackName} --with-registry-auth`;

    console.log(`[deploy] Lancement : ${stackName} → ${node.hostname}`);

    exec(deployCmd, { env }, (err, stdout, stderr) => {
      if (err) {
        console.error(`[deploy] Erreur docker : ${stderr}`);
        return res.status(500).json({
          error: `Erreur Docker Swarm : ${stderr || err.message}`,
          password,
          tokenSent: false,
        });
      }

      console.log(`[deploy] Stack déployée :\n${stdout}`);
      res.json({
        success:   true,
        message:   `${service.label} déployé sur ${node.label}.`,
        node:      node.label,
        hostname:  node.hostname,
        service:   service.id,
        password,
        tokenSent: true,
        dockerOutput: stdout,
      });
    });

  } catch (err) {
    console.error("[deploy] Erreur :", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/status/:stack", (req, res) => {
  const { stack } = req.params;
  exec(`docker stack ps ${stack} --format json`, (err, stdout) => {
    if (err) return res.json({ running: false, services: [] });
    try {
      const lines    = stdout.trim().split("\n").filter(Boolean);
      const services = lines.map((l) => JSON.parse(l));
      res.json({ running: true, services });
    } catch {
      res.json({ running: true, raw: stdout });
    }
  });
});

app.get("/api/nodes", (req, res) => {
  exec("docker node ls --format json", (err, stdout) => {
    if (err) return res.status(500).json({ error: "Docker Swarm non initialisé", detail: err.message });
    try {
      const lines = stdout.trim().split("\n").filter(Boolean);
      const nodes = lines.map((l) => JSON.parse(l));
      res.json({ nodes });
    } catch {
      res.json({ raw: stdout });
    }
  });
});

app.get("/api/ports", async (req, res) => {
  try {
    const ports = await listPorts();
    res.json({ ports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/test-crypto", (req, res) => {
  const password  = generatePassword(16);
  const token     = encrypt(password);
  const decrypted = decrypt(token);
  res.json({ original: password, encrypted: token, decrypted, match: password === decrypted });
});

app.listen(PORT, () => {
  console.log(`\n API ProjetRuben démarrée sur http://localhost:${PORT}`);
  console.log(` POST /api/deploy         — déployer un service`);
  console.log(` GET  /api/status/:stack  — état d'un stack`);
  console.log(` GET  /api/nodes          — nodes Docker Swarm`);
  console.log(` GET  /api/ports          — lister les ports USB`);
  console.log(` GET  /api/test-crypto    — tester le chiffrement\n`);
});