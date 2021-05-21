//#include <WiFi.h>
#include "Button.h"
#include "InputGetter.h"
#include <string.h>
#include <TFT_eSPI.h>
#include <SPI.h>
#include <WiFiClientSecure.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
TFT_eSPI tft = TFT_eSPI();
#include <mpu6050_esp32.h>
#include<math.h>
MPU6050 imu;
WiFiClientSecure client;
WiFiClient client2;

char network[] = "MIT";
char password[] = "";

#define BACKGROUND TFT_BLACK
#define BACK TFT_DARKGREEN
#define BALL_COLOR TFT_YELLOW
#define CUE_COLOR TFT_WHITE
#define BALL_COLOR2 TFT_BLACK
#define STICK_COLOR TFT_BLACK


const float half_pi = 1.570796;
const int lower_ang = -80;
const int upper_ang = 80;
const float step_ang = 0.1;
float angle = 0;
float old_angle = 0;
float velocity = 0;

const int DT = 50;
const int RADIUS = 5;
const int HOLE_RAD = 7;
const int LENGTH = 45;

const int RESPONSE_TIMEOUT = 6000;
const int GETTING_PERIOD = 2000;
const int BUTTON_TIMEOUT = 1000;


const uint16_t IN_BUFFER_SIZE = 1000;
const uint16_t OUT_BUFFER_SIZE = 1000;
char request_buffer[IN_BUFFER_SIZE];
char response_buffer[OUT_BUFFER_SIZE] = "0";
const int LOOP_SPEED = 25;
char body[1000];
char username[200];
char gameid[200];
char response[200];
char old_response[200];
char temp[200];
int x = 63;
int y = 79;
int old_X = 0;
int old_Y = 0;
int X = 0;
int Y = 0;
bool pushed_last_time;
unsigned long primary_timer;
const uint8_t BUTTON = 5;
const uint8_t BUTTON2 = 19;
uint8_t state = 0;
char points[1000] = "";
int i;
bool waiting_message = false;
int game_end = 0;
int my_turn = 1;

const uint32_t READING_PERIOD = 150;
double A1 = 55;
const uint8_t NOTE_COUNT = 97; 
uint8_t AUDIO_TRANSDUCER = 26;
uint8_t AUDIO_PWM = 1;
double note_freqs[NOTE_COUNT];
float accel_thresholds[NOTE_COUNT + 1];
float new_note = 0;
float old_note = 0;
float prev_sample = 0;

void setup() {
  tft.init();
  tft.setRotation(2);
  tft.setTextSize(1);
  tft.fillScreen(BACKGROUND);
  tft.fillRect(5, 5, 117, 147, BACK);
  tft.fillCircle(10, 10, HOLE_RAD, STICK_COLOR);
  tft.fillCircle(117, 10, HOLE_RAD, STICK_COLOR);
  tft.fillCircle(117, 147, HOLE_RAD, STICK_COLOR);
  tft.fillCircle(10, 147, HOLE_RAD, STICK_COLOR);
  tft.fillCircle(117, 79, HOLE_RAD, STICK_COLOR);
  tft.fillCircle(10, 79, HOLE_RAD, STICK_COLOR);
  delay(100);
  Serial.begin(115200);
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(BUTTON2, INPUT_PULLUP);
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0) {
    Serial.println("no networks found");
  } else {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i) {
      Serial.printf("%d: %s, Ch:%d (%ddBm) %s ", i + 1, WiFi.SSID(i).c_str(), WiFi.channel(i), WiFi.RSSI(i), WiFi.encryptionType(i) == WIFI_AUTH_OPEN ? "open" : "");
      uint8_t* cc = WiFi.BSSID(i);
      for (int k = 0; k < 6; k++) {
        Serial.print(*cc, HEX);
        if (k != 5) Serial.print(":");
        cc++;
      }
      Serial.println("");
    }
  }
  WiFi.begin(network, password);
  uint8_t count = 0;
  Serial.print("Attempting to connect to ");
  Serial.println(network);
  while (WiFi.status() != WL_CONNECTED && count < 6) {
    delay(500);
    Serial.print(".");
    count++;
  }
  delay(2000);
  if (WiFi.isConnected()) {
    Serial.println("CONNECTED!");
    Serial.printf("%d:%d:%d:%d (%s) (%s)\n", WiFi.localIP()[3], WiFi.localIP()[2],
                  WiFi.localIP()[1], WiFi.localIP()[0],
                  WiFi.macAddress().c_str() , WiFi.SSID().c_str());
    delay(500);
  } else {
    Serial.println("Failed to Connect :/  Going to restart");
    Serial.println(WiFi.status());
    ESP.restart();
  }
  if (imu.setupIMU(1)) {
    Serial.println("IMU Connected!");
  } else {
    Serial.println("IMU Not Connected :/");
    Serial.println("Restarting");
    ESP.restart();
  }
  Serial.printf("Frequencies:\n");
  double note_freq = A1;
  Serial.printf("Accelerometer thresholds:\n");
  new_note = note_freqs[NOTE_COUNT - NOTE_COUNT / 2];
  pinMode(AUDIO_TRANSDUCER, OUTPUT);
  ledcSetup(AUDIO_PWM, 0, 12);
  ledcWrite(AUDIO_PWM, 0);
  ledcAttachPin(AUDIO_TRANSDUCER, AUDIO_PWM);
  randomSeed(analogRead(0));
  //  retrieve(true);
  pushed_last_time = false;
  primary_timer = millis();
}

