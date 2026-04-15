---
title: "remote"
date: 2024-09-29
draft: false
description: "HackTheBox remote writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# remote

## Overview

- **OS:** Windows
- **IP:** 10.10.10.180
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

learnt how to mount something using nfs, used hashcat to crack admin creds which i found from the backup file in the mount, used an authenticated rce exploit to get nc.exe on the box with powershell and then got a basic shell, learnt to escalate privs by exploiting the self-impersonate priv using printspoofer.exe.

## Enumeration


nmap scan results

{{< figure src="image 142.png" >}}

homepage

{{< figure src="image 143.png" >}}

login portal

on a bit of enumerating we find this portal

{{< figure src="image 144.png" >}}

- **Vulnerabilites**

{{< figure src="image 145.png" >}}

## Exploitation

since nfs is running on the box , lets check for mounts

{{< figure src="image 146.png" >}}

ok there is something called site_backups, lets check it out 

{{< figure src="image 147.png" >}}

Poking around a bit, there’s an `.sdf` file in `/App_Data` called `Umbraco.sdf`. `.sdf` files are standard database format files. I don’t know a great way to parse these files, but `strings` shows some interesting results right at the top of the file:
-0xdf

by looking at this we can make out the user is 

email admin@htb.local

and the password hash is 

b8be16afba8c314ad33d812f22a04991b90e2aaa with SHA1

and another user smith with password hash jxDUCcruzN8rSRlqnfmvqw==AIKYyl6Fyy29KA3htB/ERiyJUAdpTtFeTpnIk9CiHts

stored using HMACSHA256.

ok so when we break it with hashcat we find that the pass is baconandcheese

{{< figure src="image 148.png" >}}

these creds let us in 

{{< figure src="image 149.png" >}}

we can now try this vuln we found earlier 

{{< figure src="image 150.png" >}}

{{< figure src="image 151.png" >}}

on trying a simple whoami command

{{< figure src="image 152.png" >}}

nice, we have RCE

lets get nc.exe via powershell

{{< figure src="image 153.png" >}}

{{< figure src="image 154.png" >}}

{{< figure src="image 155.png" >}}

annnd we have our user flag

{{< figure src="image 156.png" >}}

now lets try priv esc

{{< figure src="image 157.png" >}}

lets exploit this by using printspoofer

[GitHub - itm4n/PrintSpoofer: Abusing impersonation privileges through the "Printer Bug"](https://github.com/itm4n/PrintSpoofer?source=post_page-----a42e6aef1dc8--------------------------------)

lets get this printspoofer on our system as print.exe how we got our nc

{{< figure src="image 158.png" >}}

{{< figure src="image 159.png" >}}

time to grab our root flag

{{< figure src="image 160.png" >}}

pwned
