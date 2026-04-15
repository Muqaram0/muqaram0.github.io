---
title: "Mirai"
date: 2024-09-20
draft: false
description: "HackTheBox Mirai writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Mirai

## Overview

- **OS:** Linux
- **IP:** 10.10.10.48
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

learnt how to recover data that was deleted from a usb stick, also learnt how to check for devices that are mounted.

## Enumeration


I started broad, validated each finding, and then focused only on paths that were reproducible.

nmap scan results

{{< figure src="image 88.png" >}}

dirsearch

{{< figure src="image 89.png" >}}

.admin

{{< figure src="image 90.png" >}}

## Vulnerabilities


## Exploitation


lets try the raspberry pi default creds nd try to login thru ssh 

{{< figure src="image 91.png" >}}

and boom wee are in

{{< figure src="image 92.png" >}}

and we have our user flag

suprisingly we can run any command as root, so lets get a root shell with sudo su -

{{< figure src="image 93.png" >}}

{{< figure src="image 94.png" >}}

ok so it seems to be on a usb stick?

{{< figure src="image 95.png" >}}

nice , we have to perform some recovery

strings /dev/sdb -n 32 will grab us the root flag assuming that when the flag was deleted it was not overwritten with nullvalues and instead the metadata was just removed.

{{< figure src="image 96.png" >}}

\and boom root flag

pwned
