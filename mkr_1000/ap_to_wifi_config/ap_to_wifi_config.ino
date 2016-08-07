/*
  Access point to WiFi Configuration Module

  This program provides an initial access point with a web server to configure MKR 1000 to connect
  to SSID/Passphrase, stores the data in flash and resets to a Client Mode to provide
  Pin to Cloud functionality.

  This is Open Source Software released under MIT License terms.

  Copyright Intel Corporation (c) 2016
  Authors: Jose Nunez (jose.nunez@intel.com)
           Yoel Wigoda (yoel.wigoda.kaver@intel.com)
  
 */

#include <SPI.h>
#include <WiFi101.h>
#include <FlashStorage.h>

#include "StringSplit.h"
#include "List.h"

void dumpConfiguration();
bool justThrowHTTPMessage = false;//DEBUG MODE TO SEE HTTP MESSAGE
WiFiServer server(80);//DEFINING WEB SERVER @ PORT 80

//DEFINITIONS
enum DigitalModes {
  DISABLED_DIGITAL,
  INPUT_DIGITAL,
  OUTPUT_DIGITAL,
  OUTPUT_PWM
};

enum AnalogModes {
  DISABLED_ANALOG,
  ENABLED
};

typedef struct {
  char Label [100];
  DigitalModes Mode;
} DigitalPort;

typedef struct {
  char Label [100];
  AnalogModes Mode;
} AnalogPort;

typedef struct {
  int initializationToken;
  char SSID[100];
  char passphrase[100];
  DigitalPort D0;
  DigitalPort D1;
  DigitalPort D2;
  DigitalPort D3;
  DigitalPort D4;
  DigitalPort D5;
  DigitalPort D6;
  DigitalPort D7;
  DigitalPort D8;
  DigitalPort D9;
  DigitalPort D10;
  DigitalPort D11;
  DigitalPort D12;
  DigitalPort D13;
  AnalogPort A0;
  AnalogPort A1;
  AnalogPort A2;
  AnalogPort A3;
  AnalogPort A4;
  AnalogPort A5;
  AnalogPort A6;
} Config;

// Reserve a portion of flash memory to store a "Person" and
// call it "my_flash_store".
FlashStorage(my_flash_store, Config);

Config configuration;

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  //while (!Serial);
  delay(1000);
  
  randomSeed(analogRead(0));
  Serial.println("Welcome to MKR1000 PIN-TO-CLOUD CONFIG");
  pinMode(LED_BUILTIN, OUTPUT);      // set the LED pin mode

  doBlink(5,200);
 
  configuration.initializationToken = 1;
  
  String defaultValue = "initial";
  defaultValue.toCharArray(configuration.SSID,100);
  defaultValue.toCharArray(configuration.passphrase,100);
  
  Serial.print("CONFIG BEFORE: ");
  dumpConfiguration();

  configuration = my_flash_store.read();  
  Serial.print("CONFIG AFTER: ");
  dumpConfiguration();
  if(configuration.initializationToken != 1){
    Serial.println("CONFIGURATION NOT FOUND...GOING TO CONFIG MODE?");
  } else {
    Serial.println("CONFIGURATION FOUND!");  
  }
  Serial.print("SSID:");
  Serial.print(configuration.SSID);
  Serial.print(", Passphrase: ");
  Serial.println(configuration.passphrase);
  
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not found!");
    while (true);
  }

  openAccessPoint();  
  server.begin(); //BEGIN WEB SERVER 

  printAccessPointStatus();
}


