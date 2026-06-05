const { SerialPort } = require("serialport");
const BAUD_RATE = 115200;

async function getESP32Port() {
  const ports = await SerialPort.list();
  const esp = ports.find(p =>
    p.manufacturer && (
      p.manufacturer.includes("Silicon") ||
      p.manufacturer.includes("CP210") ||
      p.manufacturer.includes("CH340") ||
      p.manufacturer.includes("FTDI") ||
      p.manufacturer.includes("Microsoft")
    )
  );
  if (!esp) throw new Error("ESP32 non détecté");
  return esp.path;
}

async function sendTokenToESP32(token) {
  const portPath = process.env.ESP32_PORT || await getESP32Port();
  return new Promise((resolve, reject) => {
    const port = new SerialPort({ path: portPath, baudRate: BAUD_RATE, autoOpen: false, hupcl: false });
    port.open((err) => {
      if (err) return reject(new Error(`Impossible d'ouvrir ${portPath} : ${err.message}`));
      const message = `PWD:${token}\n`;
      setTimeout(() => {
        port.write(message, "utf8", (writeErr) => {
          if (writeErr) { port.close(); return reject(writeErr); }
          port.drain(() => { port.close(); resolve({ success: true }); });
        });
      }, 500);
    });
  });
}

async function listPorts() {
  const ports = await SerialPort.list();
  return ports.map(p => ({ path: p.path, manufacturer: p.manufacturer }));
}

module.exports = { sendTokenToESP32, listPorts };