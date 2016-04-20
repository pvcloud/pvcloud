#include <pvcloud_edison_lib.h>

PVCloud pvcloud;

void setup() {
  delay(2000);
  Serial.begin(9600);

  Serial.println("SETUP");

  pvcloud.Test();

  Serial.println("Sending String");
  pvcloud.Write("TEST_LBL","TEST_VAL");

  Serial.println("Sending INT");
  pvcloud.Write("TEST_LBL",1024);

  Serial.println("Sending FLOAT");
  float fval = 12.345678;
  pvcloud.Write("TEST_LBL", fval);

  Serial.println("Sending Double");
  double dval = 123.4567890;
  pvcloud.Write("TEST_LBL",dval);

  Serial.println("Sending String");
  pvcloud.WriteAsync("TEST_LBL","TEST_VAL");

  Serial.println("Sending INT");
  pvcloud.WriteAsync("TEST_LBL",1024);

  Serial.println("Sending FLOAT");
  fval = 12.345678;
  pvcloud.WriteAsync("TEST_LBL", fval);

  Serial.println("Sending Double");
  dval = 123.4567890;
  pvcloud.WriteAsync("TEST_LBL",dval);
  

}

bool reading = false;
int counter = 0;
long millisWhenReadStarted = 0;
void loop() {
  counter ++;
  if(!reading) {
    Serial.println("Reading Async");
    pvcloud.ReadAsync("TEST_LBL");
    millisWhenReadStarted =  millis();
    Serial.print("Also sending new counter value...");
    Serial.println(counter);
    pvcloud.WriteAsync("TEST_LBL", counter);
    reading = true;
  } else {
    Serial.println("Checking");
  }

  String val = pvcloud.Check("TEST_LBL");
  Serial.print("CHECK:");
  Serial.println(val);

  if(val!="...IN PROGRESS..." && val!="...UNDEFINED..."){
    reading=false;
  }

  if(millis() - millisWhenReadStarted > 10000){
    reading=false;
    Serial.println("TIMEOUT");
  }
  
  delay(1000);

}
