---
title: "Scrutiny"
date: 2026-03-21
draft: false
description: "OffSec Scrutiny writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Scrutiny

## Overview

- **OS:** Linux
- **IP:** 192.168.126.91
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

RCE and then privesc with mail and exposed creds.

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

Nmap was my starting point here, and the service/version clues below shaped the next checks.

{{< figure src="image 755.png" >}}

lets add [onlyrands.com](http://onlyrands.com) to our hosts

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 756.png" >}}

add this to our hosts aswell

{{< figure src="image 757.png" >}}

great i think we can try getting in from here lets check

{{< figure src="image 758.png" >}}

## Exploitation

[https://github.com/joshuavanderpoll/cve-2024-56348](https://github.com/joshuavanderpoll/cve-2024-56348)

{{< figure src="image 759.png" >}}

aa

lfound a 0xdf post telling us to enable debug first so lets do that

{{< figure src="image 760.png" >}}

```
export TOKEN="<TOKEN HERE>"
```

checking around the website because that failed

we find this

{{< figure src="image 761.png" >}}

{{< figure src="image 762.png" >}}

{{< figure src="image 763.png" >}}

{{< figure src="image 764.png" >}}

{{< figure src="image 765.png" >}}

we got mail

{{< figure src="image 766.png" >}}

{{< figure src="image 767.png" >}}

{{< figure src="image 768.png" >}}

{{< figure src="image 769.png" >}}

{{< figure src="image 770.png" >}}

{{< figure src="image 771.png" >}}
