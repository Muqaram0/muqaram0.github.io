---
title: "knife"
date: 2024-09-21
draft: false
description: "HackTheBox knife writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# knife

## Overview

- **OS:** Linux
- **IP:** 10.10.10.242
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

User agentt exploit.

## Enumeration


I started broad, validated each finding, and then focused only on paths that were reproducible.

nmap scan results

{{< figure src="image 112.png" >}}

homepage + php version

{{< figure src="image 113.png" >}}

{{< figure src="image 114.png" >}}

## Vulnerabilities

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 115.png" >}}

## Exploitation

lets use the UserAgentt Exploit

and just like that we have our shell

{{< figure src="image 116.png" >}}

ok so we got a shell as james and we can run /usr/bin/knife as root?

{{< figure src="image 117.png" >}}

this shell we got is very unstable i cant even traverse directories , lets try getting it manually without the use of this script.

sending this request via burpsuite, gets us our shell

{{< figure src="image 118.png" >}}

{{< figure src="image 119.png" >}}

lets use this exploit to upgrade our shell 
sudo knife exec -E "exec '/bin/bash'"   

user and root flag

{{< figure src="image 120.png" >}}
