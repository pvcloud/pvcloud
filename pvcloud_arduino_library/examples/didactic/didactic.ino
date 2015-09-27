/*
  Didactic Example for pvCloud Library
   
  Provides a reference implementation for pvCloud Library on Intel Edison

  This is part of the pvCloud project.
  
  Created SEP-26-2015 by Jose Nunez (jose.nunez@intel.com)
  Copyright Intel Corp. 2015

 */

#include <Wire.h>
#include "rgb_lcd.h"
#include "pvcloud_lib.h"

rgb_lcd lcd;
PVCloud pvcloud;

void setup() {
  Serial.begin(9600);
  lcd.begin(16,2);
  lcd.setRGB(255,255,255);//WHITE
  allOut("SETUP BEGIN");
  delay(3000);



  
  allOut("SETUP COMPELETE");
}

void loop() {
  allOut("PVC RETRIEVE SYNC");
  GetLastValueFromPVCLOUD("TEST");
  delay(1000);
}


void GetLastValueFromPVCLOUD(String label){
  String value = pvcloud.RetrieveStringValue("TEST");
  value = "VALUE: " + value;
  allOut(value);
}


void allOut(String message){
  serialOut(message);  
  lcdOut(message,2);
}

long millisPrev = 0;
void serialOut (String message){
  long currentMillis = millis();
  String completeMessage = "|";
  completeMessage = completeMessage + currentMillis;
  completeMessage = completeMessage + "| ";
  completeMessage = completeMessage + message;
  completeMessage = completeMessage + " Duration: ";
  long diff = currentMillis - millisPrev;
  completeMessage += diff;

  millisPrev = currentMillis;
  Serial.println(completeMessage);
}

void lcdOut(String message, int row){
  lcd.setCursor(0,row);
  lcd.print(message);
  lcd.print("                 ");  
}

