---
title: "Grandpa"
date: 2024-07-19
draft: false
description: "HackTheBox Grandpa writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Grandpa

## Overview

- **OS:** Windows
- **IP:** 10.10.10.14
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

learnt to use the local exploit suggester.

## Enumeration


I started broad, validated each finding, and then focused only on paths that were reproducible.

nmap scan results

{{< figure src="Untitled 33.png" >}}

homepage

{{< figure src="Untitled 34.png" >}}

## Vulnerabilities


**Port 80/tcp** 

[https://www.rapid7.com/db/modules/exploit/windows/iis/iis_webdav_scstoragepathfromurl/](https://www.rapid7.com/db/modules/exploit/windows/iis/iis_webdav_scstoragepathfromurl/)

## Exploitation


- **with metasploit**


using the vulnerability we found earlier , we have gotten access pretty easily now lets look around

{{< figure src="Untitled 35.png" >}}

Alright , so we are not able to access either harry or administrator possibly because our users privilege is low.

{{< figure src="Untitled 36.png" >}}


on trying to get the system information we encounter this

{{< figure src="Untitled 37.png" >}}

lets list out the processes

{{< figure src="Untitled 38.png" >}}

time to migrate into one of the nt authority services

{{< figure src="Untitled 39.png" >}}

now lets run a local exploit suggester and look for exploits for this system.

{{< figure src="Untitled 40.png" >}}

lets go with the client_copy_image

{{< figure src="Untitled 41.png" >}}

and there we go, we have escalated our privilege

root flag

{{< figure src="Untitled 42.png" >}}

user flag

{{< figure src="Untitled 43.png" >}}

pwned
