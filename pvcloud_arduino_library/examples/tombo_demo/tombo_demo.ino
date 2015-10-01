/*
  TOMBO DEMO
  Reads a number of sensors and communicates their readings to pvCloud
  Also reads commands from pvCloud and controls effectors.
  
  This example code is in the public domain.

  modified 12 September2015
  by Jose Nunez
  
 */

#include <Wire.h>
#include "rgb_lcd.h"
#include "pvcloud_lib.h"

rgb_lcd lcd;
PVCloud pvcloud;
bool DEBUG = true;

int TriggerPins[] = {2,4,6,8};
int EchoPins[] = {3,5,7,9};
int SensorsQty = 4;
long DistancesInCM [] = {0,0,0,0};
long nobodyTriggerLimit=0;
long activeTriggerLimit=0;
long maxTimeInSetup=120000;
#define buzzer    12
#define light_alarm 13 

/**
  SETUP FUNCTION
**/
void setup() {
  Serial.begin(9600);
  lcd.begin(16, 2);
  lcd.setRGB(255, 255, 0); //YELLOW
  
  serialOut("WELCOME TO TOMBO - SETUP");
  //      01234567890123456
  lcdOut("TOMBO SETUP");

  delay(1000);
  
  serialOut("SETUP: Setting Pin Modes"); 
  setup_pinModes();

  serialOut("SETUP: Initial Blink");
  initialBlink();
  
  lcdOut("TOMBO SETUP OK",0);

  pvcloud.WriteAsync("OPMODE", "SETUP"); 
  activeTriggerLimit = millis() + maxTimeInSetup;
}


/**

  LOOP FUNCTION

**/

long minMillisBeforeNextRequest = 5000;
long maxTimeInRequest = 30000;
long millisForRequestTimeout = 0;
long requestCompleteMillis = 0;
bool asyncCallInProgress = false;
long errorMillis = 0;
String prevReturnedValue = "";
long errorRetryTimeout = 30000;
String OPMode = "SETUP INIT";
String CheckChar = "R";
String SensorsLine = "0000";
String PanicChar = "";


void loop() {
  String curMillis = String(millis());
  String strMillis = "TOMBO(" + CheckChar + ")" + curMillis;
  lcdOut(strMillis,0);
  String compositeOPMode = OPMode + "(" + SensorsLine + ")" + PanicChar;
  lcdOut(compositeOPMode,1);
  
  String returnedValue = prevReturnedValue;

  detectPushButton();
  
  if(! asyncCallInProgress) {
    if(millis()-requestCompleteMillis > minMillisBeforeNextRequest) {
      pvcloud.ReadAsync("OPMODE");
      asyncCallInProgress=true;
      millisForRequestTimeout = millis() + maxTimeInRequest;
    }
  } else {
    returnedValue = pvcloud.Check("OPMODE");
    if(returnedValue!= prevReturnedValue){
      CheckForOPModeChanges(returnedValue);
    } else if(millis() > millisForRequestTimeout){
      asyncCallInProgress=false;
      requestCompleteMillis=millis();
    }
  }

  if(OPMode!="OFF"){
    obtainDistancesInCM();
  }
  
  if(OPMode=="SETUP"){
    ProcessOPMode_SETUP();
  } else if (OPMode=="ACTIVE") {
    ProcessOPMode_ACTIVE();
  } else if (OPMode=="NOBODY") {
    ProcessOPMode_NOBODY();
  } else if (OPMode=="OFF"){
    lcd.setRGB(100,100,100);
  }
}

void ProcessOPMode_SETUP(){
  nobodyTriggerLimit=0;
  bool oneOrMoreSensorsActivated = false;
  for(int i=0; i<SensorsQty; i++){
    if(DistancesInCM[i] != 0 && DistancesInCM[i]<25){
      oneOrMoreSensorsActivated = true;
      break;
    }
  }

  if(oneOrMoreSensorsActivated){
    digitalWrite(buzzer, HIGH);
    digitalWrite(light_alarm, HIGH);
    lcd.setRGB(255,0,0);
  } else {
    digitalWrite(buzzer, LOW);
    digitalWrite(light_alarm, LOW);    
    lcd.setRGB(0,0,255);
  }

  if(millis()>activeTriggerLimit){
    OPMode="SW TO ACTIVE";
    pvcloud.WriteAsync("OPMODE","ACTIVE");
  }
}


