---
title: "Netmon"
date: 2024-08-20
draft: false
description: "HackTheBox Netmon writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Netmon

## Overview

- **OS:** Windows
- **IP:** 10.10.10.152
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

normal access through rci exploit nd config file investigation.

## Enumeration

nmap scan results

{{< figure src="image 1008.png" >}}

alright so ftp seems to be  running and that too with anon access , lets check this out later

homepage 

{{< figure src="image 1009.png" >}}

we tried these default creds , but they did not seem to work 

{{< figure src="image 1010.png" >}}

dirbusting

dirsearch  -u [http://10.10.10.152/](http://10.10.10.152/) -e php,txt,html  -x 403,404 -t 50

{{< figure src="image 1011.png" >}}

nothing useful that we can access


## Vulnerabilities


ftp with anon access

## Exploitation


Accessing the ftp server anonymously

{{< figure src="image 1012.png" >}}

User Flag

please ignore the failed attempts with cat and type i forgot that get should be used here

{{< figure src="image 1013.png" >}}

{{< figure src="image 1014.png" >}}

we know that by default the file path for the config files for this service would be this

{{< figure src="image 1015.png" >}}

on visiting this location we come across these files

{{< figure src="image 1016.png" >}}

we were getting an error earlier while trying to retrieve the file with the get command but we resolve this by changing the mode to binary and then trying it out, we just have to type binary once per ftp session to change the download mode from ascii to binary apparently.

{{< figure src="image 1017.png" >}}

anyways lets scan through the contents of the file

{{< figure src="image 1018.png" >}}

and there we go , in the first few lines we find the admin user nd pass

lets use this to authenticate

prtgadmin:PrTg@dmin2018

ok soon trying these creds we did not get access but if we look at the config files again 

{{< figure src="image 1016.png" >}}

we see that damn there was another update that happened in the year after , so lets try changing the 2018 to 2019

{{< figure src="image 1019.png" >}}

annnd we are in , now lets check for any vulnerabilities for this version of prtg network monitor.

[https://codewatch.org/2018/06/25/prtg-18-2-39-command-injection-vulnerability/](https://codewatch.org/2018/06/25/prtg-18-2-39-command-injection-vulnerability/)

we find this blogpost that tells us that we can execute commands through the notification parameter as they are directly sent to the powershell without any sanitization.

we go to 

Setup > Account Settings > Notifications. And click “+” sign to the right side.

Leaving all the options as it is, go to **“Execute Program”** and here we can inject commands in the **“Parameter”** field. This is my payload

lets use this payload 

*test.txt;net user anon p3nT3st! /add;net localgroup administrators anon /add*

{{< figure src="image 1020.png" >}}

which i got from this blog

[https://medium.com/@preethambomma/netmon-hackthebox-writeup-fe6e9f1ff5b0](https://medium.com/@preethambomma/netmon-hackthebox-writeup-fe6e9f1ff5b0)

lets get psexec from here

[https://github.com/fortra/impacket/blob/master/examples/psexec.py](https://github.com/fortra/impacket/blob/master/examples/psexec.py)

now lets use this to authenticate 

{{< figure src="image 1021.png" >}}

unfortunately i kept getting this error but it is supposed to have worked, anyways i am going to try a different method 

lets use this cve exploit

[https://github.com/A1vinSmith/CVE-2018-9276](https://github.com/A1vinSmith/CVE-2018-9276)

{{< figure src="image 1022.png" >}}

and we are finally in 

{{< figure src="image 1023.png" >}}

Root Flag

{{< figure src="image 1024.png" >}}
