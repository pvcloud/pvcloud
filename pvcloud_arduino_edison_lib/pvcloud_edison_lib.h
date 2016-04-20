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

    /*SIMPLIFIED TEST INTERFACE*/
    void Test();
    
    /*SIMPLIFIED SYNCHRONOUS INTERFACE*/
    void Write(String, String);
    void Write(String, int);
    void Write(String, float);
    void Write(String, double);
    
    void SendFile(String label, String path);
    
    /*SIMPLIFIED LIBRARTY ASYNC INTERFACE*/
    void WriteAsync(String label, String value);
    void WriteAsync(String, int);
    void WriteAsync(String, float);
    void WriteAsync(String, double);
    
    void ReadAsync(String);
    
    String Check(String);
    String Async_GetStatusContent(String);
};

