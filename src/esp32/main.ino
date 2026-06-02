String inputBuffer = "";

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("[ESP32] En attente d'un mot de passe...");
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      inputBuffer.trim();
      if (inputBuffer.startsWith("PWD:")) {
        String password = inputBuffer.substring(4);
        Serial.println("MOT DE PASSE SSH : " + password);
      }
      inputBuffer = "";
    } else {
      inputBuffer += c;
    }
  }
}