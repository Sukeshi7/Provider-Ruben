/*
  ProjetRuben — ESP32 SSH Token Receiver
  ----------------------------------------
  Reçoit un token chiffré AES-256-GCM via USB Serial
  Format attendu : TOKEN:<iv_hex>:<authTag_hex>:<cipher_hex>\n
  Déchiffre et affiche le mot de passe SSH en clair

  Dépendances : mbedTLS (intégré ESP32, rien à installer)
*/

#include <Arduino.h>
#include "mbedtls/gcm.h"

// ── CLÉ PARTAGÉE ─────────────────────────────────────────────────
// Doit être IDENTIQUE à la clé dans api/crypto.js
// 32 bytes pour AES-256
const uint8_t AES_KEY[32] = {
  'P','r','o','j','e','t','R','u','b','e','n','2','0','2','5','!',
  '!','P','r','o','j','e','t','R','u','b','e','n','2','0','2','5'
};

// ─────────────────────────────────────────────────────────────────

String inputBuffer = "";

// Convertit une chaîne hex en bytes
int hexToBytes(const String& hex, uint8_t* out, int maxLen) {
  int len = hex.length() / 2;
  if (len > maxLen) return -1;
  for (int i = 0; i < len; i++) {
    out[i] = (uint8_t) strtol(hex.substring(i * 2, i * 2 + 2).c_str(), nullptr, 16);
  }
  return len;
}

// Déchiffre AES-256-GCM
// token format : iv_hex:authTag_hex:cipher_hex
String decryptToken(const String& token) {
  // Séparer les 3 parties
  int sep1 = token.indexOf(':');
  int sep2 = token.indexOf(':', sep1 + 1);
  if (sep1 < 0 || sep2 < 0) return "FORMAT_INVALIDE";

  String ivHex      = token.substring(0, sep1);
  String authTagHex = token.substring(sep1 + 1, sep2);
  String cipherHex  = token.substring(sep2 + 1);

  // Décoder hex → bytes
  uint8_t iv[12], authTag[16], cipher[64], output[64];
  int ivLen     = hexToBytes(ivHex,      iv,      12);
  int tagLen    = hexToBytes(authTagHex, authTag, 16);
  int cipherLen = hexToBytes(cipherHex,  cipher,  64);

  if (ivLen < 0 || tagLen < 0 || cipherLen < 0) return "HEX_INVALIDE";

  // Déchiffrement mbedTLS GCM
  mbedtls_gcm_context gcm;
  mbedtls_gcm_init(&gcm);

  int ret = mbedtls_gcm_setkey(&gcm, MBEDTLS_CIPHER_ID_AES, AES_KEY, 256);
  if (ret != 0) {
    mbedtls_gcm_free(&gcm);
    return "ERREUR_CLÉ";
  }

  ret = mbedtls_gcm_auth_decrypt(
    &gcm,
    cipherLen,
    iv,      ivLen,
    nullptr, 0,        // pas d'additional data
    authTag, tagLen,
    cipher,
    output
  );

  mbedtls_gcm_free(&gcm);

  if (ret != 0) return "ECHEC_DECHIFFREMENT";

  output[cipherLen] = '\0';
  return String((char*)output);
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n[ESP32] ProjetRuben — En attente d'un token...");
}

void loop() {
  // Lire caractère par caractère depuis USB
  while (Serial.available()) {
    char c = Serial.read();

    if (c == '\n') {
      // Message complet reçu
      inputBuffer.trim();

      if (inputBuffer.startsWith("TOKEN:")) {
        String token = inputBuffer.substring(6); // après "TOKEN:"

        Serial.println("\n[ESP32] Token reçu !");
        Serial.println("[ESP32] Déchiffrement en cours...");

        String password = decryptToken(token);

        if (password.startsWith("ERREUR") ||
            password.startsWith("ECHEC")  ||
            password.startsWith("FORMAT") ||
            password.startsWith("HEX")) {
          Serial.println("[ESP32] ERREUR : " + password);
        } else {
          Serial.println("╔══════════════════════════╗");
          Serial.println("║   MOT DE PASSE SSH       ║");
          Serial.println("╠══════════════════════════╣");
          Serial.println("║  " + password + "  ║");
          Serial.println("╚══════════════════════════╝");
          Serial.println("[ESP32] Utilisez ce mot de passe pour vous connecter en SSH.");
        }
      } else {
        Serial.println("[ESP32] Message inconnu : " + inputBuffer);
      }

      inputBuffer = "";
    } else {
      inputBuffer += c;
    }
  }
}
