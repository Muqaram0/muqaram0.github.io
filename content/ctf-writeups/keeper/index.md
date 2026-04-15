---
title: "keeper"
date: 2026-01-08
draft: false
description: "HackTheBox keeper writeup"
tags: ["hackthebox", "htb", "linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# keeper

## Overview

- **OS:** Linux
- **IP:** 10.129.229.41
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Accessed request tracker software with default creds , found credws in one of the queues for ssh access, ssh as user and found a keypass memory dump file, used script to get masterkey fromt he memory dump which later gave us root access when investigating using kpcli.

## Loot

| **Takeaways** |  |  |
| --- | --- | --- |
| **Usernames** | root/password

Inorgaard@keeper.htb/Welcome2023! | Inorgaard Helpdesk Agent
webmaster@keeper.htb
rt@keeper.htb
Lise |
| **Subdomains** | tickets.keeper.htb |  |
|  |  | rø`dgrød med fløde` |
## Enumeration
- **nmap scan result**

{{< figure src="image 281.png" >}}

- 80

{{< figure src="image 282.png" >}}

Lets visit the subdomain we found and perform dirbusting on it

apparently its using a softwarer called request tracker lets see what it does w chatgpt

hmmm. so its like a place like github where everythign is organized in requests, and i can see that we can request for admin? like give me admin access thats interesting

»|« RT 4.4.4+dfsg-2ubuntu1 (Debian) Copyright 1996-2019 Best Practical Solutions, LLC.

apparently its version 4.4.4 aswell

we got access using default creds root/password

{{< figure src="image 283.png" >}}

in one of the js files we found with dirbusting we find this

{{< figure src="image 284.png" >}}

## Exploitation

{{< figure src="image 285.png" >}}

{{< figure src="image 286.png" >}}

ok so on clicking download on this test ticket we are able to view it 

{{< figure src="image 287.png" >}}

{{< figure src="image 288.png" >}}

hmm, on editing the user we also see this 

{{< figure src="image 289.png" >}}

and with those creds we can ssh and grab the user flag

{{< figure src="image 290.png" >}}

now lets esc priv

lets get the keypass dumper

 `git clone https://github.com/vdohney/keepass-password-dumper`

we get this as the password which we can now use as the master key
rødgrød med fløde

`kpcli --kdb passcodes.kdb`

{{< figure src="image 291.png" >}}

we find the putty which we convert into an  ssh key using puttygen

{{< figure src="image 292.png" >}}
