#ifndef InputGetter_h
#define InputGetter_h
#include "Arduino.h"
class InputGetter {
  public:
    char alphabet[50] = "abcdefghijklmnopqrstuvwxyz0123456789 ";
    char msg[400] = {0};
    char query_string[50] = {0};
    int char_index;
    int input_state;
    uint32_t scrolling_timer;
    const int scrolling_threshold = 150;
    const float angle_threshold = 50;
    InputGetter();
    void reset(char* output);
    void update(float angle, int button, char* output,int state, char* username, char* gameid);
};
#endif
