require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const { generatePassword, encrypt, decrypt } = require("./aes");
const { sendTokenToESP32, listPorts } = require("./esp32");

const app  = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.post("/api/deploy", async (req, res) => {
  const { service, config, node } = req.body;
  if (!service || !config || !node) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  const password = generatePassword(16);
  console.log(`[deploy] Mot de passe SSH généré pour ${node.label}`);

  try {
    await sendTokenToESP32(password);
    console.log(`[deploy] Mot de passe envoyé sur ESP32`);
  } catch (err) {
    console.warn(`[deploy] ESP32 non disponible : ${err.message}`);
  }

  console.log(`[deploy] Service ${service.id} → ${node.hostname} (${node.label})`);
  console.log(`[deploy] Config : ${config.cpu} vCPU, ${config.ram}GB RAM, ${config.storage}GB`);

  res.json({
    success: true,
    message: `${service.label} déployé sur ${node.label} (${node.hostname}).`,
    password,
  });
});

app.get("/api/ports", async (req, res) => {
  try { res.json({ ports: await listPorts() }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/test-crypto", (req, res) => {
  const password  = generatePassword(16);
  const token     = encrypt(password);
  const decrypted = decrypt(token);
  res.json({ original: password, encrypted: token, decrypted, match: password === decrypted });
});

app.listen(PORT, () => {
  console.log(`\n API ProjetRuben démarrée sur http://localhost:${PORT}`);
  console.log(` POST /api/deploy     — déployer un service`);
  console.log(` GET  /api/ports      — lister les ports USB`);
  console.log(` GET  /api/test-crypto — tester le chiffrement\n`);
});