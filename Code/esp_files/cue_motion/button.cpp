#include "Arduino.h"
#include "Button.h"

Button::    Button(int p) {
  flag = 0;
  state = 0;
  pin = p;
  state_2_start_time = millis(); //init
  button_change_time = millis(); //init
  debounce_duration = 10;
  long_press_duration = 500;
  button_pressed = 0;
}

int Button::update() {
  read();
  flag = 0;
  if (state == 0) {
    if (button_pressed) {
      state = 1;
      button_change_time = millis();
    }
  } else if (state == 1) {
    if (!button_pressed) {
      button_change_time = millis();
      state = 0;
    } else if (button_pressed and millis() - button_change_time >= debounce_duration) {
      state = 2;
      state_2_start_time = millis();
    }
  } else if (state == 2) {
    if (button_pressed and millis() - state_2_start_time >= long_press_duration) {
      state = 3;
    } else if (!button_pressed) {
      button_change_time = millis();
      state = 4;
    }
  } else if (state == 3) {
    if (!button_pressed) {
      button_change_time = millis();
      state = 4;
    }
  } else if (state == 4) {
    if (!button_pressed and millis() - button_change_time >= debounce_duration) {
      if (millis() - state_2_start_time >= long_press_duration) {
        flag = 2;
      } else {
        flag = 1;
      }
      state = 0;
    } else if (button_pressed and millis() - state_2_start_time < long_press_duration) {
      button_change_time = millis();
      state = 2;
    } else if (button_pressed and millis() - state_2_start_time >= long_press_duration) {
      button_change_time = millis();
      state = 3;
    }
  }
  return flag;
}

void Button::read() {
  uint8_t button_state = digitalRead(pin);
  button_pressed = !button_state;
}
