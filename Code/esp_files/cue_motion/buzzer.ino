struct Riff {
  double notes[64];
  int length;
  float note_period;
};

void run_buzzer(float hit_force,uint8_t AUDIO_PWM,float* old_note,float* new_note) {
  //function plays a note with length proportional to the hit_force
  *old_note = 0;
  *new_note = 0;
  Riff tune = {{523.25 / 2, 659.25 / 2, 783.99 / 2, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98}, 9, 100};
  int notes_to_play = tune.length < 3 * hit_force + 1 ? tune.length : (int)3 * hit_force + 1;
  Serial.println(notes_to_play - 1);
  for (int i = 0; i < notes_to_play ; i++) {
    delay(tune.note_period);
    *old_note = *new_note;
    *new_note = tune.notes[i];
    if (*new_note != *old_note) {
      ledcWriteTone(AUDIO_PWM, *new_note);
    }
  }
  ledcWriteTone(AUDIO_PWM, 0);
}
