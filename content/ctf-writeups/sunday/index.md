---
title: "Sunday"
date: 2024-08-24
draft: false
description: "HackTheBox Sunday writeup"
tags: ["hackthebox", "htb", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Sunday

## Overview

- **OS:** Solaris
- **IP:** 10.10.10.76
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

pwned box sunday, learnt to do username enumeration for finger service nd crack hash with john.

## Enumeration

{{< figure src="image 1071.png" >}}

ok so finger seems to be running, lets start with enumerating for users

we will use this pentest monkey script for the enumeration

[https://pentestmonkey.net/tools/user-enumeration/finger-user-enum](https://pentestmonkey.net/tools/user-enumeration/finger-user-enum)

{{< figure src="image 1072.png" >}}

we got sammy and sunny as the users after doing some user enum

{{< figure src="image 1073.png" >}}

## Exploitation


lets now use these creds to access ssh 

guessing the box name sunday as the password works 

{{< figure src="image 1074.png" >}}

navigating to /backup we find two hashes , lets break them with john

{{< figure src="image 1075.png" >}}

we will use this to identify the hash 

[https://hashes.com/en/tools/hash_identifier](https://hashes.com/en/tools/hash_identifier)

{{< figure src="image 1076.png" >}}

{{< figure src="image 1077.png" >}}

{{< figure src="image 1078.png" >}}

and we got the pass as cooldude!

{{< figure src="image 1079.png" >}}

and we are done , we have our root shell

user flag

{{< figure src="image 1080.png" >}}

root flag

{{< figure src="image 1081.png" >}}
