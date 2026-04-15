---
title: "Codo"
date: 2026-03-16
draft: false
description: "OffSec Codo writeup"
tags: ["linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Codo

## Overview

- **OS:** Linux
- **IP:** 192.168.192.23
- **Difficulty:** Easy
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

default creds on web portal —> file upload —> exposed creds.

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

{{< figure src="image 674.png" >}}

## Exploitation

admin admin default creds worked lmaooo

{{< figure src="image 675.png" >}}

{{< figure src="image 676.png" >}}

{{< figure src="image 677.png" >}}

we find this

[https://www.exploit-db.com/exploits/50978](https://www.exploit-db.com/exploits/50978)

made some changes here

{{< figure src="image 678.png" >}}

and then accessed the payload

{{< figure src="image 679.png" >}}

{{< figure src="image 680.png" >}}

we just used a simple pentestmonkey rev shell btw

anyways we are in 

{{< figure src="image 681.png" >}}

## PrivESC
