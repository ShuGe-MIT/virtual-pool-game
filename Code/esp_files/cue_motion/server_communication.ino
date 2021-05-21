void post_hit() {
  Serial.println("hit motion detected");
  sprintf(body, "username=%s&game_id=%s&stick_vel=%4.2f&stick_ang=%4.2f", username, gameid, velocity, -1 * angle + 2 * half_pi);
  int body_len = strlen(body);
  sprintf(request_buffer, "POST http://608dev-2.net/sandbox/sc/team48/hitball.py HTTP/1.1\r\n");
  strcat(request_buffer, "Host: 608dev-2.net\r\n");
  strcat(request_buffer, "Content-Type: application/x-www-form-urlencoded\r\n");
  sprintf(request_buffer + strlen(request_buffer), "Content-Length: %d\r\n", body_len);
  strcat(request_buffer, "\r\n");
  strcat(request_buffer, body);
  strcat(request_buffer, "\r\n");
  do_http_request("608dev-2.net", request_buffer, response_buffer, OUT_BUFFER_SIZE, RESPONSE_TIMEOUT, true);
}

void check_game_end() {
  char* pr;
  sprintf(request_buffer, "GET http://608dev-2.net/sandbox/sc/team48/result_post.py?game_id=%s HTTP/1.1\r\n", gameid);
  strcat(request_buffer, "Host: 608dev-2.net\r\n");
  strcat(request_buffer, "\r\n");
  do_http_request("608dev-2.net", request_buffer, response_buffer, OUT_BUFFER_SIZE, RESPONSE_TIMEOUT, true);
  pr = strtok(response_buffer, "\n");
  char temp_string[10];
  strcpy(temp_string, "True");
  if (strcmp(pr, temp_string) == 0) {
    game_end = 1;
  } else {
    game_end = 0;
  }
}
void retrieve(bool display) {
  char positions[1000];
  char ball8[100];
  int xball;
  int yball;
  //retrieve and display drawing
  if (display) {
    tft.fillScreen(BACKGROUND);
    tft.fillRect(5, 5, 117, 147, BACK);
    tft.fillCircle(10, 10, HOLE_RAD, STICK_COLOR);
    tft.fillCircle(117, 10, HOLE_RAD, STICK_COLOR);
    tft.fillCircle(117, 147, HOLE_RAD, STICK_COLOR);
    tft.fillCircle(10, 147, HOLE_RAD, STICK_COLOR);
    tft.fillCircle(117, 79, HOLE_RAD, STICK_COLOR);
    tft.fillCircle(10, 79, HOLE_RAD, STICK_COLOR);
  }
  char* ptr;
  sprintf(request_buffer, "GET http://608dev-2.net/sandbox/sc/team48/esp_get_data.py?game_id=%s&username=%s HTTP/1.1\r\n", gameid, username);
  strcat(request_buffer, "Host: 608dev-2.net\r\n");
  strcat(request_buffer, "\r\n");
  do_http_request("608dev-2.net", request_buffer, response_buffer, OUT_BUFFER_SIZE, RESPONSE_TIMEOUT, true);
  Serial.println(response_buffer);
  DynamicJsonDocument doc(900);
  DeserializationError error = deserializeJson(doc, response_buffer);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  char cur_player[200];
  strcpy(cur_player, doc["cur_player"]);
  if (strcmp(username, cur_player) == 0) {
    my_turn = 1;
  } else {
    my_turn = 0;
  }

  strcpy(ball8, doc["ball_8"]);
  if (strcmp(ball8, "na") != 0) {
    ptr = strtok(ball8, ",");
    if (ptr != NULL) {
      xball = atoi(ptr);
    }
    ptr = strtok(NULL, "&");
    if (ptr != NULL) {
      yball = atoi(ptr);
    }
    if (xball != 0 and yball != 0) {
      if (display) tft.fillCircle(xball, yball, RADIUS, BALL_COLOR2);
    }
  }
  strcpy(positions, doc["positions"]);
  ptr = strtok(positions, ",");
  if (ptr != NULL) {
    x = atoi(ptr);
  }
  ptr = strtok(NULL, "&");
  if (ptr != NULL) {
    y = atoi(ptr);
  }
  if (x != 0 and y != 0) {
    if (display) tft.fillCircle(x, y, RADIUS, CUE_COLOR);
  }
  while (ptr != NULL) {
    ptr = strtok(NULL, ",");
    if (ptr != NULL) {
      xball = atoi(ptr);
    }
    ptr = strtok(NULL, "&");
    if (ptr != NULL) {
      yball = atoi(ptr);
    }
    if (display) tft.fillCircle(xball, yball, RADIUS, BALL_COLOR);
  }
}
