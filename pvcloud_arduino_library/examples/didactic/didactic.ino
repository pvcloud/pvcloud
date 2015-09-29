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

  test_NOBODY_BREACH();
}



void loop() {
  

}

void test_HelloWorld(){
  SendStringValueNowait("DIDACTIC_FLOW", "HELLO WORLD");

  
  serialOut("SETUP BEGIN");
  lcdOut("SETUP BEGIN",0);
  lcdOut("waiting 3 sec",1);
  delay(3000);



  
  serialOut("SETUP COMPELETE");
  lcdOut("SETUP COMPLETE",0);
  lcdOut("                  ",1);  
}

void test_NOBODY_INACTIVE(){
  lcd.setRGB(0,255,0);
  lcdOut("NOBODY MODE",0);
  lcdOut("SENSORS (0000)",1);  
}

void test_NOBODY_WARNING(){
  lcd.setRGB(255,255,0);
  lcdOut("NOBODY",0);
  lcdOut("SENSORS (0100)",1);  
}

void test_NOBODY_LURKING(){
  lcd.setRGB(255,0,0);
  lcdOut("NOBODY MODE",0);
  lcdOut("LURKING (0100)",1);  
}

void test_NOBODY_BREACH(){
  lcd.setRGB(255,0,0);
  lcdOut("NOBODY MODE",0);
  lcdOut("BREACH!!(0111)",1);  
}

void test_ACTIVE_SENSING(){
  lcd.setRGB(0,255,0);
  lcdOut("ACTIVE",0);
  lcdOut("SENSORS (0111)",1);  
}

void test_ACTIVE_NOTSENSING(){
  lcd.setRGB(255,255,255);
  lcdOut("ACTIVE",0);
  lcdOut("SENSORS (0000)",1);  
}

void test_Setup_INACTIVE(){
  lcd.setRGB(0,0,255);//BLUE
  lcdOut("SETUP MODE",0);
  lcdOut("SENSORS INACTIVE",1);
}

void test_Setup_ALARM(){
  lcd.setRGB(255,0,0);//RED
  lcdOut("SETUP MODE",0);
  lcdOut("ALARM (0011)",1);
}

int found = 0;
void test_GetHelloWorld(){
  if(found==0){
    lcdOut("Reading Value",0);
    serialOut("Reading Value");
    String label = "DIDACTIC_FLOW";
    String requestStatus = pvcloud.GetRequestStatusFromFile(label);
    lcdOut(requestStatus,1); 
    if(requestStatus=="PVCLOUD_WAITING_FOR_RESPONSE"){
      lcdMillis();
    } else if(requestStatus=="HELLO WORLD") {
      found = 1;
      serialOut("FOUND IT!!!");
      
      lcdOut("FOUND IT",0);
         
      serialOut(requestStatus);
    } else {
      serialOut("NOT WAITING...");
      lcdOut(requestStatus,1);
      serialOut(requestStatus);
      lcdMillis();
    }
  }  
}

void SendStringValueNowait(String label, String value){
  serialOut("SendStringValueNowait()");
  pvcloud.SendStringValueNowait(label, value);
}

void lcdMillis(){
  float now = millis();
  char strNow[100];
  sprintf(strNow, "%.2f", now);
  lcdOut(strNow,1);
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
  lcd.print("           ");  
}

