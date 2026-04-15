---
title: "Nineveh"
date: 2024-07-22
draft: false
description: "HackTheBox Nineveh writeup"
tags: ["hackthebox", "htb", "linux", "medium"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Nineveh

## Overview

- **OS:** Linux
- **IP:** 10.10.10.43
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

intended user path via portknocking left, http://linenum.sh , chrootkit vuln, cron job , process script, burp, binwalk.

## Loot

| notes parameter | Error Message |
| --- | --- |
| `ninevehNotes.txt` | No error, displays note |
| `/etc/passwd` | No Note is selected. |
| `../../../../../../../../../../etc/passwd` | No Note is selected. |
| `ninevehNotes` | Warning: include(files/ninevehNotes): failed to open stream: No such file or directory in /var/www/html/department/manage.php on line 31 |
| `ninevehNote` | No Note is selected. |
| `files/ninevehNotes/../../../../../../../../../etc/passwd` | File name too long. |
| `files/ninevehNotes/../../../../../../../etc/passwd` | The contents of `/etc/passwd` |
| `/ninevehNotes/../etc/passwd` | The contents of `/etc/passwd` |

## Enumeration


nmap scan results

{{< figure src="Untitled 267.png" >}}

supported http methods

{{< figure src="Untitled 268.png" >}}

dirbusting results for http

{{< figure src="Untitled 269.png" >}}

dirbusting results for https

*we have to specify -k flag*

{{< figure src="Untitled 270.png" >}}

lets visit this page

{{< figure src="Untitled 271.png" >}}

## Vulnerabilities

phpLiteAdmin v 1.9 vuln

{{< figure src="Untitled 272.png" >}}

## Exploitation


lets try bruteforcing the php lite admin login page with hydra and see if it works out

{{< figure src="Untitled 273.png" >}}

alright so we got password 123 as the pass, now lets try accessing and see whats up

{{< figure src="Untitled 274.png" >}}

we are greeted with this page where we can infer that there is a database named test with no tables

we will be using this php injection exploit

{{< figure src="Untitled 275.png" >}}

{{< figure src="Untitled 276.png" >}}

{{< figure src="Untitled 277.png" >}}

now lets try to get into this page from earlier

{{< figure src="Untitled 278.png" >}}

{{< figure src="Untitled 279.png" >}}

using burp it shows the post form as this

now assuming that the password check is hardcoded to be just a simple strcmp between two fields.

we know that if we do strcmp between two equal strings it returns 0 which means its equal.
suppose we give a invalid type as one of the fields, then in this case itll return null which is comparable to 0. lets try this approach by modifying the post data

{{< figure src="Untitled 280.png" >}}

and boom we in

{{< figure src="Untitled 281.png" >}}

{{< figure src="Untitled 282.png" >}}

on visiting the notes page we are greeted with this , if we look carefully we can see that the file is being mentioned in the url, lets check for lfi.


with this we can infer that as long as nineveh notes is there in the parameter we can access anyhing , lets try to access the shell we created before

and we are greeted with this

{{< figure src="Untitled 283.png" >}}

now lets check for cmd exec with ls

{{< figure src="Untitled 284.png" >}}

cool so we can execute commands,  lets try getting a reverse shell with burpsuite now

with this url encoded reverse shell code

{{< figure src="Untitled 285.png" >}}

{{< figure src="Untitled 286.png" >}}

nice , we have access as www-data , now lets escalate our privileges

- **Privilege escalation**


{{< figure src="Untitled 287.png" >}}

upgrading our shell

{{< figure src="Untitled 288.png" >}}

{{< figure src="Untitled 289.png" >}}

lets get our [linenum.sh](http://linenum.sh) on a http server and make it available for this machine 

{{< figure src="Untitled 290.png" >}}

{{< figure src="Untitled 291.png" >}}

{{< figure src="Untitled 292.png" >}}

ok so we can access amrois folder but we cant view the flag, lets look around more

{{< figure src="Untitled 293.png" >}}

hm amrois has access to only this folder 

{{< figure src="Untitled 294.png" >}}

ok so we notice that the reports are being made every minute , there may be a cron job behind this

lets try creating our own script

{{< figure src="Untitled 295.png" >}}

```python
        #!/bin/bash
        #loop by line
        IFS=$'\n'
        old_process=$(ps -eo command)
        while true; do
        new_process=$(ps -eo command)
        diff <(echo "$old_process") <(echo "$new_process") |grep [\<\>]
        sleep 1
        old_process=$new_process
        done
```

now we do chmod +x/procmon.sh followed by ./procmon.sh to run the script

{{< figure src="Untitled 296.png" >}}

ok so we can see that these are the cron jobs that are running every minute 

it seems to be executing the path /usr/bin/chkrootkit

chkrootkit vulnerabilities

{{< figure src="Untitled 297.png" >}}

{{< figure src="Untitled 298.png" >}}

lets use this

{{< figure src="Untitled 299.png" >}}

and there we go , we got our shell with root privilege

{{< figure src="Untitled 300.png" >}}

lets grab our flags

root flag

{{< figure src="Untitled 301.png" >}}

user flag

{{< figure src="Untitled 302.png" >}}

- **Intended route for user**


ok so remember the secure notes page which showed a image file? lets check that out

{{< figure src="Untitled 303.png" >}}

on downloading the image and performing a binwalk we get these files that were hidden along with it

{{< figure src="Untitled 304.png" >}}

lets check these files out now

{{< figure src="Untitled 305.png" >}}

now lets check those files we got if there is anything interesting

{{< figure src="Untitled 306.png" >}}

and there we go we got a key nd something else

{{< figure src="Untitled 307.png" >}}
