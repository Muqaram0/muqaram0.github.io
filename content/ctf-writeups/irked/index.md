---
title: "irked"
date: 2024-09-29
draft: false
description: "HackTheBox irked writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# irked

## Overview

- **OS:** Linux
- **IP:** 10.10.10.117
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

Enumerated box irked, found a backdoor exploit for service UnrealIRCd , got a shell, got password to some steg backup, learnt to use the tool steghide to pull information from a image which allowed me to ssh into the box , elevated priv to root using a suid binary called viewusers.

## Enumeration

Nmap scan results

{{< figure src="image 121.png" >}}

because htb asks us whats running on port 8067, lets check that also out since this scan did not give us that port back.

{{< figure src="image 122.png" >}}

homepage

{{< figure src="image 123.png" >}}

dirbusting

{{< figure src="image 124.png" >}}

/man page

{{< figure src="image 125.png" >}}

## Vulnerabilities

{{< figure src="image 126.png" >}}

## Exploitation


ok so on inspecting the backdoor vulnerability we found earlier,  we notice that the way the exploit worksis by starting off the payload with AB in the string , this makes it so that the pc that we are attacking recognizes it is a system command, this could lead us to a rev shell so lets try it out

{{< figure src="image 127.png" >}}

we first setup our traffic monitor

{{< figure src="image 128.png" >}}

ok so it works

{{< figure src="image 129.png" >}}

{{< figure src="image 130.png" >}}

lets get our rev shell now

{{< figure src="image 131.png" >}}

and we have our shell

{{< figure src="image 132.png" >}}

{{< figure src="image 133.png" >}}

we dont have the perms to view the user flag so lets do some priv esc

{{< figure src="image 134.png" >}}

we find the password of some super elite backup??

UPupDOWNdownLRlrBAbaSSss

since it seems to be referencing to steg , letsuse the steghide tool on the image which was on the homepage 

{{< figure src="image 135.png" >}}

lets try switching to the other user with this password now

ok so using su directly did not work 

{{< figure src="image 136.png" >}}

but we were able to log in via ssh

{{< figure src="image 137.png" >}}

we got our user flag, now lets try elevating for grabbing the root flag

we hsot linpeas from our box using a simple python server and then use wget to grab it.

{{< figure src="image 138.png" >}}

we find something called /usr/bin/viewuser which looks interesting, lets try running it 

This binary had a SUID (**S**et owner **U**ser **ID**) flag set. It basically meaned anyone who run the application would be given a temporary privilege as the owner of the file/program. As the owner of this file is root, our user would be given a temporary permission as a root. -@rblayke1

{{< figure src="image 139.png" >}}

it gives us an error saying not found

{{< figure src="image 140.png" >}}

ok so it was looing for a listusers tfile to execute, we created our own listusers file with the bash shell that we need, it executes that as root and gives us a root shell.

root flag

{{< figure src="image 141.png" >}}
