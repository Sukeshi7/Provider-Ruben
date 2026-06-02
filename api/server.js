require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const { generatePassword, encrypt, decrypt } = require("./aes");
const { sendTokenToESP32, listPorts }        = require("./esp32");

const app  = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ── POST /api/deploy ──────────────────────────────────────────────
// Reçoit : { service, config, node }
// Retourne : { success, message, token (chiffré) }
app.post("/api/deploy", async (req, res) => {
  const { service, config, node } = req.body;

  if (!service || !config || !node) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  try {
    // 1 — Générer un mot de passe SSH fort
    const password = generatePassword(16);
    console.log(`[deploy] Mot de passe généré pour ${node.label}`);

    // 2 — Chiffrer le mot de passe avec AES-256-GCM
    const token = encrypt(password);
    console.log(`[deploy] Token chiffré : ${token.substring(0, 30)}...`);

    // 3 — Envoyer le token chiffré vers l'ESP32 via USB
    const esp32Result = await sendTokenToESP32(token);
    console.log(`[deploy] Token envoyé sur ${esp32Result.port}`);

    // 4 — Ici : brancher Docker Swarm / docker stack deploy
    // exec(`docker stack deploy -c stacks/${service.id}.yml ${service.id}`)
    console.log(`[deploy] Service ${service.id} → ${node.hostname}`);

    res.json({
      success:  true,
      message:  `${service.label} déployé sur ${node.label}. Mot de passe envoyé sur l'ESP32.`,
      node:     node.label,
      hostname: node.hostname,
      service:  service.id,
      // On ne renvoie PAS le mot de passe en clair au front — sécurité
      tokenSent: true,
    });

  } catch (err) {
    console.error("[deploy] Erreur :", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/ports ────────────────────────────────────────────────
// Liste les ports USB disponibles (debug)
app.get("/api/ports", async (req, res) => {
  try {
    const ports = await listPorts();
    res.json({ ports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/test-crypto ──────────────────────────────────────────
// Teste le chiffrement sans ESP32
app.get("/api/test-crypto", (req, res) => {
  const password  = generatePassword(16);
  const token     = encrypt(password);
  const decrypted = decrypt(token);
  res.json({
    original:  password,
    encrypted: token,
    decrypted,
    match: password === decrypted,
  });
});

app.listen(PORT, () => {
  console.log(`\n API ProjetRuben démarrée sur http://localhost:${PORT}`);
  console.log(` POST /api/deploy      — déployer un service`);
  console.log(` GET  /api/ports       — lister les ports USB`);
  console.log(` GET  /api/test-crypto — tester le chiffrement\n`);
});
