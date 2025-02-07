int pirPin = 4;
int relPin = 3;

int prev = LOW;
int current;
bool hasMovement = false;

// shutdown countdown
unsigned long currentMillis = 0;
unsigned long previousMillis = 0;
const long interval = 1000;
unsigned long shutdownTimer = 180000; // 180000 - 5mins

// check countdown
unsigned long lastCheck = 0;
const int checkInterval = 500;

void setup() {
  Serial.begin(9600);

  pinMode(pirPin, INPUT);
  pinMode(relPin, OUTPUT);

  digitalWrite(pirPin, LOW);
  digitalWrite(relPin, HIGH);

  calibrateSensor(20);
}

void loop() {
  if (millis() - lastCheck >= checkInterval) {
    // Update time
    lastCheck = millis();

    // Detect motion
    motionDetect();

    if (hasMovement) {
      if (isReadytoTurnOff(shutdownTimer)) {
        printMsg("shutdown");
        digitalWrite(relPin, LOW);
        hasMovement = false;
      } else {
        digitalWrite(relPin, HIGH);
      }
    } else {
      digitalWrite(relPin, LOW);
    }
  }
}


/*

    THIS IS WHERE THE REST OF THE FUNCTIONS LIES:

*/

// give time to start everything up
void calibrateSensor(int calibrateTime) {
  printMsg("Calibrating sensors");
  for (int i = 0; i < calibrateTime; i++) {
    printMsg(".");
    delay(50);
  }
}

/*

HELPERS:
remove if necessary - just for testing

*/

//  for printing message on serial monitor
void printMsg(String message) {
  Serial.println(message);
}

// beta test - for refactor if necessary
bool isReadytoTurnOff(unsigned long millisInterval) {
  return (millis() - previousMillis >= millisInterval);
}


/*

FUNCTIONS TO RUN THE CODE:

*/

// motion sensor detection
void motionDetect() {
  current = digitalRead(pirPin);

  if (current == HIGH && prev == LOW) {  // Movement detected
    printMsg("movement on");
    previousMillis = millis();  // Update only when movement starts
    hasMovement = true;
  }

  prev = current;
}
