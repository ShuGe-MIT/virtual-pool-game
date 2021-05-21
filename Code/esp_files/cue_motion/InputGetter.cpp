#include "Arduino.h"
#include "InputGetter.h"
InputGetter::InputGetter() {
  input_state = 0;
  memset(msg, 0, sizeof(msg));
  char_index = 0;
  scrolling_timer = millis();
}
void InputGetter:: reset(char* output) {
  strcpy(output, "");
  strcpy(query_string, "");
  input_state = 0;
}
void InputGetter:: update(float angle, int button, char* output,int state, char* username, char* gameid) {
  if (input_state == 0) {
    if (state == 0) {
      strcpy(msg, "Press to start entering username");
    } else {
      strcpy(msg, "Press to start entering gameid");
    }
    strcpy(output, msg);
    if (button == 1) {
      input_state = 1;
      char_index = 0;
      strcpy(query_string, "");
      scrolling_timer = millis();
    }
  } else if (input_state == 1) {
    strcpy(output, query_string);
    if (button == 1) {
      int tempchar = strlen(query_string);
      query_string[tempchar] = alphabet[char_index];
      query_string[tempchar + 1] = '\0';
      strcpy(output, query_string);
    } else if (button == 2) {
      int tempchar = strlen(query_string);
      query_string[tempchar] = alphabet[char_index];
      query_string[tempchar + 1] = '\0';
      strcpy(output, query_string);
      input_state = 2;
      if (state == 0) {
        strcpy(username, output);
      } else if (state == 1) {
        strcpy(gameid, output);
      }
      memset(output, 0, sizeof(output));
      if (state == 0) {
        strcpy(output, "Long press to confirm\r\nShort press to re-key\r\nusername:");
      } else {
        strcpy(output, "Long press to confirm\r\nShort press to re-key\r\ngameid:");
      }
      if (state == 0) {
        strcat(output, username);
      } else if (state == 1) {
        strcat(output, gameid);
      }
    } else if (abs(angle) > angle_threshold and (millis() - scrolling_timer) > scrolling_threshold) {
      scrolling_timer = millis();
      if (angle > 0 ) {
        char_index = (char_index + 1) % strlen(alphabet);
      } else {
        char_index = (strlen(alphabet) + char_index - 1) % strlen(alphabet);
      }
    }
    if (button == 0) {
      int tem = strlen(output);
      output[tem] = alphabet[char_index];
      output[tem + 1] = '\0';
    }
  } else if (input_state == 2) {
    if (button == 1) {
      strcpy(output, "");
      strcpy(query_string, "");
      input_state = 0;
    }
    if (button == 2) {
      strcpy(output, "");
      input_state = 3;
    }
  } else if (input_state == 3) {
    strcpy(query_string, "");
    input_state = 0;
  }
}
