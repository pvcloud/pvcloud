/*
  pvcloud_lib.h - Library for pvcloud
  Created by Jose Nunez, July 18 2015
  Copyright 2015(c) Intel Corporation
  MIT License
 */
#include <Arduino.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <malloc.h>

class PVCloud {
public:

    /*SIMPLIFIED LIBRARTY ASYNC INTERFACE*/
    void WriteAsync(String label, String value);
    void WriteAsync(String, int);
    void WriteAsync(String, float);
    void WriteAsync(String, double);
    void ReadAsync(String);
    String Check(String);

    /*LEGACY LOG INTERFACE*/
    void LogEntry(String message);
    void LogEntry(double value);

    /*LEGACY PVCLOUD INTERFACE*/
    String ReadFileValue();

    void SendString(String label, String value);

    void SendStringNoWait(String label, String value);

    void SendFloat(char *label, float value);

    void SendFloatNoWait(char *label, float value);

    String RetrieveStringValue(String label);

    float RetrieveFloatValue(String label);
    
    long RetrieveLongValue(String label);
    
    int RetrieveIntValue(String label);

    void RetrieveString_NoWait(String label);

    String RetrieveString_CheckResult(String label);
    
    inline bool exists_test3(String name);


};

