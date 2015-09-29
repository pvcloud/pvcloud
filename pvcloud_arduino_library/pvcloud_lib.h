/*
  pvcloud_lib.h - Library for pvcloyud
  Created by Jose Nunez, July 18 2015
  Copyright 2015(c) Intel Corporation
  MIT License
*/
#include "Arduino.h"
class PVCloud
{
  public:
	void WriteAsync(String, String);
	void WriteAsync(char *, float)
	void ReadAsync(String);
	String Check(String);

	void LogEntry(String message);
    void LogEntry(double value);
 
};

