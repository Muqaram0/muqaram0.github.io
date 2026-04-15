---
title: "Extplorer"
date: 2026-03-17
draft: false
description: "OffSec Extplorer writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Extplorer

## Overview

- **OS:** Linux
- **IP:** 192.168.192.27
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

easy php shell esc privs with exposed pass in config and disk perm for privesc.

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
ORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 98:4e:5d:e1:e6:97:29:6f:d9:e0:d4:82:a8:f6:4f:3f (RSA)
|   256 57:23:57:1f:fd:77:06:be:25:66:61:14:6d:ae:5e:98 (ECDSA)
|_  256 c7:9b:aa:d5:a6:33:35:91:34:1e:ef:cf:61:a8:30:1c (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)

```

## Dirbusting

I expanded the attack surface with content discovery and followed only the valid hits.

{{< figure src="image 686.png" >}}

## Port 80

## Exploitation

{{< figure src="image 687.png" >}}

{{< figure src="image 688.png" >}}

{{< figure src="image 689.png" >}}

{{< figure src="image 690.png" >}}

file manager takes us here

{{< figure src="image 691.png" >}}

{{< figure src="image 692.png" >}}

{{< figure src="image 693.png" >}}

{{< figure src="image 694.png" >}}

{{< figure src="image 695.png" >}}

so simple

{{< figure src="image 696.png" >}}

```
if( !defined( '_JEXEC' ) && !defined( '_VALID_MOS' ) ) die( 'Restricted access' );
        $GLOBALS["users"]=array(
        array('admin','21232f297a57a5a743894a0e4a801fc3','/var/www/html','http://localhost','1','','7',1),
        array('dora','$2a$08$zyiNvVoP/UuSMgO2rKDtLuox.vYj.3hZPVYq3i4oG3/CtgET7CjjS','/var/www/html','http://localhost','1','','0',1),

```

lets try cracking first, if that doesnt work then lets msql

{{< figure src="image 697.png" >}}

well that was quick

lets su

that worked, now lets run linpeas

lets try this cuz we have disk priv

[https://www.hackingarticles.in/disk-group-privilege-escalation/](https://www.hackingarticles.in/disk-group-privilege-escalation/)

{{< figure src="image 698.png" >}}

{{< figure src="image 699.png" >}}

we only have read perms hmm

{{< figure src="image 700.png" >}}

cracking this gave us the pass as explorer

easy