Button button(BUTTON);
Button button2(BUTTON2);
InputGetter wg;

void loop() {
  uint8_t flag = button.update();
  uint8_t flag2 = button2.update();
  if (flag2 == 2) {
    //restarts esp to state 0
    state = 0;
    tft.fillScreen(TFT_BLACK);
    tft.setCursor(0, 0, 1);
    tft.println("Restarting...");
    wg.reset(username);
    wg.reset(gameid);
    strcpy(old_response, "*"); //make it reprint string
    primary_timer = millis() + 1000;
  }
  else if (state == 0 or state == 1) {
    if (wg.input_state == 3) {
      state += 1;
      if (state == 2) {
        state = 4;
      }
    }
    imu.readAccelData(imu.accelCount);
    float y = -imu.accelCount[1] * imu.gRes;
    wg.update(y, flag, response,state,username,gameid);
    if (strcmp(response, old_response) != 0) {
      tft.fillScreen(TFT_BLACK);
      tft.setCursor(0, 0, 1);
      tft.println(response);
    }
    memset(old_response, 0, sizeof(old_response));
    strcat(old_response, response);
  }
  else if (state == 2 and flag == 1) {
    state = 3;
  }
  if (state == 2 and my_turn == 1) {
    imu.readGyroData(imu.accelCount);
    float z = imu.accelCount[2] * imu.gRes;
    if (z < lower_ang) {
      angle = angle + step_ang;
    } else if (z > upper_ang) {
      angle = angle - step_ang;
    }
    old_X = x + cos(old_angle + half_pi) * LENGTH;
    old_Y = y + sin(old_angle + half_pi) * LENGTH;
    X = x + cos(angle + half_pi) * LENGTH;
    Y = y + sin(angle + half_pi) * LENGTH;
    tft.fillCircle(x, y, RADIUS, CUE_COLOR);
    tft.drawLine(x, y, old_X, old_Y, BACK);
    tft.drawLine(x, y, X, Y, STICK_COLOR);
    old_angle = angle;
  }
  if (state == 3 and my_turn == 1) {
    imu.readAccelData(imu.accelCount);
    float y = imu.accelCount[0] * imu.aRes;
    float x = imu.accelCount[1] * imu.aRes;
    velocity = sqrt(x * x + y * y);
    if (velocity > 1) {
      run_buzzer(velocity,AUDIO_PWM,&old_note,&new_note);
      tft.fillScreen(TFT_BLACK);
      tft.setCursor(0, 0, 1);
      tft.println("Waiting for server...");
      post_hit();
      state = 4;
      angle = 0;
      old_angle = 0;
      primary_timer = millis() + 8000;
    }
  } else if (state == 4) {
    retrieve(false);
    check_game_end();
    if (game_end == 1) {
      state = 0;
      tft.fillScreen(TFT_BLACK);
      tft.setCursor(0, 0, 1);
      tft.println("Game ended! Restarting...");
      wg.reset(username);
      wg.reset(gameid);
      strcpy(old_response, "*"); //make it reprint string
      waiting_message = false;
      primary_timer = millis() + 3000;
    } else if (my_turn == 1) {
      state = 2;
      primary_timer = millis() + 3000;
      waiting_message = false;
      retrieve(true);
    } else {
      if (!waiting_message) {
        tft.fillScreen(TFT_BLACK);
        tft.setCursor(0, 0, 1);
        tft.println("Not your turn!\r\nWaiting for other player...");
        waiting_message = true;
      }
    }
  }
  while (millis() < DT + primary_timer);
  primary_timer = millis();
}
