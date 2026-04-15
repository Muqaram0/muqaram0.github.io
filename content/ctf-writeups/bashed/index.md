---
title: "Bashed"
date: 2024-07-17
draft: false
description: "HackTheBox Bashed writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Bashed

## Overview

- **OS:** Linux
- **IP:** 10.10.10.68
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

Learnt  how to open a revershell with python and privilege escalation.

## Enumeration


nmap scan results

{{< figure src="Untitled 189.png" >}}

Homepage

{{< figure src="Untitled 190.png" >}}

dir-busting results

{{< figure src="Untitled 191.png" >}}

possible exploit 

{{< figure src="Untitled 192.png" >}}

## Vulnerabilities


**Possible reverse shell execution at** 

10.10.10.68/dev/phpbash.php shell

## Exploitation


By accessing the directory we found earlier and executing some shell commands we have gotten ourselves the user flag 

{{< figure src="Untitled 193.png" >}}

this tells us that the user scriptmanager can execute any command

{{< figure src="Untitled 194.png" >}}

so lets try to spawn a shell as scriptmanager

{{< figure src="Untitled 195.png" >}}

does not seem to work , probably because the shell we are using does not allow it?

lets try to open a reverse shell

we start off by setting up a listener on our kali machine using netcat 

{{< figure src="Untitled 196.png" >}}

now lets identify if the target has python using python —version command

{{< figure src="Untitled 197.png" >}}

great so the target has python!

now lets run our reverse shell command

{{< figure src="Untitled 198.png" >}}

and there we go , we have our reverse shell set up , now lets try the earlier command to switch the user to scriptmanager

{{< figure src="Untitled 199.png" >}}

still cant access root

{{< figure src="Untitled 200.png" >}}

on looking further we notice that scriptmanager has access to this scripts directory , lets check it out

{{< figure src="Untitled 201.png" >}}

damn, so there is a py file that is being executed which creates a text file with the following text

{{< figure src="Untitled 202.png" >}}

furthermore , we notice that the text file that is being created is owned by root ? lets try making it so that our reverse shell code is executed.

{{< figure src="Untitled 203.png" >}}

{{< figure src="Untitled 204.png" >}}

here we write our reverse shell code into [exploit.py](http://exploit.py) then we get rid of the [test.py](http://test.py) that was already there and rename our code to test.py, this should execute the exploit and give us a reverseshell connection with root privilege on port 1235.

{{< figure src="Untitled 205.png" >}}

and there we go , we have root access , time to grab the flag from the root folder

{{< figure src="Untitled 206.png" >}}

**pwned**
