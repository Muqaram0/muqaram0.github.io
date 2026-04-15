---
title: "Intentions"
date: 2025-12-20
draft: false
description: "HackTheBox Intentions writeup"
tags: ["hackthebox", "htb", "linux", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Intentions

## Overview

- **OS:** Linux
- **IP:** 10.129.229.27
- **Difficulty:** Hard
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

This writeup covers the full attack path for Intentions, including enumeration, exploitation, and privilege escalation.

## Enumeration

I started broad, validated each finding, and then focused only on paths that were reproducible.

nmap scan results

{{< figure src="image 224.png" >}}

Port 80

{{< figure src="image 225.png" >}}

Dirsearch

{{< figure src="image 226.png" >}}

## Vulnerabilities
## Exploitation
