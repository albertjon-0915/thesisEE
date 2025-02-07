#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "raspi-webgui";
const char* password = "thesisEE";
const char* mqtt_server = "10.9.141.1";  // Raspberry Pi's IP address
const char* clientID = "ESP32_client1";

bool connected = true;

WiFiClient espClient;
PubSubClient client(espClient);

bool isConnected() {
  if (WiFi.status() == WL_CONNECTED) {
    return true;
  } else {
    return false;
  }
}

void connectToNetwork() {
  while (!isConnected()) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi Connected!");
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  connectToNetwork();

  client.setServer(mqtt_server, 1883);
  while (!client.connected()) {
    Serial.println(".");
    if (client.connect(clientID)) {
      Serial.println("Connected to MQTT Broker!");
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying...");
      delay(2000);
    }
  }

  // Publish a test message
  client.publish("esp32/data/client-1", "Hello from ESP32 client number 1!");
}

void loop() {
  if(!connected){
    connectToNetwork();
  }

  client.loop();
  client.publish("esp32/data/client-1", "Hello from ESP32 client number 1!");
  Serial.println("sending");
  delay(1000);
}
