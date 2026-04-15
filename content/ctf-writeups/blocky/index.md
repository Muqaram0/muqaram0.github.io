---
title: "Blocky"
date: 2024-08-23
draft: false
description: "HackTheBox Blocky writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Blocky

## Overview

- **OS:** Linux
- **IP:** 10.10.10.37
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

set up JD GUI for decompiling java code , checked the .class object got credentials nd then got access with sudo -l , priv esc was easy it was just sudo -l followed with sudo su.

## Enumeration

nmap scan results

{{< figure src="image 30.png" >}}

lets add blocky.htb to our /etc/hosts file so we can view the homepage

{{< figure src="image 31.png" >}}

{{< figure src="image 32.png" >}}

dirbusting results

{{< figure src="image 33.png" >}}

phpMyadmin login page

{{< figure src="image 34.png" >}}

wordpress login

{{< figure src="image 35.png" >}}

/plugins/

{{< figure src="image 36.png" >}}

ok interesting we have 2 jar files with us

we have this file with us on going thru the rar file , lets view it using JD GUI

{{< figure src="image 37.png" >}}

[http://java-decompiler.github.io/](http://java-decompiler.github.io/) we get our .rpm file from here

now

converting to debian file with alien command

└─$ sudo alien jd-gui*.rpm

followed by this for installing

sudo dpkg -i jd-gui*.deb

{{< figure src="image 38.png" >}}

{{< figure src="image 39.png" >}}

and now we can view our class file

{{< figure src="image 40.png" >}}

alright so these our creds , we will use these in the exploitation stage

8YsqfCTnvxAUeduzjNSXe22

## Exploitation


ok so htb had also asked us a question in the first step which was what the username is through enumeration? the only user we were able to find were root and a guy called notch.

lets try using these creds with ssh 

{{< figure src="image 41.png" >}}

alright great we got in with notch but root failed

lets check notchs perimissions

{{< figure src="image 42.png" >}}

wow we can run all commands , lets upgrad to root shell nd grab our flags

{{< figure src="image 43.png" >}}

root flag

{{< figure src="image 44.png" >}}

user flag

{{< figure src="image 45.png" >}}
