/*
  pvcloud_lib.cpp - Library for pvcloyud
  Created by Jose Nunez, July 18 2015
  Copyright 2015(c) Intel Corporation
  MIT License
*/

#include "pvcloud_lib.h"

String PVCloud::ReadFileValue(){
	String fileName = "/pvcloud_file_interface.txt";

	FILE *filePointer;
	filePointer = fopen(fileName.buffer, "r");
	char fileContent[200];
	fgets(fileContent, 200, filePointer);

	String value = fileContent;
	value.trim();

	fclose(filePointer);
	return value;
}

void PVCloud::SendString(String label, String value){
  //log("BEGIN: pvCloud_Send_String");
  Serial.println("pvCloud_Send_String()");
  Serial1.println("pvCloud_Send_String()");

  String command = "node ~/pvcloud_api.js action='add_value' value_type='FLOAT' captured_datetime='2000-01-01+00:01'";
  command= command + " value_label='" + label + " ' ";
  command = command + " value='";
  command = command + value;
  command = command + "' > lastcommand.txt";
  //log(command);
  Serial.println(command);
  Serial1.println(command);
  //log("call to Linux now...");
  system ( command.buffer);
  //log("COMLPETE: pvCloud_Send_String");  
}

void PVCloud::SendStringNoWait(String label, String value){
	//log("BEGIN: pvCloud_Send_String");
	Serial.println("pvCloud_Send_String()");
	Serial1.println("pvCloud_Send_String()");

	String command = "node ~/pvcloud_api.js action='add_value' value_type='FLOAT' captured_datetime='2000-01-01+00:01'";
	command = command + " value_label='" + label + " ' ";
	command = command + " value='";
	command = command + value;
	command = command + "' > lastcommand.txt &";
	//log(command);
	Serial.println(command);
	Serial1.println(command);
	//log("call to Linux now...");
	system(command.buffer);
	//log("COMLPETE: pvCloud_Send_String");  
}

void PVCloud::SendFloat(char *label, float value){
  //logEntry("BEGIN: pvCloud_Send_Float");
  Serial.println("pvCloud_Send_Double()");
  Serial1.println("pvCloud_Send_Double()");

  char command[1000];
  sprintf(command, "node ~/pvcloud_api.js action='add_value' value_type='FLOAT' captured_datetime='2000-01-01+00:04' value_label='%s' value='%.2f'  > lastcommand.txt", label, value);
  LogEntry(command);
  Serial.println(command);
  Serial1.println(command);
  //logEntry("call to Linux now...");
  system ( command);
  //logEntry("COMLPETE: pvCloud_Send_Float");
}

void PVCloud::SendFloatNoWait(char *label, float value){
	//logEntry("BEGIN: pvCloud_Send_Float");
	Serial.println("pvCloud_Send_Double()");
	Serial1.println("pvCloud_Send_Double()");

	char command[1000];
	sprintf(command, "node ~/pvcloud_api.js action='add_value' value_type='FLOAT' captured_datetime='2000-01-01+00:04' value_label='%s' value='%.2f'  > lastcommand.txt &", label, value);
	LogEntry(command);
	Serial.println(command);
	Serial1.println(command);
	//logEntry("call to Linux now...");
	system(command);
	//logEntry("COMLPETE: pvCloud_Send_Float");
}

String PVCloud::RetrieveStringValue(String label){
	system("rm /pvcloud_file_interface.txt");

	String pvcloudCommand = "node /home/root/pvcloud_api.js action='get_last_value_simple' value_label='";
	pvcloudCommand = pvcloudCommand + label;
	pvcloudCommand = pvcloudCommand + "' captured_datetime = '2000-01-01+00:00' > pvcloud_file_interface.txt";
	system(pvcloudCommand.buffer);
	String result = ReadFileValue();

	return result;
}


float PVCloud::RetrieveFloatValue(String label){
	system("rm /pvcloud_file_interface.txt");

	String pvcloudCommand = "node /home/root/pvcloud_api.js action='get_last_value_simple' value_label='";
	pvcloudCommand = pvcloudCommand + label;
	pvcloudCommand = pvcloudCommand + "' captured_datetime = '2000-01-01+00:00' > pvcloud_file_interface.txt";
	system(pvcloudCommand.buffer);
	String value = ReadFileValue();

	float result = atof(value.buffer);

	return result;
}

long PVCloud::RetrieveLongValue(String label){
	system("rm /pvcloud_file_interface.txt");

	String pvcloudCommand = "node /home/root/pvcloud_api.js action='get_last_value_simple' value_label='";
	pvcloudCommand = pvcloudCommand + label;
	pvcloudCommand = pvcloudCommand + "' captured_datetime = '2000-01-01+00:00' > pvcloud_file_interface.txt";
	system(pvcloudCommand.buffer);
	String value = ReadFileValue();

	long result = atol(value.buffer);

	return result;

}

int PVCloud::RetrieveIntValue(String label){
	system("rm /pvcloud_file_interface.txt");

	String pvcloudCommand = "node /home/root/pvcloud_api.js action='get_last_value_simple' value_label='";
	pvcloudCommand = pvcloudCommand + label;
	pvcloudCommand = pvcloudCommand + "' captured_datetime = '2000-01-01+00:00' > pvcloud_file_interface.txt";
	system(pvcloudCommand.buffer);
	String value = ReadFileValue();

	int result = value.toInt();

	return result;

}


void PVCloud::RetrieveString_NoWait(String label){
	String fileName = "pvcloud_file_interface_" + label + ".txt";
	String removeCommand = "rm /" + fileName;
	system(removeCommand.buffer);
	delay(20);

	String pvcloudCommand = "node /home/root/pvcloud_api.js action='get_last_value_simple' value_label='";
	pvcloudCommand = pvcloudCommand + label;
	pvcloudCommand = pvcloudCommand + "' captured_datetime = '2000-01-01+00:00' > " + fileName + " & ";
	system(pvcloudCommand.buffer);
}

String PVCloud::RetrieveString_CheckResult(String label){
	String fileName = "pvcloud_file_interface_" + label + ".txt";
	String value = "";
	if (exists_test3(fileName)){

		FILE *filePointer;
		filePointer = fopen(fileName.buffer, "r");
		char fileContent[200];
		fgets(fileContent, 200, filePointer);

		value = fileContent;
		value.trim();

		fclose(filePointer);
	}
	return value;

}

void PVCloud::LogEntry(String message){
   String command = "echo \"";
   command = command + message;
   command = command + "\" >> sketch.log";
   system(command.buffer);
}


void PVCloud::LogEntry(double value){
   char command[1000];
   sprintf(command, "echo \"%.2f\" >> sketch.log", value);
   system(command);
}

inline bool PVCloud::exists_test3(String name) {
	if (FILE *file = fopen(name.buffer, "r")) {
		fclose(file);
		return true;
	}
	else {
		return false;
	}
}