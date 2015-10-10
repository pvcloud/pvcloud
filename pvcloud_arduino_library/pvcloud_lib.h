/*
  pvcloud_lib.h - Library for pvcloyud
  Created by Jose Nunez, July 18 2015
  Copyright 2015(c) Intel Corporation
  MIT License
 */
#include "Arduino.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <malloc.h>

class PVCloud {
public:
    void WriteAsync(String, String);
    void WriteAsync(String, int);
    void WriteAsync(String, float);
    void WriteAsync(String, double);

    void ReadAsync(String);
    void FileCleanup(String label);

    String Check(String);
    String Check2(String);

    void LogEntry(String message);
    void LogEntry(double value);

};

