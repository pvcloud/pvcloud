/*
  Blink
  Turns on an LED on for one second, then off for one second, repeatedly.

  Most Arduinos have an on-board LED you can control. On the Uno and
  Leonardo, it is attached to digital pin 13. If you're unsure what
  pin the on-board LED is connected to on your Arduino model, check
  the documentation at http://www.arduino.cc

  This example code is in the public domain.

  modified 18 July 2015
  by Jose Nunez
  
  modified 8 May 2014
  by Scott Fitzgerald
 */
#include <Wire.h>
#include "rgb_lcd.h"

#include "pvcloud_lib.h"
rgb_lcd lcd;

PVCloud pvcloud;

// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin 13 as an output.
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  lcd.begin(16, 2);
  lcd.setRGB(255, 255, 0); //YELLOW
  lcdOut("BLINK TEST");
  delay(3000);
  Serial.println("SETUP Complete!");
  system ("echo SETUP COMPLETE! > /home/root/execution.log");
  system ("echo --SETUP-- > /home/root/pvcloud.log");
  system ("cd /home/root/");
  system ("pwd > /home/root/hereiam");
}

// the loop function runs over and over again forever
void loop() {
  Serial.println("Loop!");
  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(100);              // wait for a second
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  delay(100);      

  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(100);              // wait for a second
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  delay(100);   

  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(100);              // wait for a second
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  delay(100);   
  
  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  String command = " node '/home/root/pvcloud_api.js' action=add_value label=test value=testVAL &>> '/home/root/pvcloud.log'";

  //command = "node /home/root/pvcloud_api.js action=write label=test value=testval &>> '/home/root/pvcloud.log'";
  //command = "curl 'https://costaricamakers.com/pvcloud_pre/backend/vse_add_value.php?account_id=26&app_id=61&api_key=fdf24dd81ba5f34bbc015d1c6f6a1cca3ba3e8e7&label=DIRECT+pvCloud+TEST&value=12345&type=NUNMERICO' >> /home/root/pvcloud.log";
  //command = "pvcloud write hello >> /home/root/test.log";
  //command = "node /home/root/test.js >> /home/root/result.log";
  //command = "node /home/root/pvcloud.js >> /home/root/pvcloud.log";
  system ( command.buffer );
  //system ("node /home/root/test.js >> /home/root/pvcloud.log");

  //pvcloud.WriteAsync("TEST", "TESTVAL"); 

  String value = pvcloud.RetrieveStringValue("TEST");
  lcdOut(value);

  String valCommand = "echo " + value + " >> /home/root/pvcloud.log";
  system ( valCommand.buffer);
  system ("echo ---- >> /home/root/pvcloud.log");
  // Serial.println(command);
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);
  system ("echo LOOP Complete! >> /home/root/execution.log");
}

void lcdOut(String message){
  lcdOut(message,0);
}
void lcdOut(String message, int row){
  lcd.setCursor(0,row);
  lcd.print(message);
  lcd.print("                ");  
}
