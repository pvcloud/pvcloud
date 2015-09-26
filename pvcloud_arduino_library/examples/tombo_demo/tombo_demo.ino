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

String OperationMode =  "";
int OperationModeRequestInProgress = 0;
long NextOperationModeCheckMillis = 0;
long OperationModeCheckTime = 10000; //10 seconds
long OperationModeCheckMinDuration = 5000;
long OperationModeCheckStartMillis = 0;

String alarmStatus = "QUIET";

#define trigger_1 2
#define echo_1    3

#define trigger_2 4
#define echo_2    5

#define trigger_3 6
#define echo_3    7


#define trigger_4 8
#define echo_4    9

#define buzzer    12
#define light_alarm 13 

long alarmMillisInitiated = 0;


/**

  SETUP FUNCTION

**/
void setup() {
  Serial.begin(9600);
  
  lcd.begin(16, 2);
  lcd.setRGB(6, 251, 202); //VERDE AGUA
 
  lcd_printMessage("PVC: Begin...",0);
  pvcloud.SendStringNoWait("DEBUG","SMART HOME START");

  pvc_SwitchOperationMode("SETUP");

  setup_pinModes();
  
  initialBlink();
  lcd_printMessage("Setup Complete!",0);
   
}


/**

  LOOP FUNCTION

**/
void loop() {
  lcd_printMessage(OperationMode,0);
  if(OperationMode == "SETUP" ) OPMode_SETUP();
  if(OperationMode == "ACTIVE") OPMode_ACTIVE();
  if(OperationMode == "NOBODY") OPMode_NOBODY();
  if(OperationMode == "") pvc_SwitchOperationMode("SETUP");

  if(millis() > NextOperationModeCheckMillis) {
    pvc_RequestOperationMode();
  }

  pvc_CheckOperationModeResult();

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

void initialBlink(){
  for (int i=0; i<10; i++){
    digitalWrite(light_alarm,HIGH);
    digitalWrite(buzzer,HIGH);
    delay(5);
    digitalWrite(light_alarm,LOW);
    digitalWrite(buzzer,LOW);
    delay(100);
  }
  pinMode(13, OUTPUT);
}

void pvc_SwitchOperationMode(String mode){
  lcd_printMessage("PVC OPM ..." + mode,0);
  pvcloud.SendString("OP_MODE",mode);
  lcd_printMessage("PVC OPM COMPLETE.",0);
  OperationMode = mode;
  refreshNextOperationModeCheck();
}

void refreshNextOperationModeCheck(){
  NextOperationModeCheckMillis = millis() + OperationModeCheckTime;
}

void pvc_CheckOperationMode(){
  lcd_printMessage("PVC CHECKING OP MODE...",0);
  
  String opMode = pvcloud.RetrieveStringValue("OP_MODE");
  refreshNextOperationModeCheck();
  if(opMode!=OperationMode) OperationMode = opMode;
}

long NoWaitTimeout = 10000;
void pvc_RequestOperationMode(){
  refreshNextOperationModeCheck();
  Serial.println("pvc_RequestOperationMode()");
  if(OperationModeRequestInProgress==0){
    refreshNextOperationModeCheck();
    Serial.println("CHECK FOR OPERATION MODE REQUESTED");
    OperationModeCheckStartMillis = millis();
    lcd_printMessage("PVC OP MODE NW",0); //NO WAIT
    pvcloud.RetrieveString_NoWait("OP_MODE");
    OperationModeRequestInProgress = 1;
  } else if( millis() > OperationModeCheckStartMillis + NoWaitTimeout){
    Serial.println("USING SYCHRONOUS CALL FOR OP MODE REQUEST");
    OperationModeCheckStartMillis = millis();
    lcd_printMessage("PVC OP MODE NW",0); //NO WAIT
    String result  = pvcloud.RetrieveStringValue("OP_MODE");
    OperationModeRequestInProgress = 0;
    OperationMode = result;
    Serial.println(OperationMode);
    refreshNextOperationModeCheck();
  }
}



void pvc_CheckOperationModeResult(){
  if(millis() > OperationModeCheckStartMillis + OperationModeCheckMinDuration){
    if(OperationModeRequestInProgress == 1){
      String result = pvcloud.RetrieveString_CheckResult("OP_MODE");
      Serial.print("OP MODE NOWAIT RESULT: ---");
      Serial.print(result);
      Serial.println("---");
    
      if(result == "SETUP" || result == "ACTIVE" || result == "NOBODY") {
        if(result != OperationMode) OperationMode = result;
        //OperationModeCheckMinDuration = millis() - OperationModeCheckStartMillis;
        OperationModeRequestInProgress = 0;
      }
    }
  }
}

void lcd_printMessage(String message,int row){
  lcd.setCursor(0,row);
  lcd.print(message);
  lcd.print("                 ");
}

void setup_pinModes(){
  pinMode(13, OUTPUT);

  pinMode (trigger_1, OUTPUT);
  pinMode (trigger_2, OUTPUT);
  pinMode (trigger_3, OUTPUT);
  pinMode (trigger_4, OUTPUT);

  
  pinMode (echo_1, INPUT);
  pinMode (echo_2, INPUT);
  pinMode (echo_3, INPUT);
  pinMode (echo_4, INPUT);
  pinMode (buzzer, OUTPUT);
  pinMode (light_alarm, OUTPUT);
}

void OPMode_SETUP(){
  long distanceValue[3] = {-1,-1,-1};
  long triggers[4] = {2,4,6,8};
  long echos[4] = {3,5,7,9};
  lcd.setCursor(0,1);

  int alarmedSensors = 0;
  
  for (int i = 0; i<4; i++){
    long distance = getSanitizedDistanceInCM(triggers[i], echos[i]);
    distanceValue[i] = distance;

    lcd.print(distance);
    lcd.print("*");  
    if(distance > 0 && distance < 20){
      alarmedSensors ++;
    }
  }

  if(alarmedSensors > 0){
      digitalWrite(light_alarm,HIGH);
      if(alarmMillisInitiated == 0) alarmMillisInitiated = millis();
      if(millis() - alarmMillisInitiated > 1000) {
        digitalWrite(buzzer, HIGH);
        lcd.setRGB(255,0,0); //ROJO   
      } else {
        digitalWrite(buzzer, LOW);
        lcd.setRGB(0,255,0); //ROJO   
      }
      
  } else {
      alarmMillisInitiated =0;
      digitalWrite(light_alarm,LOW);
      digitalWrite(buzzer,LOW);
      lcd.setRGB(0,0,255); //VERDE
  }

  lcd.print("     ");  
}

long maxInactiveMillis = 10000;
long lastActivityMillis = 0;
void OPMode_ACTIVE(){
  lcd.setRGB(0, 200, 0); //VERDE  

  digitalWrite(buzzer,LOW);
  digitalWrite(light_alarm,LOW);

  if(lastActivityMillis==0) lastActivityMillis = millis();

  long distanceValue[3] = {-1,-1,-1};
  long triggers[4] = {2,4,6,8};
  long echos[4] = {3,5,7,9};

  int alarmedSensors = 0;
  
  for (int i = 0; i<4; i++){
    long distance = getSanitizedDistanceInCM(triggers[i], echos[i]);
    distanceValue[i] = distance;

    if(distance > 0 && distance < 20){
      alarmedSensors ++;
    }
  }

  if(alarmedSensors == 0){
    lcd_printMessage("INACTIVITY DETECTED",1);
    if(millis() > lastActivityMillis + maxInactiveMillis){
      lastActivityMillis = 0;
      pvc_SwitchOperationMode("NOBODY");
    }
  } else {
    lcd_printMessage("ACTIVITY DETECTED",1);
    lastActivityMillis = millis();
  }

  lcd.print("     ");    

}

long maxAlarmTime = 20000;
long alarmCutoff = 0;
void OPMode_NOBODY(){
  lcd.setRGB(255, 255, 0); //AMARILLO
  long distanceValue[3] = {-1,-1,-1};
  long triggers[4] = {2,4,6,8};
  long echos[4] = {3,5,7,9};

  int alarmedSensors = 0;
  
  for (int i = 0; i<4; i++){
    long distance = getSanitizedDistanceInCM(triggers[i], echos[i]);
    distanceValue[i] = distance;

    if(distance > 0 && distance < 20){
      alarmedSensors ++;
    }
  }

  if(alarmedSensors > 0){
    lcd_printMessage("ALARM CONDITION DETECTED",1);
    alarmCutoff = millis() + maxAlarmTime;
    digitalWrite(buzzer,HIGH);
    digitalWrite(light_alarm, HIGH);
     
  } else {
    if(millis() > alarmCutoff){
      lcd_printMessage("INACTIBVE CONDITION",1);
      digitalWrite(buzzer,LOW);
      digitalWrite(light_alarm, LOW);
    }
  }
}

