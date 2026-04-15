---
title: "Nibbles"
date: 2024-07-28
draft: false
description: "HackTheBox Nibbles writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Nibbles

## Overview

- **OS:** Linux
- **IP:** 10.10.10.75
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

php reverse shell injection.

## Enumeration

nmap scan results

{{< figure src="Untitled 207.png" >}}

home page

{{< figure src="Untitled 208.png" >}}

source code

{{< figure src="Untitled 209.png" >}}

nibbleblog directory

{{< figure src="Untitled 210.png" >}}

dirbusting results

{{< figure src="Untitled 211.png" >}}

on visiting the content page , we are greeted with this

{{< figure src="Untitled 212.png" >}}

lets check out the users file

{{< figure src="Untitled 213.png" >}}

it seems like admin is the username

{{< figure src="Untitled 214.png" >}}

we were able to login to the admin page by guessing the password as nibbles haha

{{< figure src="Untitled 215.png" >}}

## Vulnerabilities

nibbleblog v4.0.3

file injection multi/http/nibble_file_upload

- **Exploitation without metasploit**


on reading the exploit for nibbles that we found earlier , we can infer that it is trying to upload a php exploit through the image plugin

{{< figure src="Untitled 216.png" >}}

lets try this 

{{< figure src="Untitled 217.png" >}}

{{< figure src="Untitled 218.png" >}}

this is our reverse shell script , we will be uploading this through the image plugin 

after uploading the file we visit

[http://10.10.10.75/nibbleblog/content/private/plugins/my_image/image.php?cmd=id](http://10.10.10.75/nibbleblog/content/private/plugins/my_image/image.php?cmd=id)  

on visiting we get our reverse shell

spawning bash

{{< figure src="Untitled 219.png" >}}

upgrading our shell

{{< figure src="Untitled 220.png" >}}

on running sudo -l , we figure out that the user that we have can run a script with root privileges

{{< figure src="Untitled 221.png" >}}

lets go to this path

{{< figure src="Untitled 222.png" >}}

lets add our revershell in this script 

{{< figure src="Untitled 223.png" >}}

and there we go , we have a root shell now time to grab the flags

our root flag

{{< figure src="Untitled 224.png" >}}

our user flag

{{< figure src="Untitled 225.png" >}}

- **Exploitation with metasploit**


lets use the payload we found 

{{< figure src="Untitled 226.png" >}}

now lets try accessing root

{{< figure src="Untitled 227.png" >}}

we will try upgrading our shell

{{< figure src="Untitled 228.png" >}}

ok great so this system has python3 
lets spawn in our shell