long maxInactiveMillis = 30000;
bool makingOPModeSwitch = false;
void ProcessOPMode_ACTIVE(){
  bool oneOrMoreSensorsActivated = false;
  activeTriggerLimit = millis() + maxTimeInSetup;
  digitalWrite(buzzer, LOW);
  digitalWrite(light_alarm, LOW);     

  if(nobodyTriggerLimit==0){
    nobodyTriggerLimit = millis() + maxInactiveMillis;
  }
  serialOut(String (millis()));
  serialOut(String(nobodyTriggerLimit));
  
  for(int i=0; i<SensorsQty; i++){
    if(DistancesInCM[i] != 0 && DistancesInCM[i]<25){
      oneOrMoreSensorsActivated = true;
      break;
    }
  }

  if(oneOrMoreSensorsActivated){
    lcd.setRGB(0,128,0);
    serialOut("RESETTING NOBODY TRIGGER LIMIT!!!!!!");
    nobodyTriggerLimit = millis() + maxInactiveMillis;
  } else {
    lcd.setRGB(128,128,128);
    if(millis()>nobodyTriggerLimit){
      OPMode="NOBODY DETECTED";
      makingOPModeSwitch = true;
      pvcloud.WriteAsync("OPMODE","NOBODY");
    }
  }  

  serialOut("limit:" + String(nobodyTriggerLimit) + " , " + String(millis()));
}

long alarmOffTriggerLimit = 0;
long maxAlarmTime = 10000;
void ProcessOPMode_NOBODY(){
  bool oneOrMoreSensorsActivated = false;
  nobodyTriggerLimit=0;
  activeTriggerLimit = millis() + maxTimeInSetup;
  for(int i=0; i<SensorsQty; i++){
    if(DistancesInCM[i] != 0 && DistancesInCM[i]<25){
      oneOrMoreSensorsActivated = true;
      break;
    }
  }

  if(oneOrMoreSensorsActivated){
    lcd.setRGB(255,0,0);
    digitalWrite(buzzer, HIGH);
    digitalWrite(light_alarm, HIGH); 
    alarmOffTriggerLimit = millis() + maxAlarmTime;
    PanicChar = "!";
  } else {
    if(millis()>alarmOffTriggerLimit){
      lcd.setRGB(0,255,0);
      digitalWrite(buzzer, LOW);
      digitalWrite(light_alarm, LOW); 
      PanicChar = "";
    }
  }  
}

void CheckForOPModeChanges(String returnedValue){
  
  serialOut("Change Detected");
  serialOut("PRV: '");
  serialOut(prevReturnedValue);
  serialOut("'   RV: '");
  serialOut(returnedValue);
  serialOut("'");

  serialOut("NEW VALUE DETECTED: " + returnedValue);
  
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
    "SETUP",
    "ACTIVE",
    "NOBODY",
    "OFF"
  };

  int expectedValuesQty = 4;
  bool expectedValueFound = false;
  for(int i =0; i<expectedValuesQty; i++){
    if(returnedValue == expectedValues[i]){
      OPMode = returnedValue;
      asyncCallInProgress=false;
      requestCompleteMillis = millis();
      expectedValueFound = true;
    }
  }

  if(controlValueFound) {
    if(returnedValue=="PVCLOUD_ERROR") CheckChar = "!";
    else CheckChar = "C";
  } else if (expectedValueFound){
    CheckChar = "E";
  } else if(returnedValue.length()>3){
    asyncCallInProgress=false;
    requestCompleteMillis = millis();
    CheckChar = "U";
  }
  
}

void obtainDistancesInCM(){
  SensorsLine = "";
  for(int i=0; i<SensorsQty; i++){
    serialOut("Obtaining Distance " + String(i) + String(TriggerPins[i]));
    DistancesInCM[i] = getSanitizedDistanceInCM(TriggerPins[i], EchoPins[i]);
    String strDistance = String(DistancesInCM[i]);
    if (DistancesInCM[i]>0 && DistancesInCM[i]<25){
      SensorsLine +="1";
    } else {
      SensorsLine +="0";
    }
    serialOut("Distance on Sensor " + String(i) + ": "+ strDistance + "cm ");
  }
}