void loop() {
  WiFiClient client = server.available(); 
  String method = "";
  if (client) {  
    Serial.println("Client Connected!");  
    String currentLine = ""; 
    while (client.connected()) { 
      if (client.available()) {
        char c = client.read(); 
        currentLine += c;
        String payload = "";

        if(justThrowHTTPMessage){
          if(c=='\r') Serial.print("[R]"); 
          else if(c=='\n') Serial.print("[N]"); 
          else Serial.print(c);
        } else {        
          if(c == '\n'){ //PROCESS LINE
            Serial.print(currentLine);
            if(currentLine.startsWith("POST")){
              Serial.println("POST DETECTED!");
              method = "POST";            
            }
  
            if(currentLine.startsWith("GET")){
              Serial.println("GET DETECTED!");
              method = "GET";
            }
           
            if(currentLine=="\r\n" || currentLine == ""){
              while(client.available()){
                char c2 = client.read();
                payload += c2;
              }
              if(payload!=""){
                Serial.print("PAYLOAD: ");
                Serial.println(payload);
                processPayload(payload);
              }
              
              // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
              // and a content-type so the client knows what's coming, then a blank line:
              client.println("HTTP/1.1 200 OK");
              client.println("Content-type:text/html");
              client.println();
          
              // the content of the HTTP response follows the header:


client.println("<!DOCTYPE html>");
client.println("<html>");
client.println("<head>");
client.println(" <title>WELCOME TO PIN 2 CLOUD for MKR1000</title>");
client.println(" <meta charset='UTF-8'>");
client.println(" <meta name='viewport' content='width=device-width, initial-scale=1.0'>");
client.println(" <style>");
client.println(" table tr td:first-child{color:navy; text-align:right}");
client.println(" .separated td{border-top:1px solid gray} ");
client.println(" fieldset {max-width:836px; display:block; margin:0 auto} ");
client.println(" fieldset.gpio{min-width:400px;display:inline-block} ");
client.println(" form{display:block; margin:0 auto}");
client.println(" div{display:block; margin:0 auto; max-width:900px}");
client.println(" </style>");
client.println("</head>");
client.println(" ");
client.println("<body>");
client.println(" <form action='L' method='POST'> ");
client.println(" <h1>PIN2CLOUD CONFIG (MKR1000)</h1> ");
client.println(" <hr>");
client.println(" <fieldset title='WiFi Connection'>");
client.println("<legend>WiFi Connection</legend>");
client.println("<table> ");
client.println(" <tr>");
client.println(" <td style='text-align: right'>SSID:</td>");
client.println(" <td><input id='ssid' name='ssid' type='text' /></td>");
client.println(" </tr>");
client.println(" <tr>");
client.println(" <td>PASSWORD:</td> ");
client.println(" <td><input type='text' id='wifi_password' name='wifi_password'></td>");
client.println(" </tr>");
client.println("</table>");
client.println(" </fieldset> ");
client.println(" <br>");
client.println(" <fieldset>");
client.println("<legend>CLOUD CONNECTION</legend> ");
client.println("<table> ");
client.println(" <tr>");
client.println(" <td>Base URL:</td> ");
client.println(" <td><input placeholder='Cloud Service URL' type='text' id='cloudBaseURL' name='cloudBaseURL'></td>");
client.println(" </tr>");
client.println(" <tr>");
client.println(" <td>Secret:</td> ");
client.println(" <td><input placeholder='Cloud Service Secret' type='text' id='cloudSecret' name='cloudSecret'></td>");
client.println(" </tr>");
client.println(" <tr>");
client.println(" <td>Refresh Rate:</td>");
client.println(" <td> ");
client.println("<select id='refreshRate' name='refreshRate'> ");
client.println("<option>1 sec</option> ");
client.println("<option>5 sec</option> ");
client.println("<option selected>10 sec</option>");
client.println("<option>15 sec</option>");
client.println("<option>30 sec</option>");
client.println("<option>1 min</option> ");
client.println("<option>5 min</option> ");
client.println("<option>10 min</option>");
client.println("</select>");
client.println(" </td>");
client.println(" </tr>");
client.println("</table>");
client.println(" </fieldset> ");
client.println(" <div style='margin: 0 auto; position: relative; left:18px'>");
client.println("<fieldset class='gpio'>");
client.println(" <legend>DIGITAL GPIO</legend> ");
client.println(" <table class='gpio'> ");
client.println(" <tr> ");
client.println("<th>PIN</th> ");
client.println("<th>LABEL</th> ");
client.println("<th>MODE</th>");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D0</td>");
client.println("<td>");
client.println("<input type='text' id='label_d0' name='label_d0' placeholder='PORT_D0...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d0' name='selMode_d0'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D1</td>");
client.println("<td>");
client.println("<input type='text' id='label_d1' name='label_d1' placeholder='PORT_D1...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d1' name='selMode_d1'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D2</td>");
client.println("<td>");
client.println("<input type='text' id='label_d2' name='label_d2' placeholder='PORT_D2...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d2' name='selMode_d2'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println(" <option>OUTPUT PWM</option> ");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D3</td>");
client.println("<td>");
client.println("<input type='text' id='label_d3' name='label_d3' placeholder='PORT_D3...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d3' name='selMode_d3'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println(" <option>OUTPUT PWM</option> ");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D4</td>");
client.println("<td>");
client.println("<input type='text' id='label_d4' name='label_d4' placeholder='PORT_D4...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d4' name='selMode_d4'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println(" <option>OUTPUT PWM</option> ");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D5</td>");
client.println("<td>");
client.println("<input type='text' id='label_d5' name='label_d5' placeholder='PORT_D5...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d5' name='selMode_d5'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println(" <option>OUTPUT PWM</option> ");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D6</td>");
client.println("<td>");
client.println("<input type='text' id='label_d6' name='label_d6' placeholder='PORT_D6...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d6' name='selMode_d6'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D7</td>");
client.println("<td>");
client.println("<input type='text' id='label_d7' name='label_d7' placeholder='PORT_D7...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d7' name='selMode_d7'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D8</td>");
client.println("<td>");
client.println("<input type='text' id='label_d8' name='label_d8' placeholder='PORT_D8...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d8' name='selMode_d8'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D9</td>");
client.println("<td>");
client.println("<input type='text' id='label_d9' name='label_d9' placeholder='PORT_D9...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d9' name='selMode_d9'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D10</td> ");
client.println("<td>");
client.println("<input type='text' id='label_d10' name='label_d10' placeholder='PORT_D10...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d10' name='selMode_d10'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D11</td> ");
client.println("<td>");
client.println("<input type='text' id='label_d11' name='label_d11' placeholder='PORT_D11...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d11' name='selMode_d11'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D12</td> ");
client.println("<td>");
client.println("<input type='text' id='label_d12' name='label_d12' placeholder='PORT_D12...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d12' name='selMode_d12'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>D13</td> ");
client.println("<td>");
client.println("<input type='text' id='label_d13' name='label_d13' placeholder='PORT_D13...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_d13' name='selMode_d13'>");
client.println(" <option>DISABLED</option> ");
client.println(" <option>INPUT</option> ");
client.println(" <option>OUTPUT DIGITAL</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" </table> ");
client.println("</fieldset>");
client.println("<fieldset class='gpio'>");
client.println(" <legend>ANALOG INPUT PINS</legend> ");
client.println(" <table class='gpio'> ");
client.println(" <tr> ");
client.println("<th>PIN</th> ");
client.println("<th>LABEL</th> ");
client.println("<th>MODE</th>");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>A0</td>");
client.println("<td>");
client.println("<input type='text' id='label_a0' name='label_a0' placeholder='PORT_A0...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_a0' name='selMode_a0'>");
client.println(" <option>DISABLED</option><option>ENABLED</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>A1</td>");
client.println("<td>");
client.println("<input type='text' id='label_a1' name='label_a1' placeholder='PORT_A1...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_a1' name='selMode_a1'>");
client.println(" <option>DISABLED</option><option>ENABLED</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>A2</td>");
client.println("<td>");
client.println("<input type='text' id='label_a2' name='label_a2' placeholder='PORT_A2...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_a2' name='selMode_a2'>");
client.println(" <option>DISABLED</option><option>ENABLED</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>A3</td>");
client.println("<td>");
client.println("<input type='text' id='label_a3' name='label_a3' placeholder='PORT_A3...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_a3' name='selMode_a3'>");
client.println(" <option>DISABLED</option><option>ENABLED</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>A4</td>");
client.println("<td>");
client.println("<input type='text' id='label_a4' name='label_a4' placeholder='PORT_A4...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_a4' name='selMode_a4'>");
client.println(" <option>DISABLED</option><option>ENABLED</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>A5</td>");
client.println("<td>");
client.println("<input type='text' id='label_a5' name='label_a5' placeholder='PORT_A5...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_a5' name='selMode_a5'>");
client.println(" <option>DISABLED</option><option>ENABLED</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" <tr> ");
client.println("<td>A6</td>");
client.println("<td>");
client.println("<input type='text' id='label_a6' name='label_a6' placeholder='PORT_A6...'>");
client.println("</td> ");
client.println("<td>");
client.println("<select id='selMode_a6' name='selMode_a6'>");
client.println(" <option>DISABLED</option><option>ENABLED</option>");
client.println("</select>");
client.println("</td> ");
client.println(" </tr>");
client.println(" </table> ");
client.println(" ");
client.println("</fieldset>");
client.println("<div style='max-width:300px; display: inline-block'> ");
client.println(" <input type='submit' style='display:block; margin: 16px auto; padding: 16px; ' value='SAVE CONFIGURATION'/>");
client.println("</div>");
client.println(" </div>");
client.println(" </form>");
client.println("</body>");
client.println("</html> ");



          
              // The HTTP response ends with another blank line:
              client.println();  
  
              break;
            }
  
           
            currentLine="";
          }
  
          // Check to see if the client request was "GET /H" or "GET /L":
          if (currentLine.endsWith("GET /ON")) {
             digitalWrite(LED_BUILTIN, HIGH);               // GET /H turns the LED on
          }
          if (currentLine.endsWith("GET /OFF")) {
            digitalWrite(LED_BUILTIN, LOW);                // GET /L turns the LED off
          }

          if (currentLine.endsWith("POST /CONFIG")){
            doBlink(10,50);
            Serial.println(payload);
          }

        }
      }
    }
    // close the connection:
    client.stop();
    Serial.println("client disconnected");
  }
}

 

void printAccessPointStatus() {
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  Serial.print("Browser Address: http://");
  Serial.println(ip);
}

void doBlink(int times, int delayTime){
  for(int i=0; i<times; i++){
    digitalWrite(LED_BUILTIN,HIGH);
    delay(delayTime);
    digitalWrite(LED_BUILTIN,LOW);
    delay(delayTime);
  }
}

void openAccessPoint(){

  long randomNumber = random(1000,9999);
  String customSSID = "MKR1000_WIFIAP_";
  customSSID += randomNumber;
  Serial.print("CUSTOM SSID:");
  Serial.println(customSSID);
  
  char ssid[] = "MKR1000_WIFIAP_0000"; 

  customSSID.toCharArray(ssid,20);
  
  Serial.print("Access Point Name: ");
  Serial.println(ssid);

  if (WiFi.beginAP(ssid) != WL_CONNECTED) {
    Serial.println("ERROR: Unable to create Access Point. HALT!");
    while (true);
  }
  doBlink(10,50);
  delay(10000);
}

void processPayload(String payload){ 
  List<String> payLoadList;
  
  StringSplit::split(payLoadList,payload,'&');

  payLoadList.ToBegin();
  while(!payLoadList.IsEnd())
  {
    List<String> entryElements;
    String configEntry = payLoadList.GetValue();
    
    StringSplit::split(entryElements, configEntry, '=');
    entryElements.ToBegin();
    String key = entryElements.GetValue();
    entryElements.Next();
    String val = entryElements.GetValue();
    if(key=="ssid"){val.toCharArray(configuration.SSID,100);}
    if(key=="wifi_password"){val.toCharArray(configuration.passphrase,100);}
    if(key=="label_d0"){val.toCharArray(configuration.D0.Label, 100);}
    if(key=="label_d1"){val.toCharArray(configuration.D1.Label, 100);}
    if(key=="label_d2"){val.toCharArray(configuration.D2.Label, 100);}
    if(key=="label_d3"){val.toCharArray(configuration.D3.Label, 100);}
    if(key=="label_d4"){val.toCharArray(configuration.D4.Label, 100);}
    if(key=="label_d5"){val.toCharArray(configuration.D5.Label, 100);}
    if(key=="label_d6"){val.toCharArray(configuration.D6.Label, 100);}
    if(key=="label_d7"){val.toCharArray(configuration.D7.Label, 100);}
    if(key=="label_d8"){val.toCharArray(configuration.D8.Label, 100);}
    if(key=="label_d9"){val.toCharArray(configuration.D9.Label, 100);}
    if(key=="label_d10"){val.toCharArray(configuration.D10.Label, 100);}
    if(key=="label_d11"){val.toCharArray(configuration.D11.Label, 100);}
    if(key=="label_d12"){val.toCharArray(configuration.D12.Label, 100);}
    if(key=="label_d13"){val.toCharArray(configuration.D13.Label, 100);}
    if(key=="label_a0"){val.toCharArray(configuration.A0.Label, 100);}
    if(key=="label_a1"){val.toCharArray(configuration.A1.Label, 100);}
    if(key=="label_a2"){val.toCharArray(configuration.A2.Label, 100);}
    if(key=="label_a3"){val.toCharArray(configuration.A3.Label, 100);}
    if(key=="label_a4"){val.toCharArray(configuration.A4.Label, 100);}
    if(key=="label_a5"){val.toCharArray(configuration.A5.Label, 100);}
    if(key=="label_a6"){val.toCharArray(configuration.A6.Label, 100);}

    //if(key=="selMode_d0"){val.toCharArray(configuration.A6.Label, 100);}
    

  
    payLoadList.Next();
  } //while  

  
  configuration.initializationToken = 1;
  my_flash_store.write(configuration);
}

void dumpDigitalPort(DigitalPort port, String portName){
  Serial.print("PORT: ");
  Serial.print(portName);
  Serial.print("Label: ");
  Serial.print(port.Label);
  Serial.print(", Mode:");
  Serial.println(port.Mode);
}

void dumpAnalogPort(AnalogPort port, String portName){
  Serial.print("PORT: ");
  Serial.print(portName);
  Serial.print("Label: ");
  Serial.print(port.Label);
  Serial.print(", Mode:");
  Serial.println(port.Mode);
}

void dumpConfiguration(){
  Serial.println("CONFIGURATION DUMP:");

  Serial.print("InitializationToken:");
  Serial.println(configuration.initializationToken);

  Serial.print("SSID:");
  Serial.println(configuration.SSID);

  Serial.print("Passphrase:");
  Serial.println(configuration.passphrase);
  
  dumpDigitalPort(configuration.D0, "D0");
  dumpDigitalPort(configuration.D1, "D1");
  dumpDigitalPort(configuration.D2, "D2");
  dumpDigitalPort(configuration.D3, "D3");
  dumpDigitalPort(configuration.D4, "D4");
  dumpDigitalPort(configuration.D5, "D5");
  dumpDigitalPort(configuration.D6, "D6");
  dumpDigitalPort(configuration.D7, "D7");
  dumpDigitalPort(configuration.D8, "D8");
  dumpDigitalPort(configuration.D9, "D9");
  dumpDigitalPort(configuration.D10, "D10");
  dumpDigitalPort(configuration.D11, "D11");
  dumpDigitalPort(configuration.D12, "D12");
  dumpDigitalPort(configuration.D13, "D13");

  dumpAnalogPort(configuration.A0, "A0");
  dumpAnalogPort(configuration.A1, "A1");
  dumpAnalogPort(configuration.A2, "A2");
  dumpAnalogPort(configuration.A3, "A3");
  dumpAnalogPort(configuration.A4, "A4");
  dumpAnalogPort(configuration.A5, "A5");
  dumpAnalogPort(configuration.A6, "A6");  
}
