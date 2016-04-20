/*
  pvcloud_lib.cpp - Library for pvcloyud
  Created by Jose Nunez, July 18 2015
  Copyright 2015(c) Intel Corporation
  MIT License
 */

#include "pvcloud_edison_lib.h"

/*SIMPLIFIED ASYNC INTERFACE*/
String asyncFilePath = "/home/root/.pvcloud/";
String errorFile = "/home/root/.pvcloud/err_pvcloud.txt";

void PVCloud::Test() {
    String command = "pvcloud test > /home/root/.pvcloud/test.log";
    system(command.buffer);
}

void PVCloud::Write(String label, String value) {
    String command = "pvcloud write ";
    command += " label='" + label + "' ";
    command += " value='" + value + "' ";

    system(command.buffer);
}

void PVCloud::Write(String label, int value) {
    String strVal = String(value);
    Write(label, strVal);
}

void PVCloud::Write(String label, float value) {
    char strValue[200];
    sprintf(strValue, "%.2f", value);
    Write(label, strValue);
}

void PVCloud::Write(String label, double value) {
    char strValue[200];
    sprintf(strValue, "%.2f", value);
    Write(label, strValue);
}

void PVCloud::WriteAsync(String label, String value) {
    String command = "pvcloud write ";
    command += " label='" + label + "' ";
    command += " value='" + value + "' &";

    system(command.buffer);
}

void PVCloud::WriteAsync(String label, int value) {
    String strVal = String(value);
    WriteAsync(label, strVal);
}

void PVCloud::WriteAsync(String label, float value) {
    char strValue[200];
    sprintf(strValue, "%.2f", value);
    WriteAsync(label, strValue);
}

void PVCloud::WriteAsync(String label, double value) {
    char strValue[200];
    sprintf(strValue, "%.2f", value);
    WriteAsync(label, strValue);
}

void PVCloud::ReadAsync(String label) {
    
    String statusFileName = asyncFilePath + "pvc_status_" + label + "_read_async";
    String delcmd = "echo > " + statusFileName;
//    Serial.println(delcmd);
    system(delcmd.buffer);
    
//    Serial.println("crafting command pvcloud read_async");
    String command = "pvcloud read_async ";
    command += "\"" + label + "\" ";
    command += "\"" + asyncFilePath + "\"";
    command += " &";

//    Serial.println(command);
    
//    Serial.println("calling pvcloud read_async");
    system(command.buffer);
}

String PVCloud::Check(String label) {

    String callStatus = Async_GetStatusContent(label);
    if (callStatus == "SUCCESS") {

        String valFileName = "pvc_value_" + label + "_read_async";
        valFileName = asyncFilePath + valFileName;

        FILE *valFilePointer;

        valFilePointer = fopen(valFileName.buffer, "rb"); /*rb is important for the whole thing to work!!!*/
        char valFileContent[200];

        fgets(valFileContent, 200, valFilePointer);
        String value = valFileContent;

        value.trim();

        fclose(valFilePointer);

        return value;
    }
    
    if(callStatus == "ERROR"){
        return "...ERROR...";
    }
    
    if(callStatus == "CALLING WEB SERVICE"){
        return "...IN PROGRESS...";
    }
    
    return "...UNDEFINED...";
}

String PVCloud::Async_GetStatusContent(String label) {
    String statusFileName = asyncFilePath + "pvc_status_" + label + "_read_async";

    FILE *statusFilePointer;

    statusFilePointer = fopen(statusFileName.buffer, "rb");
    char statusFileContent[200];

    fgets(statusFileContent, 200, statusFilePointer);

    String content = statusFileContent;
    
    fclose(statusFilePointer);
    
    content.trim();

    if (content == "SUCCESS") return "SUCCESS";
    if (content == "ERROR") return "ERROR";
    if (content == "CALLING WEB SERVICE") return "CALLING WEB SERVICE";
    return "UNDEFINED";
}