long getSanitizedDistanceInCM(int triggerPin, int echoPin){
  int numberOfSamples = 5;
  long samples[5] = {-1,-1,-1,-1,-1};
  long differences[4] = {-1,-1,-1,-1};

  for (int i=0; i<5; i++){
    samples[i] = getRawDistanceInCM(triggerPin, echoPin);
    delay(5);
  }

  int matchCount = 0;
  for (int i=1; i<4; i++){
    differences[i] = abs(samples[i] - samples[i-1]);
    if(differences[i]>3){
      differences[i]=-1;
    } else {
      matchCount ++;
    }

    if(matchCount >=2) return samples[i];
  }
    
 return samples[4];
}

long getRawDistanceInCM(int triggerPin, int echoPin){
  
    long pulseDuration;
    long distanceInCM = -1;
    
    digitalWrite(triggerPin, LOW);
    delayMicroseconds(2);
    digitalWrite(triggerPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(triggerPin, LOW);
    
    pulseDuration = pulseIn(echoPin, HIGH,500);
    
    distanceInCM = (pulseDuration/2)/29.1;
    return distanceInCM;
}

void detectPushButton(){
  int pushButton = analogRead(0);
  if(pushButton > 500) {
    if(OPMode=="SETUP" && !makingOPModeSwitch){
      OPMode="SW TO ACTIVE";
      makingOPModeSwitch = true;
      pvcloud.WriteAsync("OPMODE","ACTIVE");
      nobodyTriggerLimit = millis() + maxInactiveMillis;
      delay(100);
    } else if(OPMode=="ACTIVE" && !makingOPModeSwitch){
      OPMode="SW TO NOBODY";
      makingOPModeSwitch = true;
      pvcloud.WriteAsync("OPMODE","NOBODY");
      delay(100);
    } else if(OPMode=="NOBODY" && !makingOPModeSwitch){
      OPMode="SW TO OFF";
      makingOPModeSwitch = true;
      pvcloud.WriteAsync("OPMODE","OFF");
      delay(100);
    } else if(OPMode=="NOBODY" && !makingOPModeSwitch){
      OPMode="SW TO SETUP";
      makingOPModeSwitch = true;
      pvcloud.WriteAsync("OPMODE","SETUP");
      delay(100);
    }
  } else {
    makingOPModeSwitch = false;
  }
}


/***************************************************
 * SETUP FUNCTIONS
 ***************************************************/

void setup_pinModes(){
  pinMode(13, OUTPUT);

  for(int i=0; i<SensorsQty; i++){
    pinMode(TriggerPins[i], OUTPUT);
    pinMode(EchoPins[i], INPUT);
  }


  pinMode (buzzer, OUTPUT);
  pinMode (light_alarm, OUTPUT);
}

void initialBlink(){
  for (int i=0; i<10; i++){
    digitalWrite(light_alarm,HIGH);
    digitalWrite(buzzer,HIGH);
    delay(5);
    digitalWrite(light_alarm,LOW);
    digitalWrite(buzzer,LOW);
    delay(100);
  }
  lcd.setRGB(0,0,0);
  delay(100);
  lcd.setRGB(0,0,255);
  delay(100);
  lcd.setRGB(0,255,0);
  delay(100);
  lcd.setRGB(0,255,255);
  delay(100);
  lcd.setRGB(255,0,0);  
  delay(100);
  lcd.setRGB(255,0,255);  
  delay(100);
  lcd.setRGB(255,255,0);  
  delay(100);
  lcd.setRGB(255,255,255);  
  delay(100); 
}

/*******************************************************
 * LCD AND SERIAL OUT WITH TIMING
 *******************************************************/

void lcdMillis(){
  float now = millis();
  char strNow[100];
  sprintf(strNow, "%.2f", now);
  lcdOut(strNow,1);
}

long millisPrev = 0;
void serialOut (String message){
  if(!DEBUG) return;
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
void lcdOut(String message){
  lcdOut(message,0);
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


