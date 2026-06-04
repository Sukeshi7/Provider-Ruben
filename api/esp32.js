const { SerialPort } = require("serialport");

// Port USB de l'ESP32 — changer selon gestionnaire de périphériques
const PORT_PATH = process.env.ESP32_PORT || "COM3";
const BAUD_RATE = 115200;

/**
 * Envoie un token chiffré vers l'ESP32 via USB série
 * Format envoyé : TOKEN:<iv:authTag:ciphertext>\n
 */
async function sendTokenToESP32(encryptedToken) {
  return new Promise((resolve, reject) => {
    const port = new SerialPort({
      path: PORT_PATH,
      baudRate: BAUD_RATE,
      autoOpen: false,
    });

    port.open((err) => {
      if (err) {
        return reject(new Error(`Impossible d'ouvrir ${PORT_PATH} : ${err.message}`));
      }

      const message = `PWD:${encryptedToken}\n`;
      // Attendre que l'ESP32 soit prêt (boot ~2s)
      setTimeout(() => {
        port.write(message, "utf8", (writeErr) => {
          if (writeErr) {
            port.close();
            return reject(new Error(`Erreur envoi : ${writeErr.message}`));
          }

          port.drain(() => {
            port.close();
            resolve({ success: true, port: PORT_PATH, message });
          });
        });
      }, 2000);
    });
  });
}

/**
 * Liste les ports série disponibles (utilitaire debug)
 */
async function listPorts() {
  const ports = await SerialPort.list();
  return ports.map((p) => ({ path: p.path, manufacturer: p.manufacturer }));
}

module.exports = { sendTokenToESP32, listPorts };