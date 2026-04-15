---
title: "Crane"
date: 2026-03-17
draft: false
description: "OffSec Crane writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Crane

## Overview

- **OS:** Linux
- **IP:** 192.168.192.146
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

easy adminadmin and exploit rce privesc with sudo -l.

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

{{< figure src="image 701.png" >}}

## Exploitation

Once the primitive was confirmed, I converted it into a stable foothold and chained it forward.

admin admin just let us in lol

{{< figure src="image 702.png" >}}

{{< figure src="image 703.png" >}}

found this cve for it

{{< figure src="image 704.png" >}}

{{< figure src="image 705.png" >}}

## PrivESC

Local enumeration exposed the misconfiguration, and the escalation path below was enough to move up.

{{< figure src="image 706.png" >}}

interesting

and GTFO bins had one for this boom

{{< figure src="image 707.png" >}}
