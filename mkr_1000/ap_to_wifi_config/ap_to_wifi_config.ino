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

bool justThrowHTTPMessage = false;//DEBUG MODE TO SEE HTTP MESSAGE
WiFiServer server(80);//DEFINING WEB SERVER @ PORT 80

// Create a structure that is big enough to contain a name
// and a surname. The "valid" variable is set to "true" once
// the structure is filled with actual data for the first time.
typedef struct {
  int initializationToken;
  char SSID[100];
  char passphrase[100];
} Config;

// Reserve a portion of flash memory to store a "Person" and
// call it "my_flash_store".
FlashStorage(my_flash_store, Config);

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  //while (!Serial);
  delay(1000);
  
  randomSeed(analogRead(0));
  Serial.println("Welcome to MKR1000 PIN-TO-CLOUD CONFIG");
  pinMode(LED_BUILTIN, OUTPUT);      // set the LED pin mode

  doBlink(5,200);


  Config configuration;
  configuration.initializationToken = 1;
  
  String defaultValue = "initial";
  defaultValue.toCharArray(configuration.SSID,100);
  defaultValue.toCharArray(configuration.passphrase,100);
  
  Serial.print("CONFIG BEFORE: ");
  Serial.println(configuration.initializationToken);
  configuration = my_flash_store.read();  
  Serial.print("CONFIG AFTER: ");
  Serial.println(configuration.initializationToken);
  if(configuration.initializationToken != 1){
    Serial.println("CONFIGURATION NOT FOUND... SAVING IT!");
    String ssid = "opodiym";
    String pass = "luaus7151";
    ssid.toCharArray(configuration.SSID, 100);
    pass.toCharArray(configuration.passphrase, 100);
    configuration.initializationToken = 1;
    my_flash_store.write(configuration);
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
              String html = getHTML_ConfigPage();
              client.print(html);
          
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

String getHTML_ConfigPage(){
  String html = "";

  // the content of the HTTP response follows the header:
  html += "<form id='WIFILOGIN' method='POST' action='L'>";
  html += "SSID: <input id='txtSSID' name='txtSSID' type='text' /><br />";
  html += "Passphrase: <input id='txtPassphrase' name='txtPassphrase' type='password' /><br />";
  html += "<input type='submit' value='SEND'/>";
  html += "</form>";
  html += "<button><a href='/ON'>ON</a></button> turn the LED on<br><br>";
  html += "<button><a href='/OFF'>OFF</a></button><br>";
  return html;
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

    Serial.print("Key: ");
    Serial.print(entryElements.GetValue());
    entryElements.Next();
    Serial.print(", Value: ");
    Serial.println(entryElements.GetValue());
    
    
    payLoadList.Next();
  } 
}

