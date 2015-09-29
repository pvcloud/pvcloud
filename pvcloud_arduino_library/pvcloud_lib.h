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
	String ReadFileValue();

	void SendStringValueNowait(String, String);
	void RequestLastValueStringNowait(String, String);
	String GetRequestStatusFromFile(String);

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
    
	void LogEntry(String message);
    void LogEntry(double value);
 
};

