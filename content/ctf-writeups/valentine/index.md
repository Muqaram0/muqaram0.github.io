---
title: "Valentine"
date: 2024-08-24
draft: false
description: "HackTheBox Valentine writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Valentine

## Overview

- **OS:** Linux
- **IP:** 10.10.10.79
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

tmux session + heartbleed exploit.

## Enumeration

nmap scan result

{{< figure src="image 161.png" >}}

dirbuster result

{{< figure src="image 162.png" >}}

going to dev we get these files

{{< figure src="image 163.png" >}}

and this hype key

{{< figure src="image 164.png" >}}

homepage

{{< figure src="image 165.png" >}}

encoder

{{< figure src="image 166.png" >}}

decoder

{{< figure src="image 167.png" >}}

nmap vuln scan

{{< figure src="image 168.png" >}}

## Vulnerabilities


I validated this step using the evidence below before moving forward in the chain.

we will be using the heartbleed exploit, the omg.jpg we found earlier seemed to have been hinting at this exploit also

{{< figure src="image 169.png" >}}

## Exploitation


This page has the code in hexa , lets convert it to plaintext for us to read using this

https://www.rapidtables.com/convert/number/hex-to-ascii.html

{{< figure src="image 164.png" >}}

nice, it turned out to be a RSA private key

{{< figure src="image 170.png" >}}

lets get the heartbleed script from here

git clone [https://gist.github.com/10174134.git](https://gist.github.com/10174134.git)

now lets run it

someone had tried to encode this text , lets decode it with the tool they have on their site

{{< figure src="image 171.png" >}}

{{< figure src="image 172.png" >}}

nice now lets try this as our ssh pass for users valentine,heart,hype,etc

aaand we are in 

{{< figure src="image 173.png" >}}

now we will probably have to escalate our privileges

after using a simple python server paired with wget to get linpeas running on our victims system 

{{< figure src="image 174.png" >}}

we are able to identify that tmux is running , thats great we can use this to elevate our priv

tmux -S /.devs/dev_sess

typing this connects us to the session and we can now grab our flags

root flag

{{< figure src="image 175.png" >}}

user flag

{{< figure src="image 176.png" >}}
