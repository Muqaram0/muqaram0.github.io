---
title: "Kevin"
date: 2026-03-30
draft: false
description: "OffSec Kevin writeup"
tags: ["windows", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Kevin

## Overview

- **OS:** Windows
- **IP:** 192.168.139.45
- **Difficulty:** Easy
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

easy RCE no privesc direct NT.

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

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 927.png" >}}

## Exploitation

Once the primitive was confirmed, I converted it into a stable foothold and chained it forward.

got in with default creds

{{< figure src="image 928.png" >}}

{{< figure src="image 929.png" >}}
