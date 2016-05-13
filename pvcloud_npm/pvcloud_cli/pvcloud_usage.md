Usage: pvcloud <action> <attributes>

where <action> is one of:
init
write
read
read_async
send_file
delete

pvcloud init <url> <account> <passcode> <app_descriptor> <device_name>
dgfdgl


pvcloud read <label> <count>

pvcloud write <label> <value>

1. Sequenced Parameters
2. Named Parameters
3. -- parameters


pvcloud delete "temperature" 100
