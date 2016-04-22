#include <pvcloud_edison_lib.h>
#include <Wire.h>
#include "rgb_lcd.h"

PVCloud pvcloud;
rgb_lcd lcd;


void setup() {
  delay(2000);
  Serial.begin(9600);

  Serial.println("SETUP");

  lcd.begin(16,2);
  lcd.setRGB(255,255,255);
  lcd.setCursor(0,0);
  //---------0123456789012345
  lcd.print("Setting up...");
  pvcloud.Test();

  lcd.setCursor(0,0);
  //---------0123456789012345
  lcd.print("Sending string..");
  
  Serial.println("Sending String");
  pvcloud.Write("TEST_LBL","TEST_VAL");

  lcd.setCursor(0,0);
  //---------0123456789012345
  lcd.print("Sending INT...  ");

  Serial.println("Sending INT");
  pvcloud.Write("TEST_LBL",1024);

  lcd.setCursor(0,0);
  //---------0123456789012345
  lcd.print("Sending float...");

  Serial.println("Sending FLOAT");
  float fval = 12.345678;
  pvcloud.Write("TEST_LBL", fval);

  lcd.setCursor(0,0);
  //---------0123456789012345
  lcd.print("Sending double..");

  Serial.println("Sending Double");
  double dval = 123.4567890;
  pvcloud.Write("TEST_LBL",dval);

  //lcd.setCursor(0,0);
  //---------0123456789012345
  //lcd.print("Sending Async...");

  //Serial.println("Sending Double");
  //dval = 123.4567890;
  //pvcloud.WriteAsync("TEST_LBL",dval);

  lcd.setCursor(0,0);
  //---------0123456789012345
  lcd.print("Setup Complete! ");
}

bool reading = false;
int counter = 0;
long millisWhenReadStarted = 0;
void loop() {
  counter ++;
  lcd.setCursor(0,0);
  //---------0123456789012345
  lcd.print("Count: ");
  lcd.print(counter);
  lcd.print("                ");
  lcd.setCursor(0,1);
  if(!reading) {
    Serial.println("Reading Async");
    pvcloud.ReadAsync("TEST_LBL");
    millisWhenReadStarted =  millis();
    reading = true;
  } else {
    Serial.println("Checking");
  }

  String val = pvcloud.Check("TEST_LBL");
  Serial.print("CHECK:");
  Serial.println(val);
  lcd.print(val);
  lcd.print("                ");
  if(val!="...IN PROGRESS..." && val!="...UNDEFINED..."){
    reading=false;
    Serial.print("Also sending new counter value...");
    Serial.println(counter);
    pvcloud.Write("TEST_LBL", counter);    
  }

  if(millis() - millisWhenReadStarted > 10000){
    reading=false;
    Serial.println("TIMEOUT");
  }
  
  delay(1000);

}
