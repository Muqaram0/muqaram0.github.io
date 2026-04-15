---
title: "Beep"
date: 2024-07-18
draft: false
description: "HackTheBox Beep writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Beep

## Overview

- **OS:** Linux
- **IP:** 10.10.10.7
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

Learnt how to use local file intrusion exploit for directory traversal.

## Enumeration


nmap scan results

{{< figure src="Untitled 177.png" >}}

{{< figure src="Untitled 178.png" >}}

Not able to access the page?

{{< figure src="Untitled 179.png" >}}

lets change our min tls setting in about:config 

{{< figure src="Untitled 180.png" >}}

now we can view the homepage

{{< figure src="Untitled 181.png" >}}

## Vulnerabilities


Elastix local file inclusion vulnerability

https://www.exploit-db.com/exploits/37637

## What is LFI ?

An attacker can use [Local File Inclusion (LFI)](https://www.invicti.com/learn/local-file-inclusion-lfi/)
 to trick the web application into exposing or running files on the web 
server. An LFI attack may lead to information disclosure, remote code 
execution, or even [Cross-site Scripting (XSS)](https://www.invicti.com/learn/cross-site-scripting-xss/).
 Typically, LFI occurs when an application uses the path to a file as 
input. If the application treats this input as trusted, a local file may
 be used in the include statement.

Local File Inclusion is very similar to [Remote File Inclusion (RFI)](https://www.invicti.com/learn/remote-file-inclusion-rfi/). However, an attacker using LFI may only include local files (not remote files like in the case of RFI).

## Directory Traversal

Even without the ability to upload and execute code, a Local File 
Inclusion vulnerability can be dangerous. An attacker can still perform a
 [Directory Traversal / Path Traversal attack](https://www.acunetix.com/websitesecurity/directory-traversal/) using an LFI vulnerability as follows.

```ruby
    http://example.com/?file=../../../../etc/passwd
```

In the above example, an attacker can get the contents of the 
/etc/passwd file that contains a list of users on the server. Similarly,
 an attacker may leverage the Directory Traversal vulnerability to 
access log files (for example, Apache access.log or error.log), source 
code, and other sensitive information. This information may then be used
 to advance an attack.

## Exploitation


Lets use the LFI vulnerability we found earlier to perform our directory traversal

{{< figure src="Untitled 182.png" >}}

damn it works , now lets check if we can find anything useful from this page

{{< figure src="Untitled 183.png" >}}

{{< figure src="Untitled 184.png" >}}

{{< figure src="Untitled 185.png" >}}

lets try using these credentials to access the machine via ssh

{{< figure src="Untitled 186.png" >}}

and there we go , we got access now lets look for the flags

root flag

{{< figure src="Untitled 187.png" >}}

user flag

{{< figure src="Untitled 188.png" >}}

**pwned**

{{< figure src="image 1082.png" >}}

{{< figure src="image 1083.png" >}}
