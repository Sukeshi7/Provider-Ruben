#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SDA_PIN 17
#define SCL_PIN 18

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

String inputBuffer = "";
String lastVmType = "---";
String lastStatus = "En attente...";
unsigned long lastUpdateTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);

  Wire.begin(SDA_PIN, SCL_PIN);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("Erreur : écran SSD1306 non trouvé !");
    while (1);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("VM Provider");
  display.println("En attente...");
  display.display();

  Serial.println("[ESP32] Prêt — écran SSD1306 initialisé");
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    inputBuffer += c;

    if (c == '\n') {
      inputBuffer.trim();
      parseAndDisplay(inputBuffer);
      inputBuffer = "";
      lastUpdateTime = millis();
    }
  }

  if (millis() - lastUpdateTime > 5000) {
    updateDisplay();
    lastUpdateTime = millis();
  }
}

void parseAndDisplay(String data) {
  // Format PWD: (depuis notre API)
  if (data.startsWith("PWD:")) {
    lastVmType = data.substring(4);
    lastStatus = "VM lancée !";
    Serial.println("[ESP32] Mot de passe reçu : " + lastVmType);
    updateDisplay();
    return;
  }

  // Format JSON (compatibilité collègue)
  int vmTypePos = data.indexOf("\"vm_type\":\"");
  if (vmTypePos != -1) {
    int startIdx = vmTypePos + 11;
    int endIdx = data.indexOf("\"", startIdx);
    if (endIdx != -1) {
      lastVmType = data.substring(startIdx, endIdx);
    }
  }

  lastStatus = "VM lancée !";
  Serial.println("[ESP32] VM reçue : " + lastVmType);
  updateDisplay();
}

void updateDisplay() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  display.setCursor(0, 0);
  display.println("=== VM Provider ===");

  display.setCursor(0, 12);
  display.println("Mot de passe SSH:");
  display.setCursor(0, 20);
  display.setTextSize(2);
  display.println(lastVmType);

  display.setTextSize(1);
  display.setCursor(0, 40);
  display.println("Statut:");
  display.setCursor(0, 48);
  display.println(lastStatus);

  display.setCursor(0, 56);
  display.println("Ready");

  display.display();
}
