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
  delay(1000);
  Serial.begin(9600);
  Serial.println("SETUP BEGIN!");
  lcd.begin(16,2);
  lcd.setRGB(255,255,255);//WHITE
}



void loop() {
  //test_WriteAsync();
  test_MonitorAsync();
  while(1);
}

long minMillisBeforeNextRequest = 5000;
long maxTimeInRequest = 30000;
long millisForRequestTimeout = 0;
long requestCompleteMillis = 0;
bool asyncCallInProgress = false;
long errorMillis = 0;
String prevReturnedValue = "";
long errorRetryTimeout = 30000;
void test_WriteAsync(){
  lcdOut("test_WriteAsync",0);
  while(1){
    lcdOut(millis(),0);
    String returnedValue = prevReturnedValue;

    if(! asyncCallInProgress) {
      if(millis()-requestCompleteMillis > minMillisBeforeNextRequest) {
        pvcloud.WriteAsync("TEST","TESTVAL");
        asyncCallInProgress=true;
      }
    } else {
      returnedValue = pvcloud.Check("TEST");
      if(returnedValue!= prevReturnedValue){
        test_WriteAsync_ProcessChange(returnedValue);
      }
    } 
  }  
}

void test_WriteAsync_ProcessChange(String returnedValue){
  
  Serial.println("Change Detected");
  Serial.print("PRV: '");
  Serial.print(prevReturnedValue);
  Serial.print("'   RV: '");
  Serial.print(returnedValue);
  Serial.println("'");

  serialOut("NEW VALUE DETECTED: " + returnedValue);
  lcdOut(returnedValue,1);
  
  prevReturnedValue = returnedValue;
  
  if(returnedValue=="PVCLOUD_ERROR"){
    errorMillis = millis();
  }
  
  if(returnedValue=="TESTVAL"){
    lcd.setRGB(0,255,0);
    asyncCallInProgress=false;
    requestCompleteMillis=millis();
  } else if(returnedValue=="PVCLOUD_ERROR"){
    lcd.setRGB(255,0,0);
    asyncCallInProgress=false;
    requestCompleteMillis=millis();
  } else if (returnedValue=="LA PUTA"){
    lcd.setRGB(255,128,128);
    asyncCallInProgress=false;
  } else {
    lcd.setRGB(255,255,255);
  }  
}

void test_MonitorAsync(){
  lcdOut("test_MonitorAsync",0);
  while(1){
    lcdOut(millis(),0);
    String returnedValue = prevReturnedValue;

    
    if(! asyncCallInProgress) {
      if(millis()-requestCompleteMillis > minMillisBeforeNextRequest) {
        pvcloud.ReadAsync("TEST");
        asyncCallInProgress=true;
        millisForRequestTimeout = millis() + maxTimeInRequest;
      }
    } else {
      returnedValue = pvcloud.Check("TEST");
      if(returnedValue!= prevReturnedValue){
        test_MonitorAsync_ProcessChange(returnedValue);
      } else if(millis() > millisForRequestTimeout){
        asyncCallInProgress=false;
        requestCompleteMillis=millis();
      }
    } 
  }  
}

void test_MonitorAsync_ProcessChange(String returnedValue){
  
  Serial.println("Change Detected");
  Serial.print("PRV: '");
  Serial.print(prevReturnedValue);
  Serial.print("'   RV: '");
  Serial.print(returnedValue);
  Serial.println("'");

  serialOut("NEW VALUE DETECTED: " + returnedValue);
  lcdOut(returnedValue,1);
  
  prevReturnedValue = returnedValue;
  
  if(returnedValue=="PVCLOUD_ERROR"){
    errorMillis = millis();
  }

  //CHECK FOR CONTROL VALUES
  bool controlValueFound = false;
  if(returnedValue==""){
      serialOut("CONTROL VALUE: EMPTY");
      controlValueFound = true;
  } else if (returnedValue == "PVCLOUD_ERROR") {
      serialOut("CONTROL VALUE: ERROR");
      controlValueFound = true;
  } else if (returnedValue == "PVCLOUD_WAITING_FOR_RESPONSE") {
      serialOut("CONTROL VALUE: WAIT-");
      controlValueFound = true;
  } else {
      serialOut("NO CONTROL VALUE RECEIVED");
  }

  //EXPECTED VALUES:

  String expectedValues [] = {
    "TESTVAL",
    "TEST2",
    "OTHER"
  };

  int expectedValuesQty = 3;
  bool expectedValueFound = false;
  for(int i =0; i<expectedValuesQty; i++){
    if(returnedValue == expectedValues[i]){
      asyncCallInProgress=false;
      requestCompleteMillis = millis();
      expectedValueFound = true;
    }
  }

  if(controlValueFound) {
    lcd.setRGB(0,255,255);
  } else if (expectedValueFound){
    lcd.setRGB(0,255,0);
  } else if(returnedValue.length()>3){
      asyncCallInProgress=false;
      requestCompleteMillis = millis();
      lcd.setRGB(255,255,0);
  }
  
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
  lcd.print("                ");  
}

void lcdOut(long lvalue, int row){
  lcd.setCursor(0,row);
  lcd.print(lvalue);
  lcd.print("                ");
}

