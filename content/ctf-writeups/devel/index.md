---
title: "Devel"
date: 2024-07-28
draft: false
description: "HackTheBox Devel writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Devel

## Overview

- **OS:** Windows
- **IP:** 10.10.10.5
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

Uploaded reverse shell.aspx on ftp and exploited with metasploit+msfvenom + w/o metapsloit ( local exploit sugg. setup inc ).

## Enumeration


nmap scan results

{{< figure src="Untitled 102.png" >}}

homepage

{{< figure src="Untitled 103.png" >}}

- **Exploitation w Metasploit + Msfvenom**


lets begin with accessing the ftp server as an anon 

{{< figure src="Untitled 104.png" >}}

lets check out the directory

{{< figure src="Untitled 105.png" >}}

alright we will now try uploading a file here with the extension ,aspx as its microsoft iis version 7.5

creating a  reverse tcp shell script with msf venom and then we upload it on the ftp server

{{< figure src="Untitled 106.png" >}}

{{< figure src="Untitled 107.png" >}}

now lets use metasploit to open a meterpreter session

{{< figure src="Untitled 108.png" >}}

and we are in , lets enumerate now

{{< figure src="Untitled 109.png" >}}

{{< figure src="Untitled 110.png" >}}

{{< figure src="Untitled 111.png" >}}

Using the local exploit suggester

{{< figure src="Untitled 112.png" >}}

{{< figure src="Untitled 113.png" >}}

we just have to provide the exploit which session we want to run it on, after backgrounding the session 

This returns us a list of exploits that we can run on the system

{{< figure src="Untitled 114.png" >}}

we will be using this client copy image one 

{{< figure src="Untitled 115.png" >}}

nice we have our shell , now lets grab our flags

root flag

{{< figure src="Untitled 116.png" >}}

user flag

{{< figure src="Untitled 117.png" >}}


- **Exploitation w/o Metasploit**

Setting up local exploit

`wget [https://bootstrap.pypa.io/pip/2.7/get-pip.p](https://bootstrap.pypa.io/pip/2.7/get-pip.p)y`

`python2 -m pip install --user xlrd==1.1.0`

`python2 [windows-exploit-suggester.py](http://windows-exploit-suggester.py/) --update`  

`windows-exploit-suggester.py --database 2014-06-06-mssb.xlsx --systeminfo win7sp1-systeminfo.txt`

followed by gedit system.txt
