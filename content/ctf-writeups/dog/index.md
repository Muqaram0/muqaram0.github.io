---
title: "Dog"
date: 2026-02-20
draft: false
description: "HackTheBox Dog writeup"
tags: ["hackthebox", "htb", "linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Dog

## Overview

- **OS:** Linux
- **IP:** 10.129.5.109
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Got access via exposed creds on git, then used an authenticated rce to get access, switched users and ran binary bee as sudo to get sudo perms.

## Loot

| **Takeaways** |  |
| --- | --- |
| **Category** | **Details** |
| Usernames+Passwords | dogBackDropSystem

Anonymous
tiffany:BackDropJ2024DS2024
jobert:BackDropJ2024DS2024 |
| Hashes | $S$E7dig1GTaGJnzgAXAtOoPuaTjJ05fo8fH9USc6vO87T./ffdEr/.
$S$E/F9mVPgX4.dGDeDuKxPdXEONCzSvGpjxUeMALZ2IjBrve9Rcoz1
$S$EfD1gJoRtn8I5TlqPTuTfHRBFQWL3x6vC5D3Ew9iU4RECrNuPPdD
$S$EYniSfxXt8z3gJ7pfhP5iIncFfCKz8EIkjUD66n/OTdQBFklAji.
$S$E8OFpwBUqy/xCmMXMqFp3vyz1dJBifxgwNRMKktogL7VVk7yuulS
$S$E/DHqfjBWPDLnkOP5auHhHDxF4U.sAJWiODjaumzxQYME6jeo9qV
$S$EsV26QVPbF.s0UndNPeNCxYEP/0z2O.2eLUNdKW/xYhg2.lsEcDT
$S$EEAGFzd8HSQ/IzwpqI79aJgRvqZnH4JSKLv2C83wUphw0nuoTY8v
 |
## Enumeration
- **nmap**

HUGE

{{< figure src="image 382.png" >}}

{{< figure src="image 383.png" >}}

- **dirb**
- **sub**
- **80**

{{< figure src="image 384.png" >}}

{{< figure src="image 385.png" >}}

hmm so when we used this cred we were getting unknown pass

{{< figure src="image 386.png" >}}

let me have hydra running in the background doing this

now lets check 

{{< figure src="image 387.png" >}}

/core 

{{< figure src="image 388.png" >}}

{{< figure src="image 389.png" >}}

/README.md

{{< figure src="image 390.png" >}}

{{< figure src="image 391.png" >}}

with this i can tell that it is backdrop version 1.22.0 maybe

found this RCE path, but need admin privs

https://grimthereaperteam.medium.com/backdrop-cms-1-22-0-unrestricted-file-upload-layouts-ce49a6b7e521 kali ( found out it is actually 1.27.1 instead by looking at the testing folder lol )

i think the robotstxt was a loophole, so im gonna check the git repo now

let me dump it

looking at the settings we find this

{{< figure src="image 392.png" >}}

we also find the user tiffany

{{< figure src="image 393.png" >}}

## Exploitation

i had to use a writeup to find out how to locate tiffany, but lets try using hydra nd brutefrorcing the username w the pass we found

BackDropJ2024DS2024

{{< figure src="image 394.png" >}}

lets move on w tiffany fr now

{{< figure src="image 395.png" >}}

lets follow this cve for RCE now

[Backdrop CMS 1.27.1 - Authenticated Remote Command Execution (RCE)](https://www.exploit-db.com/exploits/52021)

{{< figure src="image 396.png" >}}

wasnt working so we tried this github one instead

https://github.com/rvizx/backdrop-rce/blob/main/README.md

{{< figure src="image 397.png" >}}

{{< figure src="image 398.png" >}}

there is an ssh folder in jobert, lets take that

{{< figure src="image 399.png" >}}

damn we cant take it we gotta find another way

so there is apparently mysql open on this

{{< figure src="image 400.png" >}}

lets access it after pivoting

{{< figure src="image 401.png" >}}

boom we have access with the root creds

{{< figure src="image 402.png" >}}

apparerently, this is not the intended path and cracking the hashes will take too much time

instead we can ssh with jobert as the user and the same pass from before

now we can apparently run bee as sudo so lets check it out

{{< figure src="image 403.png" >}}

sudo /usr/local/bin/bee eval ‘system(”bash”);’

{{< figure src="image 404.png" >}}
