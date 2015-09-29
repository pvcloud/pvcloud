/*
  pvcloud_lib.cpp - Library for pvcloyud
  Created by Jose Nunez, July 18 2015
  Copyright 2015(c) Intel Corporation
  MIT License
*/

#include "pvcloud_lib.h"

String asyncFilePath = "/home/root";
String errorFile = "/home/root/err_pvcloud.txt";


void PVCloud::WriteAsync(String label, String value){

	String fileCleanupCommand = "echo \"\" > ";
	fileCleanupCommand += asyncFilePath + "out_pvcloud_" + label;
	system(fileCleanupCommand.buffer);

	String command = "node /home/root/pvcloud_api.js action='write' ";
	command += " label='" + label + "' ";
	command += " value='" + value + "' ";
	command += " error_log_file='" + errorFile + "'";


	command += " async=true";
	command += " async_path='" + asyncFilePath + "'";
	command += " &";

	system(command.buffer);
}

void PVCloud::ReadAsync(String label){
	String fileCleanupCommand = "echo \"\" > ";
	fileCleanupCommand += asyncFilePath + "out_pvcloud_" + label;
	system(fileCleanupCommand.buffer);

	String command = "node /home/root/pvcloud_api.js action='read' ";
	command += " label='" + label + "' ";
	command += " error_log_file='" + errorFile + "'";

	command += " async=true";
	command += " async_path='" + asyncFilePath + "'";
	command += " &";

	system(command.buffer);
}

String PVCloud::Check(String label){
	String fileName = asyncFilePath + "/out_pvcloud_";

	if (label != ""){
		fileName += label;
	}
	else {
		fileName += "any";
	}
	fileName += ".txt";

	FILE *filePointer;
	filePointer = fopen(fileName.buffer, "r");
	char fileContent[200];
	fgets(fileContent, 200, filePointer);

	String value = fileContent;
	value.trim();

	fclose(filePointer);
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
