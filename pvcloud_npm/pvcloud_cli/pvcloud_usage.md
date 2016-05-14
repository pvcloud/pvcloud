Usage: pvcloud <action> <attributes>

where <action> is one of:
init
write
read
read_async
send_file
delete

pvcloud init <url> <account> <secret> <app_descriptor> <device_name>
<url>         refers to the base URL of a pvCloud instance the device will connect to
<account>     the account name (email) to be used to match <app_descriptor> and when <secret> is a password
<secret>      either Account Password, API Key or One Time Passcode to connect to the requested app
<device_name> the nick-name used to describe this device


pvcloud write <label> <value>
<label>       name of the piece of data to write.
<value>       value for the piece of data.
Examples:
              pvcloud write "TEMPERATURE" "25"
              pvcloud write TEMPERATURE 38.2
              pvcloud write "TEMP SENSOR 01" 32C
              pvcloud write "TEMP SET" "{'t1':'12','t2':'15'}"


pvcloud read <label> <count>
<label>       name of the piece of data to read.
<count>       maximum quantity of pieces of data to retrieve.
Examples:
              pvcloud read 
              pvcloud read "*"
              pvcloud read "*" 10
              pvcloud read "TEMPERATURE"
              pvcloud read "TEMPERATURE" 5
              
pvcloud read_async

1. Sequenced Parameters
2. Named Parameters
3. -- parameters


pvcloud delete "temperature" 100
